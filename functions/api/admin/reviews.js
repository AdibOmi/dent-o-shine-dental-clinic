// Clinic-only review moderation  →  /api/admin/reviews
// Requires the ADMIN_PASSWORD secret (Pages project → Settings → Variables and Secrets).
//   GET                       → every review, including phone numbers
//   POST { action, id }       → action: 'approve' | 'unpublish' | 'delete'
import { db, isAdmin, json } from '../../../server/reviews.js';

export async function onRequest({ request, env }) {
  try {
    if (!env.ADMIN_PASSWORD) return json({ error: 'not-configured' }, 503);
    if (!(await isAdmin(request, env))) {
      // Slow down password guessing
      await new Promise((r) => setTimeout(r, 800));
      return json({ error: 'unauthorized' }, 401);
    }
    const DB = await db(env);

    if (request.method === 'GET') {
      const { results } = await DB.prepare(
        `SELECT id, name, phone, rating, text, status, created_at AS createdAt
         FROM reviews ORDER BY created_at DESC`
      ).all();
      return json(results, 200, { 'Cache-Control': 'no-store' });
    }
    if (request.method !== 'POST') return json({ error: 'method' }, 405);

    const { action, id } = await request.json();
    const queries = {
      approve: [`UPDATE reviews SET status = 'approved', approved_at = ? WHERE id = ?`, new Date().toISOString(), id],
      unpublish: [`UPDATE reviews SET status = 'pending' WHERE id = ?`, id],
      delete: [`DELETE FROM reviews WHERE id = ?`, id],
    };
    if (!queries[action]) return json({ error: 'action' }, 400);
    const [sql, ...args] = queries[action];
    const { meta } = await DB.prepare(sql).bind(...args).run();
    if (!meta.changes) return json({ error: 'not-found' }, 404);
    return json({ ok: true });
  } catch (err) {
    console.error('/api/admin/reviews failed', err);
    return json({ error: 'server' }, 500);
  }
}
