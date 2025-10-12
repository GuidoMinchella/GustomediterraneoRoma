import { cors, handleOptions } from '../lib/_utils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  cors(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const orderId = String(req.query?.order_id || '').trim();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!orderId) {
    return res.status(400).json({ ok: false, error: 'Missing order_id query param' });
  }
  if (!url || !key) {
    return res.status(500).json({ ok: false, error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' });
  }

  try {
    const endpoint = `${url.replace(/\/$/, '')}/rest/v1/order_items?order_id=eq.${encodeURIComponent(orderId)}&select=dish_name,quantity,quantiti,dish_price,pricing_type,weight_grams`;
    const resp = await fetch(endpoint, {
      method: 'GET',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: 'application/json',
      },
    });
    const text = await resp.text();
    let data = null;
    try { data = JSON.parse(text); } catch { data = text; }
    return res.status(200).json({ ok: resp.ok, status: resp.status, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
}
