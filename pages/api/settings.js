export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const apikey = req.query.apikey || process.env.EVOMI_API_KEY;
  if (!apikey) return res.status(400).json({ error: 'No API key provided' });
  try {
    const r = await fetch('https://api.evomi.com/public/settings', {
      headers: { 'x-apikey': apikey },
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
