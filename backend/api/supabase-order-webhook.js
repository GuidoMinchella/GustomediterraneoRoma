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

async function fetchOrderItems(orderId) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    // If not configured yet, return empty list; we'll still send the order header
    return [];
  }
  const endpoint = `${url.replace(/\/$/, '')}/rest/v1/order_items?order_id=eq.${encodeURIComponent(orderId)}&select=dish_name,quantity,quantiti,dish_price,pricing_type,weight_grams`;
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

    // Fetch items
    const items = await fetchOrderItems(orderId);

    // Build message
    const text = buildOrderMessage(record, items);

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
