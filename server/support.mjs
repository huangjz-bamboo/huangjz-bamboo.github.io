import { createHash } from 'node:crypto';

export function createSupportHandler(getStore) {
  return async ({ request }) => {
    const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
    const reply = (error, status) => Response.json({ error }, { status, headers });
    if (request.method !== 'POST') return reply('Method not allowed', 405);
    const url = new URL(request.url);
    if (request.headers.get('origin') !== url.origin) return reply('Invalid origin', 403);
    if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return reply('Unsupported content type', 415);
    const reader = request.body?.getReader();
    if (!reader) return reply('Empty request', 400);
    const chunks = []; let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 8192) { await reader.cancel(); return reply('Request too large', 413); }
      chunks.push(Buffer.from(value));
    }
    const form = new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
    if (form.get('bot-field')) return reply('Invalid submission', 400);
    const name = (form.get('name') || '').trim();
    const amount = (form.get('amount') || '').trim();
    const message = (form.get('message') || '').trim();
    if (!name || name.length > 40 || message.length > 500 || form.get('consent') !== 'private-registration') return reply('Invalid form', 400);
    if (amount && (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) < 0.01 || Number(amount) > 999999)) return reply('Invalid amount', 400);
    const day = new Date().toISOString().slice(0, 10);
    const digest = createHash('sha256').update(JSON.stringify([day, name, amount, message])).digest('hex');
    try {
      await getStore('supporter-registration').setJSON(`entries/${day}/${digest}.json`, { name, amount: amount || null, message, consent: 'private-registration', receivedAt: new Date().toISOString(), paymentVerified: false });
      if (request.headers.get('accept')?.includes('application/json')) return Response.json({ ok: true }, { headers });
      return new Response(null, { status: 303, headers: { ...headers, Location: '/thank-you.html' } });
    } catch { return reply('Storage unavailable', 503); }
  };
}
