export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const apikey = process.env.EVOMI_API_KEY;
  if (!apikey) return res.status(500).json({ error: 'EVOMI_API_KEY not configured' });
  try {
    const r = await fetch('https://api.evomi.com/public', {
      headers: { 'x-apikey': apikey },
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
