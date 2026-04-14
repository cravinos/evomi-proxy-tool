export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { apikey, ...rest } = req.query;
  if (!apikey) return res.status(400).json({ error: 'Missing API key' });

  const params = new URLSearchParams();
  Object.entries(rest).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) params.set(k, v);
  });

  try {
    const r = await fetch(`https://api.evomi.com/public/generate?${params}`, {
      headers: { 'x-apikey': apikey },
    });
    const text = await r.text();
    res.status(r.status).setHeader('Content-Type', 'text/plain').send(text);
  } catch (e) {
    res.status(500).send(e.message);
  }
}
