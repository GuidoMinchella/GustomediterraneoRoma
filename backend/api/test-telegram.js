import { cors, handleOptions, parseJsonBody } from '../lib/_utils.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  cors(req, res);

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({
      ok: false,
      error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment',
    });
  }

  try {
    let text = 'Test ordine';
    if (req.method === 'GET') {
      text = String(req.query?.text || text);
    } else if (req.method === 'POST') {
      const body = await parseJsonBody(req);
      text = String(body?.text || text);
    }

    const tgResp = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
    const tgJson = await tgResp.json();

    const payload = {
      ok: Boolean(tgJson?.ok),
      status: tgResp.status,
      description: tgJson?.description,
      result: tgJson?.result,
    };

    if (!tgJson?.ok) {
      console.warn('[Telegram Test] Failed:', payload);
      return res.status(200).json(payload);
    }

    return res.status(200).json(payload);
  } catch (err) {
    console.error('[Telegram Test] Error:', err?.message || err);
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
}
