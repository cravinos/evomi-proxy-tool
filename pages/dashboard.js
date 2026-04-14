import { useSession, signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { authOptions } from './api/auth/[...nextauth]';
import { isAllowed } from '../lib/whitelist';

// ─── Static data ──────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 'rp',  label: 'Premium Residential', short: 'Premium', endpoint: 'rp.evomi.com',   port: 1000 },
  { id: 'rpc', label: 'Core Residential',    short: 'Core',    endpoint: 'rpc.evomi.com',  port: 1000 },
];

const US_STATES = [
  { code: 'AL', name: 'Alabama' },        { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },        { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },     { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },    { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },        { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },         { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },       { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },           { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },       { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },          { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },      { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },       { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },       { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },     { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },           { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },         { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },   { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },   { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },          { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },        { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },     { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },      { code: 'WY', name: 'Wyoming' },
];

const US_CITIES = {
  AL:['Birmingham','Montgomery','Huntsville','Mobile','Tuscaloosa'],
  AK:['Anchorage','Fairbanks','Juneau','Sitka'],
  AZ:['Phoenix','Tucson','Mesa','Chandler','Scottsdale','Tempe','Gilbert','Glendale'],
  AR:['Little Rock','Fort Smith','Fayetteville','Springdale','Jonesboro'],
  CA:['Los Angeles','San Francisco','San Diego','San Jose','Sacramento','Fresno','Oakland','Long Beach','Bakersfield','Anaheim','Santa Ana','Riverside','Stockton','Irvine'],
  CO:['Denver','Colorado Springs','Aurora','Fort Collins','Lakewood','Thornton','Arvada'],
  CT:['Bridgeport','New Haven','Hartford','Stamford','Waterbury'],
  DE:['Wilmington','Dover','Newark','Middletown'],
  FL:['Jacksonville','Miami','Tampa','Orlando','St. Petersburg','Hialeah','Tallahassee','Fort Lauderdale','Cape Coral','Gainesville'],
  GA:['Atlanta','Augusta','Columbus','Macon','Savannah','Athens','Sandy Springs'],
  HI:['Honolulu','Pearl City','Hilo','Kailua'],
  ID:['Boise','Nampa','Meridian','Idaho Falls','Pocatello'],
  IL:['Chicago','Aurora','Rockford','Joliet','Naperville','Springfield','Peoria'],
  IN:['Indianapolis','Fort Wayne','Evansville','South Bend','Carmel'],
  IA:['Des Moines','Cedar Rapids','Davenport','Sioux City'],
  KS:['Wichita','Overland Park','Kansas City','Topeka','Olathe'],
  KY:['Louisville','Lexington','Bowling Green','Owensboro'],
  LA:['New Orleans','Baton Rouge','Shreveport','Lafayette'],
  ME:['Portland','Lewiston','Bangor'],
  MD:['Baltimore','Frederick','Rockville','Gaithersburg'],
  MA:['Boston','Worcester','Springfield','Cambridge','Lowell'],
  MI:['Detroit','Grand Rapids','Warren','Sterling Heights','Ann Arbor','Lansing'],
  MN:['Minneapolis','Saint Paul','Rochester','Duluth','Bloomington'],
  MS:['Jackson','Gulfport','Southaven','Hattiesburg'],
  MO:['Kansas City','Saint Louis','Springfield','Columbia'],
  MT:['Billings','Missoula','Great Falls','Bozeman'],
  NE:['Omaha','Lincoln','Bellevue','Grand Island'],
  NV:['Las Vegas','Henderson','Reno','North Las Vegas','Sparks'],
  NH:['Manchester','Nashua','Concord','Derry'],
  NJ:['Newark','Jersey City','Paterson','Elizabeth','Trenton'],
  NM:['Albuquerque','Las Cruces','Rio Rancho','Santa Fe'],
  NY:['New York City','Buffalo','Rochester','Yonkers','Syracuse','Albany'],
  NC:['Charlotte','Raleigh','Greensboro','Durham','Winston-Salem','Fayetteville'],
  ND:['Fargo','Bismarck','Grand Forks','Minot'],
  OH:['Columbus','Cleveland','Cincinnati','Toledo','Akron','Dayton'],
  OK:['Oklahoma City','Tulsa','Norman','Broken Arrow'],
  OR:['Portland','Salem','Eugene','Gresham','Hillsboro'],
  PA:['Philadelphia','Pittsburgh','Allentown','Erie','Reading'],
  RI:['Providence','Cranston','Warwick','Pawtucket'],
  SC:['Columbia','Charleston','North Charleston','Mount Pleasant'],
  SD:['Sioux Falls','Rapid City','Aberdeen'],
  TN:['Nashville','Memphis','Knoxville','Chattanooga','Clarksville'],
  TX:['Houston','San Antonio','Dallas','Austin','Fort Worth','El Paso','Arlington','Corpus Christi','Plano','Laredo','Lubbock','Garland','Irving','Frisco'],
  UT:['Salt Lake City','West Valley City','Provo','West Jordan','Orem'],
  VT:['Burlington','Essex','South Burlington'],
  VA:['Virginia Beach','Norfolk','Chesapeake','Richmond','Newport News'],
  WA:['Seattle','Spokane','Tacoma','Vancouver','Bellevue','Kent'],
  WV:['Charleston','Huntington','Morgantown'],
  WI:['Milwaukee','Madison','Green Bay','Kenosha'],
  WY:['Cheyenne','Casper','Laramie'],
};

const DEVICES = [
  { code: '', label: 'Any' },
  { code: 'windows', label: 'Windows' },
  { code: 'unix',    label: 'Unix/Linux' },
  { code: 'apple',   label: 'Apple/macOS' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n) { return n?.toLocaleString(undefined, { maximumFractionDigits: 1 }) ?? '—'; }

function randomId(len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function Section({ title, note, children }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">{title}</span>
        {note && <span className="text-[10px] text-gray-700">{note}</span>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label, disabled }) {
  return (
    <label className={`flex items-center gap-2 select-none ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer group'}`}>
      <div onClick={() => !disabled && onChange(!checked)}
        className={`relative w-8 h-4 rounded-full transition-colors ${checked ? 'bg-lime-500' : 'bg-[#2a2a2a]'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className={`text-xs transition-colors ${disabled ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-300'}`}>{label}</span>
    </label>
  );
}

function PillGroup({ options, value, onChange }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)}
          className={`px-3 py-1 rounded text-xs transition-all ${
            value === o.id
              ? 'bg-lime-500 text-black font-semibold'
              : 'bg-[#141414] border border-[#222] text-gray-500 hover:border-[#333] hover:text-gray-300'
          }`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder = 'Any', disabled }) {
  return (
    <div className={disabled ? 'opacity-40 pointer-events-none' : ''}>
      {label && <label className="text-[10px] text-gray-600 block mb-1">{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        className="w-full bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-lime-500/40 transition-colors appearance-none cursor-pointer">
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Input({ label, disabled, ...props }) {
  return (
    <div className={disabled ? 'opacity-40' : ''}>
      {label && <label className="text-[10px] text-gray-600 block mb-1">{label}</label>}
      <input {...props} disabled={disabled}
        className="w-full bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 placeholder-gray-700 focus:outline-none focus:border-lime-500/40 transition-colors disabled:cursor-not-allowed" />
    </div>
  );
}

function IspSelect({ isps, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const all = [{ code: '', label: 'Random (All ISPs)' }, ...isps];
  const filtered = all.filter(i => !query || i.label.toLowerCase().includes(query.toLowerCase()) || i.code.toLowerCase().includes(query.toLowerCase())).slice(0, 80);
  const selectedLabel = value === '' ? 'Random (All ISPs)' : (isps.find(i => i.code === value)?.label || value);

  return (
    <div ref={ref} className="relative">
      <label className="text-[10px] text-gray-600 block mb-1">ISP</label>
      <div onClick={() => setOpen(!open)}
        className="bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 cursor-pointer text-xs hover:border-[#2a2a2a] transition-colors flex items-center justify-between">
        <span className={value === '' ? 'text-lime-400/80' : 'text-gray-300'}>{selectedLabel}</span>
        <span className="text-gray-700">▾</span>
      </div>
      {open && (
        <div className="absolute z-50 w-full top-full mt-1 bg-[#0f0f0f] border border-[#222] rounded-lg shadow-2xl overflow-hidden">
          <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search ISPs…"
            className="w-full bg-transparent border-b border-[#222] px-3 py-2 text-xs text-gray-300 placeholder-gray-700 focus:outline-none"
            onClick={e => e.stopPropagation()} />
          <div className="max-h-52 overflow-y-auto">
            {filtered.map(isp => (
              <button key={isp.code} onClick={() => { onChange(isp.code); setOpen(false); setQuery(''); }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#1a1a1a] transition-colors ${
                  value === isp.code ? 'text-lime-400 bg-lime-900/10' : isp.code === '' ? 'text-lime-400/60' : 'text-gray-400'
                }`}>
                {isp.code && <span className="text-gray-600 mr-2 text-[10px]">{isp.code}</span>}
                {isp.label}
              </button>
            ))}
            {filtered.length === 0 && <p className="px-3 py-3 text-xs text-gray-700">No matches</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authed
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/');
  }, [status, router]);

  const [apiKeyInput, setApiKeyInput]   = useState('');
  const [apiKey, setApiKey]             = useState('');
  const [connecting, setConnecting]     = useState(false);
  const [connectError, setConnectError] = useState('');
  const [accountData, setAccountData]   = useState(null);
  const [isps, setIsps]                 = useState([]);
  const [loadError, setLoadError]       = useState('');

  // Form
  const [product, setProduct]           = useState('rp');
  const [amount, setAmount]             = useState(10000);
  const [sessionType, setSessionType]   = useState('rotating');
  const [lifetime, setLifetime]         = useState(30);

  // Geo
  const [selState, setSelState]         = useState('');
  const [selCity, setSelCity]           = useState('');
  const [selIsp, setSelIsp]             = useState('');
  const [diversified, setDiversified]   = useState(false);

  // Expert (rp only)
  const [fraudscore, setFraudscore]     = useState('');
  const [device, setDevice]             = useState('');
  const [latency, setLatency]           = useState('');
  const [adblock, setAdblock]           = useState(false);
  const [http3, setHttp3]               = useState(false);
  const [localDns, setLocalDns]         = useState(false);
  const [extended, setExtended]         = useState(false);

  // Output
  const [maskEnabled, setMaskEnabled]   = useState(false);
  const [maskHost, setMaskHost]         = useState('proxy.yourdomain.com');
  const [proxies, setProxies]           = useState([]);
  const [generating, setGenerating]     = useState(false);
  const [genError, setGenError]         = useState('');
  const [copied, setCopied]             = useState(false);
  const [testing, setTesting]           = useState(false);
  const [testResult, setTestResult]     = useState(null);

  const connect = useCallback(async () => {
    const key = apiKeyInput.trim();
    if (!key) return;
    setConnecting(true);
    setConnectError('');
    setAccountData(null);
    try {
      const [accRes, setRes] = await Promise.all([
        fetch(`/api/account?apikey=${encodeURIComponent(key)}`),
        fetch(`/api/settings?apikey=${encodeURIComponent(key)}`),
      ]);
      const acc = await accRes.json();
      if (!accRes.ok || acc.error) throw new Error(acc.error || 'Invalid API key');
      setAccountData(acc);
      setApiKey(key);
      const settings = await setRes.json();
      const src = settings?.rp || settings?.rpc || {};
      if (src.isps) {
        const list = Object.entries(src.isps).map(([code, info]) => ({
          code,
          label: typeof info === 'string' ? info : (info.label || code),
        })).sort((a, b) => a.label.localeCompare(b.label));
        setIsps(list);
      }
    } catch (e) {
      setConnectError(e.message);
    } finally {
      setConnecting(false);
    }
  }, [apiKeyInput]);

  // Generate proxies via Evomi API (format=2), strip protocol prefix
  const generate = useCallback(async () => {
    if (!apiKey) return;
    setGenError('');
    setProxies([]);
    setGenerating(true);

    const BATCH = 500;
    const allProxies = [];

    // Build password suffix for rpc expert settings (appended post-generation)
    // extended cannot combine with other expert filters per Evomi docs
    const expertSuffix = (() => {
      if (product !== 'rpc') return '';
      if (extended) return '_extended-1';
      let s = '';
      if (fraudscore) s += `_fraudscore-${fraudscore}`;
      if (device)     s += `_device-${device}`;
      if (latency)    s += `_latency-${latency}`;
      if (http3)      s += '_http3-1';
      if (localDns)   s += '_localdns-1';
      return s;
    })();

    const buildParams = (batchAmount, ispOverride = null) => {
      const p = new URLSearchParams({
        apikey: apiKey,
        product,
        protocol: 'http',
        amount: batchAmount,
        format: '2',        // returns: http://host:port:user:pass
        countries: 'US',
      });
      if (sessionType === 'sticky') p.set('session', 'sticky');
      if (sessionType === 'hard')   p.set('session', 'hard');
      if (sessionType === 'sticky' && lifetime) p.set('lifetime', lifetime);
      if (selState) {
        const name = US_STATES.find(s => s.code === selState)?.name;
        if (name) p.set('region', name.toLowerCase().replace(/\s+/g, '.'));
      }
      if (selCity) p.set('city', selCity.toLowerCase().replace(/\s+/g, '.'));
      const isp = ispOverride ?? selIsp;
      if (isp) p.set('isp', isp);
      // adblock is a real generate query param for rp (Premium) only
      if (product === 'rp' && adblock) p.set('adblock', 'true');
      return p;
    };

    const processResults = (results) => {
      for (const text of results) {
        if (!text.trim()) continue;
        if (text.trim().startsWith('{')) throw new Error(JSON.parse(text).error || 'API error');
        for (let line of text.split('\n')) {
          line = line.replace(/^[\w+.-]+:\/\//i, '').trim();
          if (!line) continue;
          // Append rpc expert suffixes to the password (4th field: host:port:user:pass)
          if (expertSuffix) {
            const parts = line.split(':');
            if (parts.length >= 4) {
              parts[3] = parts[3] + expertSuffix;
              line = parts.join(':');
            }
          }
          if (maskEnabled && maskHost.trim()) {
            line = line.replace(/[\w.-]+\.evomi\.com/g, maskHost.trim());
          }
          allProxies.push(line);
        }
      }
    };

    try {
      if (diversified && !selIsp && isps.length > 0) {
        // Build a flat job list: each ISP gets an even share, sub-batched at 500
        const perIsp = Math.ceil(amount / isps.length);
        const jobs = []; // { ispCode, batchAmt }
        let remaining = amount;
        for (const isp of isps) {
          if (remaining <= 0) break;
          const ispTotal = Math.min(perIsp, remaining);
          remaining -= ispTotal;
          let left = ispTotal;
          while (left > 0) {
            jobs.push({ ispCode: isp.code, batchAmt: Math.min(BATCH, left) });
            left -= BATCH;
          }
        }
        for (let i = 0; i < jobs.length; i += 5) {
          const chunk = jobs.slice(i, i + 5).map(({ ispCode, batchAmt }) =>
            fetch(`/api/generate?${buildParams(batchAmt, ispCode)}`).then(r => r.text())
          );
          processResults(await Promise.all(chunk));
        }
      } else {
        // Normal generation
        const numBatches = Math.ceil(amount / BATCH);
        for (let i = 0; i < numBatches; i += 5) {
          const chunk = [];
          for (let j = i; j < Math.min(i + 5, numBatches); j++) {
            const batchAmt = Math.min(BATCH, amount - j * BATCH);
            chunk.push(fetch(`/api/generate?${buildParams(batchAmt)}`).then(r => r.text()));
          }
          processResults(await Promise.all(chunk));
        }
      }
      setProxies(allProxies);
    } catch (e) {
      setGenError(e.message);
    } finally {
      setGenerating(false);
    }
  }, [apiKey, product, amount, sessionType, lifetime, selState, selCity, selIsp, diversified, isps, fraudscore, device, latency, adblock, http3, localDns, extended, maskEnabled, maskHost]);

  const copyAll = async () => {
    if (!proxies.length) return;
    await navigator.clipboard.writeText(proxies.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportTxt = () => {
    if (!proxies.length) return;
    const blob = new Blob([proxies.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `santah-resis-${product}-US-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const testProxy = async (site) => {
    if (!proxies.length || testing) return;
    setTesting(true);
    setTestResult(null);
    try {
      const proxy = proxies[0];
      const res = await fetch(`/api/test-proxy?proxy=${encodeURIComponent(proxy)}&site=${encodeURIComponent(site)}`);
      const data = await res.json();
      setTestResult(data);
    } catch (e) {
      setTestResult({ success: false, error: e.message, site });
    } finally {
      setTesting(false);
    }
  };

  const getBalance = pid => accountData?.products?.[pid]?.balance_mb ?? null;
  const isRp  = product === 'rp';
  const isRpc = product === 'rpc';
  const curProd = PRODUCTS.find(p => p.id === product);
  const cityOptions = selState ? (US_CITIES[selState] || []) : [];

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-gray-600 text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <>
      <Head><title>Dashboard — Santah Resis</title></Head>
      <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur border-b border-[#141414]">
          <div className="max-w-screen-2xl mx-auto px-5 h-12 flex items-center gap-5">
            <a href="/" className="flex items-center gap-2 flex-shrink-0 no-underline">
              <span className="text-lg leading-none">🎅</span>
              <span className="text-sm font-bold">
                <span className="text-lime-400">Santah</span>
                <span className="text-white"> Resis</span>
              </span>
            </a>

            <a href="/guide" className="text-xs text-gray-500 hover:text-gray-300 transition-colors no-underline flex-shrink-0">Guide</a>

            {/* API Key input */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && connect()}
                placeholder="Evomi API key…"
                className="flex-1 bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 placeholder-gray-700 focus:outline-none focus:border-lime-500/40 transition-colors"
              />
              <button onClick={connect} disabled={connecting || !apiKeyInput.trim()}
                className="px-3 py-1.5 bg-lime-500 hover:bg-lime-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-bold rounded transition-colors whitespace-nowrap">
                {connecting ? '…' : 'Connect'}
              </button>
              {connectError && <span className="text-xs text-red-400 whitespace-nowrap">{connectError}</span>}
              {accountData && !connectError && (
                <span className="text-xs text-lime-500 flex items-center gap-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-500 inline-block" /> Connected
                </span>
              )}
            </div>

            {/* Balances */}
            {accountData && (
              <div className="flex items-center gap-4 text-[11px]">
                {PRODUCTS.map(p => {
                  const bal = getBalance(p.id);
                  if (!bal || bal <= 0) return null;
                  return (
                    <span key={p.id} className={product === p.id ? 'text-gray-300' : 'text-gray-600'}>
                      {p.short} <span className="text-lime-500">{fmt(bal)} MB</span>
                    </span>
                  );
                })}
              </div>
            )}

            <div className="ml-auto flex items-center gap-3">
              {session?.user?.image && (
                <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
              )}
              <span className="text-xs text-gray-500">{session?.user?.name}</span>
              <button onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3 py-1.5 bg-[#141414] border border-[#222] hover:border-[#333] text-xs text-gray-500 hover:text-gray-300 rounded transition-colors">
                Sign out
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-screen-2xl mx-auto flex" style={{ height: 'calc(100vh - 48px)' }}>

          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 border-r border-[#141414] overflow-y-auto px-4 py-5 space-y-6">

            <Section title="Product">
              <div className="space-y-1">
                {PRODUCTS.map(p => {
                  const bal = getBalance(p.id);
                  return (
                    <button key={p.id} onClick={() => { setProduct(p.id); setSelIsp(''); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-all ${
                        product === p.id
                          ? 'bg-lime-500/10 border border-lime-500/25 text-lime-300'
                          : 'bg-[#111] border border-[#1a1a1a] text-gray-500 hover:border-[#252525] hover:text-gray-300'
                      }`}>
                      <span>{p.label}</span>
                      {bal > 0 && <span className="text-[10px] text-emerald-600">{fmt(bal)} MB</span>}
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section title={`Amount — ${amount.toLocaleString()}`}>
              <div className="flex items-center gap-2">
                <input type="range" min="1" max="10000" value={amount}
                  onChange={e => setAmount(+e.target.value)}
                  className="flex-1 accent-lime-500 h-1" />
                <input type="number" min="1" max="10000" value={amount}
                  onChange={e => setAmount(Math.min(10000, Math.max(1, +e.target.value || 1)))}
                  className="w-16 bg-[#111] border border-[#1e1e1e] rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-lime-500/40" />
              </div>
            </Section>

            <Section title="Session Type">
              <PillGroup
                options={[
                  { id: 'rotating', label: 'Rotating' },
                  { id: 'sticky',   label: 'Sticky'   },
                  { id: 'hard',     label: 'Hard'      },
                ]}
                value={sessionType} onChange={setSessionType} />
              {sessionType === 'sticky' && (
                <Input label="Lifetime (minutes, 1–1440)" type="number" min="1" max="1440"
                  value={lifetime} onChange={e => setLifetime(Math.min(1440, Math.max(1, +e.target.value || 1)))} />
              )}
            </Section>

            <Section title="Geo Targeting" note="US only">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#1a1a1a] rounded mb-1">
                <span className="text-xs">🇺🇸</span>
                <span className="text-xs text-lime-400 font-medium">United States</span>
                <span className="text-[10px] text-gray-700 ml-auto">fixed</span>
              </div>
              <Select label="State" value={selState}
                onChange={v => { setSelState(v); setSelCity(''); }}
                options={US_STATES.map(s => ({ value: s.code, label: s.name }))}
                placeholder="Any state" />
              {selState && cityOptions.length > 0 && (
                <Select label="City" value={selCity} onChange={setSelCity}
                  options={cityOptions.map(c => ({ value: c, label: c }))}
                  placeholder="Any city" />
              )}
              <IspSelect isps={isps} value={selIsp} onChange={v => { setSelIsp(v); if (v) setDiversified(false); }} />
              {!selIsp && isps.length > 0 && (
                <button
                  onClick={() => setDiversified(d => !d)}
                  className={`w-full mt-1 px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                    diversified
                      ? 'bg-lime-500/10 border-lime-500/40 text-lime-400'
                      : 'bg-[#111] border-[#1a1a1a] text-gray-600 hover:text-gray-400 hover:border-[#2a2a2a]'
                  }`}
                >
                  {diversified ? '✓ Diversified ISP' : 'Diversified ISP'}
                  <span className="ml-1.5 text-[10px] font-normal opacity-60">
                    {diversified ? `~${Math.ceil(amount / isps.length)}/ISP across ${isps.length} providers` : 'evenly spread across all ISPs'}
                  </span>
                </button>
              )}
            </Section>

            {isRp && (
              <Section title="Options" note="Premium">
                <Toggle checked={adblock} onChange={setAdblock} label="Ad Blocking" />
              </Section>
            )}

            {isRpc && (
              <Section title="Expert Settings" note="Core only">
                <div className="space-y-2">
                  {extended && (
                    <p className="text-[10px] text-yellow-500/80 bg-yellow-500/5 border border-yellow-500/20 rounded px-2 py-1.5 leading-snug">
                      Extended pool cannot combine with other expert filters.
                    </p>
                  )}
                  <Input label="Max Fraud Score (0–100)" type="number" min="0" max="100"
                    placeholder="Any" value={fraudscore} onChange={e => setFraudscore(e.target.value)}
                    disabled={extended} />
                  <Select label="Device Type" value={device} onChange={setDevice}
                    options={DEVICES.filter(d => d.code).map(d => ({ value: d.code, label: d.label }))}
                    placeholder="Any device"
                    disabled={extended} />
                  <Input label="Max Latency (ms)" type="number" min="1"
                    placeholder="Any" value={latency} onChange={e => setLatency(e.target.value)}
                    disabled={extended} />
                  <div className="space-y-2 pt-1">
                    <Toggle checked={http3}    onChange={v => { if (!extended) setHttp3(v); }}    label="HTTP3 / QUIC"    disabled={extended} />
                    <Toggle checked={localDns} onChange={v => { if (!extended) setLocalDns(v); }} label="Local DNS"       disabled={extended} />
                    <Toggle checked={extended} onChange={v => { setExtended(v); if (v) { setFraudscore(''); setDevice(''); setLatency(''); setHttp3(false); setLocalDns(false); } }} label="Extended Pool" />
                  </div>
                </div>
              </Section>
            )}

            <Section title="Output Options">
              <Toggle checked={maskEnabled} onChange={setMaskEnabled} label="Mask hostname" />
              {maskEnabled && (
                <div className="pl-9 mt-1 space-y-1">
                  <Input placeholder="proxy.yourdomain.com" value={maskHost}
                    onChange={e => setMaskHost(e.target.value)} />
                  <p className="text-[10px] text-gray-700">
                    Set a CNAME → <span className="text-gray-600">{curProd?.endpoint}</span> for working proxies.
                  </p>
                </div>
              )}
            </Section>

          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0 flex flex-col p-5">

            {/* Action bar */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <button onClick={generate} disabled={!apiKey || generating}
                className="px-5 py-2 bg-lime-500 hover:bg-lime-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-bold rounded-lg transition-colors">
                {generating
                  ? (diversified && !selIsp ? 'Diversifying…' : 'Generating…')
                  : `Generate ${amount.toLocaleString()} Proxies`}
              </button>
              {diversified && !selIsp && !generating && (
                <span className="text-[10px] text-lime-500/70">
                  Diversified · ~{Math.ceil(amount / (isps.length || 1))}/ISP
                </span>
              )}

              {proxies.length > 0 && <>
                <button onClick={copyAll}
                  className="px-3 py-2 bg-[#141414] hover:bg-[#1e1e1e] border border-[#222] hover:border-[#2a2a2a] text-xs rounded transition-colors">
                  {copied ? '✓ Copied' : 'Copy All'}
                </button>
                <button onClick={exportTxt}
                  className="px-3 py-2 bg-[#141414] hover:bg-[#1e1e1e] border border-[#222] hover:border-[#2a2a2a] text-xs rounded transition-colors">
                  Export .txt
                </button>
                <button onClick={() => setProxies([])}
                  className="px-3 py-2 bg-[#141414] hover:bg-[#1e1e1e] border border-[#222] hover:border-[#2a2a2a] text-xs text-gray-600 hover:text-gray-400 rounded transition-colors">
                  Clear
                </button>
                <span className="ml-auto text-xs text-gray-700">
                  {proxies.length.toLocaleString()} proxies · {curProd?.label} · US
                  {selState ? ` · ${US_STATES.find(s=>s.code===selState)?.name}` : ''}
                  {selCity ? ` · ${selCity}` : ''}
                </span>
              </>}
            </div>

            {genError && (
              <div className="mb-4 px-4 py-3 bg-red-950/50 border border-red-800/40 rounded text-xs text-red-400">
                {genError}
              </div>
            )}

            {/* RTT Tester */}
            {proxies.length > 0 && (
              <div className="mb-4 flex items-center gap-3 flex-wrap px-4 py-3 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest flex-shrink-0">Test RTT</span>
                <div className="flex gap-2">
                  {['walmart.com', 'pokemoncenter.com', 'target.com'].map(site => (
                    <button key={site} onClick={() => testProxy(site)} disabled={testing}
                      className={`px-3 py-1 text-xs rounded border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        testResult?.site === site
                          ? testResult.success
                            ? 'border-lime-500/40 bg-lime-500/10 text-lime-300'
                            : 'border-red-500/40 bg-red-500/10 text-red-400'
                          : 'border-[#222] bg-[#141414] text-gray-400 hover:border-lime-500/30 hover:text-gray-200'
                      }`}>
                      {site.replace('.com', '')}
                    </button>
                  ))}
                </div>

                {testing && (
                  <span className="text-xs text-gray-600 animate-pulse ml-2">Testing proxy #1…</span>
                )}

                {testResult && !testing && (
                  <div className="flex items-center gap-2 ml-2">
                    {testResult.success ? (
                      <>
                        <span className="text-lime-400 text-xs font-mono">✓ {testResult.rtt}ms</span>
                        <span className="text-gray-600 text-[10px]">HTTP {testResult.status} · {testResult.site}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-red-400 text-xs">✗ {testResult.error}</span>
                        <span className="text-gray-600 text-[10px]">· {testResult.site}</span>
                      </>
                    )}
                    <button onClick={() => setTestResult(null)} className="text-gray-700 hover:text-gray-500 text-xs ml-1">✕</button>
                  </div>
                )}

                <span className="text-[10px] text-gray-700 ml-auto">proxy #1 of {proxies.length.toLocaleString()}</span>
              </div>
            )}

            {!apiKey && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-4xl">🎅</div>
                  <p className="text-sm text-gray-700">Enter your Evomi API key above to get started</p>
                </div>
              </div>
            )}

            {apiKey && proxies.length === 0 && !genError && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-4xl">🎅</div>
                  <p className="text-sm text-gray-700">Configure settings and click Generate</p>
                </div>
              </div>
            )}

            {proxies.length > 0 && (
              <div className="flex-1 flex flex-col bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-2 border-b border-[#1a1a1a] bg-[#0f0f0f]">
                  <span className="text-[10px] text-gray-700 uppercase tracking-widest">
                    host:port:user:pass
                  </span>
                  <span className="ml-auto text-[10px] text-lime-600">{proxies.length.toLocaleString()} proxies</span>
                </div>
                <textarea readOnly value={proxies.join('\n')}
                  className="flex-1 w-full bg-transparent px-4 py-3 text-xs text-gray-300 resize-none focus:outline-none leading-5 font-mono"
                  spellCheck={false} />
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: '/', permanent: false } };
  if (!isAllowed(session.user?.discordUsername)) {
    return { redirect: { destination: '/waitlist', permanent: false } };
  }
  return { props: {} };
}
