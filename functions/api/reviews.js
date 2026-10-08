// Public review API  →  /api/reviews
//   GET  → approved reviews (never phone numbers)
//   POST → { name, phone, rating, text? } saved as "pending" until the clinic approves it
import { cleanText, db, json, normalizePhone } from '../../server/reviews.js';

export async function onRequestGet({ env }) {
  try {
    const { results } = await (await db(env))
      .prepare(
        `SELECT id, name, rating, text, created_at AS createdAt
         FROM reviews WHERE status = 'approved' ORDER BY approved_at DESC`
      )
      .all();
    return json(results, 200, { 'Cache-Control': 'public, max-age=30' });
  } catch (err) {
    console.error('GET /api/reviews failed', err);
    return json({ error: 'server' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid' }, 400);
  }

  // Honeypot: real visitors never see or fill this field
  if (body.company) return json({ ok: true });

  const name = cleanText(body.name, 60).replace(/\n/g, ' ');
  const text = cleanText(body.text, 800);
  const phone = normalizePhone(body.phone);
  const rating = Number(body.rating);
  if (name.length < 2) return json({ error: 'name' }, 400);
  if (!phone) return json({ error: 'phone' }, 400);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json({ error: 'rating' }, 400);

  try {
    await (await db(env))
      .prepare(`INSERT INTO reviews (id, name, phone, rating, text, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(crypto.randomUUID(), name, phone, rating, text, new Date().toISOString())
      .run();
    return json({ ok: true }, 201);
  } catch (err) {
    // phone is UNIQUE: one review per number
    if (String(err?.message || err).includes('UNIQUE')) return json({ error: 'duplicate' }, 409);
    console.error('POST /api/reviews failed', err);
    return json({ error: 'server' }, 500);
  }
}
