import { ProxyAgent, fetch as undiciFetch } from 'undici';

const SITES = {
  'walmart.com':       'https://www.walmart.com',
  'pokemoncenter.com': 'https://www.pokemoncenter.com',
  'target.com':        'https://www.target.com',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { proxy, site } = req.query;
  if (!proxy || !site || !SITES[site]) {
    return res.status(400).json({ error: 'Missing or invalid params' });
  }

  // Parse host:port:user:pass — password may contain colons so rejoin from index 3
  const parts = proxy.split(':');
  if (parts.length < 4) return res.status(400).json({ error: 'Invalid proxy format' });

  const host = parts[0];
  const port = parts[1];
  const user = parts[2];
  const pass = parts.slice(3).join(':');

  const proxyUrl = `http://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}`;

  let agent;
  try {
    agent = new ProxyAgent(proxyUrl);
  } catch (e) {
    return res.status(400).json({ success: false, error: `Bad proxy URL: ${e.message}` });
  }

  const target = SITES[site];
  const start = Date.now();

  try {
    const response = await undiciFetch(target, {
      dispatcher: agent,
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
      signal: AbortSignal.timeout(20000),
    });

    const rtt = Date.now() - start;
    return res.json({ success: true, rtt, status: response.status, site });
  } catch (e) {
    const rtt = Date.now() - start;
    const msg = e.message?.includes('timeout') ? 'Timeout' : e.message?.split('\n')[0] || 'Failed';
    return res.json({ success: false, rtt, error: msg, site });
  }
}
