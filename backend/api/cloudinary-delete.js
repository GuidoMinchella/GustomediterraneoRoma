import { v2 as cloudinary } from 'cloudinary';
import { cors, handleOptions, parseJsonBody } from '../lib/_utils.js';

export default async function handler(req, res) {
  cors(req, res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
  const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({ error: 'Cloudinary non configurato sul server' });
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  try {
    const body = await parseJsonBody(req);
    const { public_id } = body || {};
    if (!public_id || typeof public_id !== 'string') {
      return res.status(400).json({ error: 'public_id mancante o non valido' });
    }

    const result = await cloudinary.uploader.destroy(public_id, { invalidate: true });
    return res.status(200).json({ result });
  } catch (err) {
    console.error('[Cloudinary] Errore eliminazione', err);
    return res.status(500).json({ error: err?.message || 'Errore eliminazione Cloudinary' });
  }
}
