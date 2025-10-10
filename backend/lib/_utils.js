import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export function cors(req, res) {
  const requestOrigin = req.headers?.origin;
  const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_2,
    'https://gustomediterraneoroma.it',
    'https://www.gustomediterraneoroma.it',
  ].filter(Boolean);

  let originToUse = process.env.CLIENT_URL || '*';
  if (requestOrigin && allowedOrigins.includes(String(requestOrigin))) {
    originToUse = requestOrigin;
  }

  res.setHeader('Access-Control-Allow-Origin', originToUse);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (originToUse !== '*') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}

export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    cors(req, res);
    res.status(200).end();
    return true;
  }
  return false;
}

export async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

export async function getOrCreateCustomerByEmail(email, name, userId) {
  if (!email) return null;
  const normalizedEmail = String(email).trim().toLowerCase();
  try {
    const existing = await stripe.customers.list({ email: normalizedEmail, limit: 1 });
    if (existing?.data && existing.data.length > 0) {
      return existing.data[0].id;
    }
    const created = await stripe.customers.create({
      email: normalizedEmail,
      name: name ? String(name) : undefined,
      metadata: { user_id: String(userId || '') },
    });
    return created.id;
  } catch (err) {
    console.warn('[Stripe] Customer lookup/create failed:', err?.message || err);
    return null;
  }
}
