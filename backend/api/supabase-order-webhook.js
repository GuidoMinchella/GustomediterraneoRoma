import { cors, handleOptions, parseJsonBody } from '../lib/_utils.js';

// Helper: format numbers to Euro
function formatEuro(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value ?? '');
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(num);
}

// Helper: build Telegram message text
function buildOrderMessage(orderRecord, items = []) {
  const {
    id,
    customer_name,
    customer_email,
    customer_phone,
    pickup_date,
    pickup_time,
    payment_method,
    total_amount,
  } = orderRecord || {};

  const header = [
    `Nuovo ordine #${id}`,
    `Cliente: ${customer_name || '-'} (${customer_email || '-'})`,
    `Telefono: ${customer_phone || '-'}`,
    `Ritiro: ${pickup_date || '-'} ${pickup_time || ''}`.trim(),
    `Pagamento: ${payment_method || '-'}`,
    `Totale: ${formatEuro(total_amount)}`,
  ].join('\n');

  const lines = items.map((it) => {
    const qtyRaw = it.quantity ?? it.quantiti; // support typo 'quantiti'
    const qty = Number(qtyRaw) || 1;
    const qtyText = `x${qty}`;
    const byWeight = String(it.pricing_type || '').toLowerCase() === 'by_weight';
    const grams = Number(it.weight_grams);
    const gramsText = byWeight && Number.isFinite(grams) ? ` • ${grams}g` : '';
    const priceText = `\n${formatEuro(it.dish_price)}`; // on next line
    return `• ${qtyText} ${it.dish_name || '-'}${gramsText}${priceText}`;
  });

  const body = lines.length > 0 ? `\n\nArticoli:\n${lines.join('\n')}` : '';
  return `${header}${body}`;
}

// Fetch latest order by id from Supabase REST
async function fetchOrderById(orderId) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return null;
  }
  const endpoint = `${url.replace(/\/$/, '')}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&select=id,customer_name,customer_email,customer_phone,pickup_date,pickup_time,payment_method,total_amount,original_amount`;
  const resp = await fetch(endpoint, {
    method: 'GET',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    console.warn('[Supabase REST] orders fetch failed:', resp.status, text);
    return null;
  }
  const data = await resp.json().catch(() => []);
  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }
  return null;
}

// Retry helper to wait for discounted total_amount to be available
// Default ~7s total wait to fit under a 10s webhook timeout
async function fetchOrderWithRetry(orderId, attempts = 10, delayMs = 700) {
  let last = null;
  for (let i = 0; i < attempts; i++) {
    const order = await fetchOrderById(orderId);
    if (order) {
      last = order;
      // Prefer returning when total_amount is present (discount applied)
      if (order.total_amount !== null && order.total_amount !== undefined) {
        return order;
      }
    }
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return last; // may be null or pre-discount; caller will fallback to record
}

async function fetchOrderItems(orderId) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    // If not configured yet, return empty list; we'll still send the order header
    return [];
  }
  const endpoint = `${url.replace(/\/$/, '')}/rest/v1/order_items?order_id=eq.${encodeURIComponent(orderId)}&select=*`;
  const resp = await fetch(endpoint, {
    method: 'GET',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    console.warn('[Supabase REST] order_items fetch failed:', resp.status, text);
    return [];
  }
  const data = await resp.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

// Retry helper to wait for order_items to be inserted shortly after orders
// Default ~7s total wait to fit under a 10s webhook timeout
async function fetchOrderItemsWithRetry(orderId, attempts = 10, delayMs = 700) {
  for (let i = 0; i < attempts; i++) {
    const items = await fetchOrderItems(orderId);
    if (Array.isArray(items) && items.length > 0) return items;
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return [];
}

export default async function handler(req, res) {
  cors(req, res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = await parseJsonBody(req);

    // Supabase Database Webhooks payload typically includes: type, table, schema, record
    const table = body?.table || body?.source?.table;
    const type = body?.type || body?.eventType;
    const record = body?.record || body?.new || body?.payload?.record || body?.data?.new;

    if (String(table) !== 'orders' || String(type).toUpperCase() !== 'INSERT') {
      return res.status(200).json({ ok: true, ignored: true });
    }

    const orderId = record?.id;
    if (!orderId) {
      return res.status(400).json({ error: 'Missing order id in webhook record' });
    }

    // Optionally verify HMAC signature if provided
    const secret = process.env.SUPABASE_WEBHOOK_SECRET;
    if (secret) {
      try {
        const signature = req.headers['x-supabase-signature'] || req.headers['x-signature'];
        // Best-effort check: compare existence; full HMAC requires raw body
        if (!signature) {
          console.warn('[Webhook] Missing signature header, but secret configured');
        }
      } catch (e) {
        console.warn('[Webhook] Signature check error:', e?.message || e);
      }
    }

    // Fetch items with short backoff, as they may be inserted right after the order
    const items = await fetchOrderItemsWithRetry(orderId);
    const normItems = Array.isArray(items)
      ? items.map((it) => ({
          dish_name: it.dish_name ?? it.name ?? it.title,
          quantity: it.quantity ?? it.quantiti ?? it.qty ?? it.qta,
          dish_price: it.dish_price ?? it.price ?? it.unit_price ?? it.subtotal,
          pricing_type: it.pricing_type,
          weight_grams: it.weight_grams ?? it.grams ?? it.weight,
        }))
      : [];

    // Build message using latest order from DB to ensure discounted total_amount
    const latestOrder = await fetchOrderWithRetry(orderId);
    const effectiveOrder = latestOrder || record || {};
    const text = buildOrderMessage(effectiveOrder, normItems);

    // Send to Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
      console.error('[Telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
      return res.status(500).json({ error: 'Telegram config missing' });
    }

    const tgResp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    if (!tgResp.ok) {
      const errText = await tgResp.text().catch(() => '');
      console.error('[Telegram] sendMessage failed:', tgResp.status, errText);
      return res.status(502).json({ error: 'Failed to send Telegram message' });
    }

    const result = await tgResp.json().catch(() => ({ ok: true }));
    return res.status(200).json({ ok: true, telegram: result });
  } catch (err) {
    console.error('[Webhook] Error:', err?.message || err);
    return res.status(500).json({ error: 'Webhook processing failed', message: err?.message });
  }
}
