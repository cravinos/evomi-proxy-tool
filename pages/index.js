import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

// ─── Static data ─────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 'rp',  label: 'Premium Residential', endpoint: 'premium-residential.evomi.com', port: 1000 },
  { id: 'rpc', label: 'Core Residential',    endpoint: 'core-residential.evomi.com',    port: 1000 },
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
  AL: ['Birmingham','Montgomery','Huntsville','Mobile','Tuscaloosa'],
  AK: ['Anchorage','Fairbanks','Juneau','Sitka','Ketchikan'],
  AZ: ['Phoenix','Tucson','Mesa','Chandler','Scottsdale','Tempe','Gilbert','Glendale'],
  AR: ['Little Rock','Fort Smith','Fayetteville','Springdale','Jonesboro'],
  CA: ['Los Angeles','San Francisco','San Diego','San Jose','Sacramento','Fresno','Oakland','Long Beach','Bakersfield','Anaheim','Santa Ana','Riverside','Stockton','Irvine','Chula Vista'],
  CO: ['Denver','Colorado Springs','Aurora','Fort Collins','Lakewood','Thornton','Arvada','Westminster'],
  CT: ['Bridgeport','New Haven','Hartford','Stamford','Waterbury','Norwalk'],
  DE: ['Wilmington','Dover','Newark','Middletown'],
  FL: ['Jacksonville','Miami','Tampa','Orlando','St. Petersburg','Hialeah','Tallahassee','Fort Lauderdale','Cape Coral','Pembroke Pines','Hollywood','Gainesville'],
  GA: ['Atlanta','Augusta','Columbus','Macon','Savannah','Athens','Sandy Springs','Roswell'],
  HI: ['Honolulu','Pearl City','Hilo','Kailua','Waipahu'],
  ID: ['Boise','Nampa','Meridian','Idaho Falls','Pocatello'],
  IL: ['Chicago','Aurora','Rockford','Joliet','Naperville','Springfield','Peoria','Elgin'],
  IN: ['Indianapolis','Fort Wayne','Evansville','South Bend','Carmel','Fishers','Bloomington'],
  IA: ['Des Moines','Cedar Rapids','Davenport','Sioux City','Iowa City'],
  KS: ['Wichita','Overland Park','Kansas City','Topeka','Olathe'],
  KY: ['Louisville','Lexington','Bowling Green','Owensboro','Covington'],
  LA: ['New Orleans','Baton Rouge','Shreveport','Lafayette','Lake Charles'],
  ME: ['Portland','Lewiston','Bangor','South Portland'],
  MD: ['Baltimore','Frederick','Rockville','Gaithersburg','Bowie'],
  MA: ['Boston','Worcester','Springfield','Cambridge','Lowell','Brockton','New Bedford'],
  MI: ['Detroit','Grand Rapids','Warren','Sterling Heights','Ann Arbor','Lansing','Flint'],
  MN: ['Minneapolis','Saint Paul','Rochester','Duluth','Bloomington','Brooklyn Park'],
  MS: ['Jackson','Gulfport','Southaven','Hattiesburg','Biloxi'],
  MO: ['Kansas City','Saint Louis','Springfield','Columbia','Independence'],
  MT: ['Billings','Missoula','Great Falls','Bozeman','Butte'],
  NE: ['Omaha','Lincoln','Bellevue','Grand Island'],
  NV: ['Las Vegas','Henderson','Reno','North Las Vegas','Sparks'],
  NH: ['Manchester','Nashua','Concord','Derry','Dover'],
  NJ: ['Newark','Jersey City','Paterson','Elizabeth','Trenton','Camden'],
  NM: ['Albuquerque','Las Cruces','Rio Rancho','Santa Fe','Roswell'],
  NY: ['New York City','Buffalo','Rochester','Yonkers','Syracuse','Albany','New Rochelle'],
  NC: ['Charlotte','Raleigh','Greensboro','Durham','Winston-Salem','Fayetteville','Cary'],
  ND: ['Fargo','Bismarck','Grand Forks','Minot'],
  OH: ['Columbus','Cleveland','Cincinnati','Toledo','Akron','Dayton'],
  OK: ['Oklahoma City','Tulsa','Norman','Broken Arrow','Lawton'],
  OR: ['Portland','Salem','Eugene','Gresham','Hillsboro','Beaverton'],
  PA: ['Philadelphia','Pittsburgh','Allentown','Erie','Reading','Scranton'],
  RI: ['Providence','Cranston','Warwick','Pawtucket'],
  SC: ['Columbia','Charleston','North Charleston','Mount Pleasant','Rock Hill'],
  SD: ['Sioux Falls','Rapid City','Aberdeen','Brookings'],
  TN: ['Nashville','Memphis','Knoxville','Chattanooga','Clarksville','Murfreesboro'],
  TX: ['Houston','San Antonio','Dallas','Austin','Fort Worth','El Paso','Arlington','Corpus Christi','Plano','Laredo','Lubbock','Garland','Irving','Frisco','McKinney'],
  UT: ['Salt Lake City','West Valley City','Provo','West Jordan','Orem','Sandy'],
  VT: ['Burlington','Essex','South Burlington','Colchester'],
  VA: ['Virginia Beach','Norfolk','Chesapeake','Richmond','Newport News','Alexandria'],
  WA: ['Seattle','Spokane','Tacoma','Vancouver','Bellevue','Kent','Everett'],
  WV: ['Charleston','Huntington','Morgantown','Parkersburg'],
  WI: ['Milwaukee','Madison','Green Bay','Kenosha','Racine'],
  WY: ['Cheyenne','Casper','Laramie','Gillette'],
};

const DEVICES = [
  { code: '', label: 'Any Device' },
  { code: 'windows', label: 'Windows' },
  { code: 'unix',    label: 'Unix/Linux' },
  { code: 'apple',   label: 'Apple/macOS' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n) { return n?.toLocaleString(undefined, { maximumFractionDigits: 1 }) ?? '—'; }

function Section({ title, note, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">{title}</span>
        {note && <span className="text-[10px] text-gray-700">{note}</span>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group select-none">
      <div onClick={() => onChange(!checked)}
        className={`relative w-8 h-4 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-[#2a2a2a]'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{label}</span>
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
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900'
              : 'bg-[#141414] border border-[#222] text-gray-500 hover:border-[#333] hover:text-gray-300'
          }`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Dropdown({ label, value, onChange, options, placeholder = 'Select…' }) {
  return (
    <div>
      {label && <label className="text-[10px] text-gray-600 block mb-1">{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer">
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Searchable ISP dropdown ─────────────────────────────────────────────────

function IspSelect({ isps, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const filtered = [{ code: '', label: 'Random (All ISPs)' }, ...isps].filter(isp =>
    !query || isp.label.toLowerCase().includes(query.toLowerCase()) || isp.code.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 80);

  const selectedLabel = value === '' ? 'Random (All ISPs)' : (isps.find(i => i.code === value)?.label || value);

  return (
    <div ref={ref} className="relative">
      <label className="text-[10px] text-gray-600 block mb-1">ISP</label>
      <div onClick={() => setOpen(!open)}
        className="bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 cursor-pointer text-xs hover:border-[#2a2a2a] transition-colors flex items-center justify-between">
        <span className={value === '' ? 'text-indigo-300' : 'text-gray-300'}>{selectedLabel}</span>
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
                  value === isp.code ? 'text-indigo-300 bg-indigo-900/20' : isp.code === '' ? 'text-indigo-400/70' : 'text-gray-400'
                }`}>
                {isp.code === '' ? '⟳ ' : <span className="text-gray-600 mr-2 text-[10px]">{isp.code}</span>}
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

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKey, setApiKey]           = useState('');
  const [connecting, setConnecting]   = useState(false);
  const [connectError, setConnectError] = useState('');
  const [accountData, setAccountData] = useState(null);
  const [isps, setIsps]               = useState([]);

  // Form
  const [product, setProduct]         = useState('rp');
  const [amount, setAmount]           = useState(10000);
  const [sessionType, setSessionType] = useState('rotating');
  const [lifetime, setLifetime]       = useState(30);

  // Geo (always US)
  const [selState, setSelState]       = useState('');
  const [selCity, setSelCity]         = useState('');
  const [selIsp, setSelIsp]           = useState('');

  // Expert (rp only)
  const [fraudscore, setFraudscore]   = useState('');
  const [device, setDevice]           = useState('');
  const [latency, setLatency]         = useState('');
  const [adblock, setAdblock]         = useState(false);
  const [http3, setHttp3]             = useState(false);
  const [localDns, setLocalDns]       = useState(false);
  const [extended, setExtended]       = useState(false);

  // Mask
  const [maskEnabled, setMaskEnabled] = useState(false);
  const [maskHost, setMaskHost]       = useState('proxy.example.com');

  // Output
  const [proxies, setProxies]         = useState([]);
  const [generating, setGenerating]   = useState(false);
  const [genError, setGenError]       = useState('');
  const [copied, setCopied]           = useState(false);
  const [progress, setProgress]       = useState({ done: 0, total: 0 });

  // ── Connect ───────────────────────────────────────────────────────────────

  const connect = useCallback(async () => {
    const key = apiKeyInput.trim();
    if (!key) return;
    setConnecting(true);
    setConnectError('');
    try {
      const [accRes, setRes] = await Promise.all([
        fetch(`/api/account?apikey=${encodeURIComponent(key)}`),
        fetch(`/api/settings?apikey=${encodeURIComponent(key)}`),
      ]);
      if (!accRes.ok) throw new Error('Invalid API key');
      const acc = await accRes.json();
      if (!acc.success && !acc.products) throw new Error(acc.error || 'Auth failed');
      setAccountData(acc);
      setApiKey(key);
      if (setRes.ok) {
        const settings = await setRes.json();
        parseSettings(settings);
      }
    } catch (e) {
      setConnectError(e.message);
    } finally {
      setConnecting(false);
    }
  }, [apiKeyInput]);

  const parseSettings = (settings) => {
    // Try rp first, then rpc, then flat
    const src = settings.rp || settings.rpc || settings;
    if (src?.isps && typeof src.isps === 'object') {
      const list = Object.entries(src.isps).map(([code, info]) => ({
        code,
        label: typeof info === 'string' ? info : (info.label || info.name || code),
      })).sort((a, b) => a.label.localeCompare(b.label));
      setIsps(list);
    }
  };

  // ── Generate ──────────────────────────────────────────────────────────────

  const generate = useCallback(async () => {
    if (!apiKey) return;
    setGenerating(true);
    setGenError('');
    setProxies([]);

    const BATCH = 500;
    const numBatches = Math.ceil(amount / BATCH);
    setProgress({ done: 0, total: numBatches });

    const buildParams = (batchAmount) => {
      const p = new URLSearchParams({
        apikey: apiKey,
        product,
        protocol: 'http',
        amount: batchAmount,
        format: '2',            // host:port:user:pass
        prepend_protocol: 'false',
        countries: 'US',
      });
      if (sessionType === 'sticky') p.set('session', 'sticky');
      if (sessionType === 'hard')   p.set('session', 'hard');
      if (sessionType === 'sticky' && lifetime) p.set('lifetime', lifetime);
      if (selState) {
        const stateName = US_STATES.find(s => s.code === selState)?.name;
        if (stateName) p.set('region', stateName.toLowerCase().replace(/\s+/g, '.'));
      }
      if (selCity)  p.set('city', selCity.toLowerCase().replace(/\s+/g, '.'));
      if (selIsp)   p.set('isp', selIsp);
      if (product === 'rp') {
        if (fraudscore) p.set('fraudscore', fraudscore);
        if (device)     p.set('device', device);
        if (latency)    p.set('latency', latency);
        if (adblock)    p.set('adblock', 'true');
        if (http3)      p.set('http3', '1');
        if (localDns)   p.set('localdns', '1');
        if (extended)   p.set('extended', '1');
      }
      return p;
    };

    try {
      const allProxies = [];

      // Fire batches in groups of 5 to avoid overwhelming the API
      for (let i = 0; i < numBatches; i += 5) {
        const chunk = [];
        for (let j = i; j < Math.min(i + 5, numBatches); j++) {
          const batchAmount = Math.min(BATCH, amount - j * BATCH);
          chunk.push(
            fetch(`/api/generate?${buildParams(batchAmount)}`).then(r => r.text())
          );
        }
        const results = await Promise.all(chunk);
        for (const text of results) {
          if (text.trim().startsWith('{')) throw new Error(JSON.parse(text).error || 'Generation failed');
          const lines = text.split('\n').filter(l => l.trim());
          for (let line of lines) {
            // Always strip any accidental http:// prefix
            line = line.replace(/^https?:\/\//i, '').trim();
            // Mask hostname (replace any *.evomi.com)
            if (maskEnabled && maskHost.trim()) {
              line = line.replace(/[\w.-]+\.evomi\.com/g, maskHost.trim());
            }
            if (line) allProxies.push(line);
          }
        }
        setProgress(p => ({ ...p, done: Math.min(i + 5, numBatches) }));
      }

      setProxies(allProxies);
    } catch (e) {
      setGenError(e.message);
    } finally {
      setGenerating(false);
      setProgress({ done: 0, total: 0 });
    }
  }, [
    apiKey, product, amount, sessionType, lifetime,
    selState, selCity, selIsp,
    fraudscore, device, latency, adblock, http3, localDns, extended,
    maskEnabled, maskHost,
  ]);

  // ── Output actions ────────────────────────────────────────────────────────

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
    a.download = `proxies-${product}-US-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  const getBalance = pid => accountData?.products?.[pid]?.balance_mb ?? null;
  const isRp = product === 'rp';
  const cityOptions = selState ? (US_CITIES[selState] || []) : [];
  const curProd = PRODUCTS.find(p => p.id === product);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Head><title>Evomi Proxy Generator</title></Head>
      <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#080808] border-b border-[#161616]">
          <div className="max-w-screen-2xl mx-auto px-5 h-12 flex items-center gap-5">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.5"/>
                  <circle cx="6" cy="6" r="2" fill="white"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-200 tracking-tight">Evomi Proxy</span>
            </div>
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <input type="password" value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && connect()}
                placeholder="Paste API key…"
                className="flex-1 bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 transition-colors" />
              <button onClick={connect} disabled={connecting || !apiKeyInput.trim()}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs rounded transition-colors">
                {connecting ? 'Connecting…' : 'Connect'}
              </button>
              {connectError && <span className="text-xs text-red-400">{connectError}</span>}
              {accountData && !connectError && (
                <span className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />Connected
                </span>
              )}
            </div>
            {accountData && (
              <div className="ml-auto flex items-center gap-4 text-[11px]">
                {PRODUCTS.map(p => {
                  const bal = getBalance(p.id);
                  if (!bal || bal <= 0) return null;
                  return (
                    <span key={p.id} className={product === p.id ? 'text-gray-300' : 'text-gray-600'}>
                      {p.label.split(' ')[0]} <span className="text-indigo-400">{fmt(bal)} MB</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </header>

        <div className="max-w-screen-2xl mx-auto flex" style={{ height: 'calc(100vh - 48px)' }}>

          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 border-r border-[#161616] overflow-y-auto px-4 py-5 space-y-6">

            {/* Product */}
            <Section title="Product">
              <div className="space-y-1">
                {PRODUCTS.map(p => {
                  const bal = getBalance(p.id);
                  return (
                    <button key={p.id} onClick={() => setProduct(p.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-all ${
                        product === p.id
                          ? 'bg-indigo-900/30 border border-indigo-600/30 text-indigo-200'
                          : 'bg-[#111] border border-[#1a1a1a] text-gray-500 hover:border-[#252525] hover:text-gray-300'
                      }`}>
                      <span>{p.label}</span>
                      {bal > 0 && <span className="text-[10px] text-emerald-600">{fmt(bal)} MB</span>}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Amount */}
            <Section title={`Amount — ${amount.toLocaleString()}`}>
              <div className="flex items-center gap-2">
                <input type="range" min="1" max="10000" value={amount}
                  onChange={e => setAmount(+e.target.value)}
                  className="flex-1 accent-indigo-500 h-1" />
                <input type="number" min="1" max="10000" value={amount}
                  onChange={e => setAmount(Math.min(10000, Math.max(1, +e.target.value || 1)))}
                  className="w-16 bg-[#111] border border-[#1e1e1e] rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-indigo-500/50" />
              </div>
              <p className="text-[10px] text-gray-700">Auto-batched in groups of 500</p>
            </Section>

            {/* Session */}
            <Section title="Session Type">
              <PillGroup
                options={[
                  { id: 'rotating', label: 'Rotating' },
                  { id: 'sticky',   label: 'Sticky'   },
                  { id: 'hard',     label: 'Hard'      },
                ]}
                value={sessionType} onChange={setSessionType} />
              {sessionType === 'sticky' && (
                <div className="mt-2">
                  <label className="text-[10px] text-gray-600 block mb-1">Lifetime (minutes, 1–1440)</label>
                  <input type="number" min="1" max="1440" value={lifetime}
                    onChange={e => setLifetime(Math.min(1440, Math.max(1, +e.target.value || 1)))}
                    className="w-full bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500/50" />
                </div>
              )}
            </Section>

            {/* Geo — always USA */}
            <Section title="Geo Targeting" note="US only">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#1a1a1a] rounded mb-2">
                <span className="text-indigo-400 text-xs font-medium">🇺🇸 United States</span>
                <span className="text-[10px] text-gray-700 ml-auto">fixed</span>
              </div>
              <Dropdown
                label="State"
                value={selState}
                onChange={v => { setSelState(v); setSelCity(''); }}
                options={US_STATES.map(s => ({ value: s.code, label: s.name }))}
                placeholder="Any state"
              />
              {selState && cityOptions.length > 0 && (
                <div className="mt-2">
                  <Dropdown
                    label="City"
                    value={selCity}
                    onChange={setSelCity}
                    options={cityOptions.map(c => ({ value: c, label: c }))}
                    placeholder="Any city"
                  />
                </div>
              )}
              <div className="mt-2">
                <IspSelect isps={isps} value={selIsp} onChange={setSelIsp} />
              </div>
            </Section>

            {/* Expert Settings (rp only) */}
            {isRp && (
              <Section title="Expert Settings" note="Premium only">
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-gray-600 block mb-1">Max Fraud Score (0–100)</label>
                    <input type="number" min="0" max="100" placeholder="Any" value={fraudscore}
                      onChange={e => setFraudscore(e.target.value)}
                      className="w-full bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 placeholder-gray-700 focus:outline-none focus:border-indigo-500/50" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-600 block mb-1">Device Type</label>
                    <select value={device} onChange={e => setDevice(e.target.value)}
                      className="w-full bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500/50">
                      {DEVICES.map(d => <option key={d.code} value={d.code}>{d.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-600 block mb-1">Max Latency (ms)</label>
                    <input type="number" min="1" placeholder="Any" value={latency}
                      onChange={e => setLatency(e.target.value)}
                      className="w-full bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 placeholder-gray-700 focus:outline-none focus:border-indigo-500/50" />
                  </div>
                  <div className="space-y-2 pt-1">
                    <Toggle checked={adblock}  onChange={setAdblock}  label="Ad Blocking" />
                    <Toggle checked={http3}    onChange={setHttp3}    label="HTTP3 / QUIC" />
                    <Toggle checked={localDns} onChange={setLocalDns} label="Local DNS" />
                    <Toggle checked={extended} onChange={setExtended} label="Extended Pool (4–6× IPs)" />
                  </div>
                </div>
              </Section>
            )}

            {/* Mask hostname */}
            <Section title="Output Options">
              <Toggle checked={maskEnabled} onChange={setMaskEnabled} label="Mask hostname" />
              {maskEnabled && (
                <div className="pl-9 mt-1 space-y-1">
                  <input type="text" placeholder="proxy.example.com" value={maskHost}
                    onChange={e => setMaskHost(e.target.value)}
                    className="w-full bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 placeholder-gray-700 focus:outline-none focus:border-indigo-500/50" />
                  <p className="text-[10px] text-gray-700 leading-relaxed">
                    Replaces <span className="text-gray-600">{curProd?.endpoint}</span> in output.
                    Set CNAME → <span className="text-gray-600">{curProd?.endpoint}</span> for working proxies.
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
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm rounded font-medium transition-colors">
                {generating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    {progress.total > 0 ? `Batch ${progress.done}/${progress.total}…` : 'Generating…'}
                  </span>
                ) : `Generate ${amount.toLocaleString()} Proxies`}
              </button>

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
                  {proxies.length.toLocaleString()} proxies · {curProd?.label} · HTTP · US{selState ? ` · ${selState}` : ''}{selCity ? ` · ${selCity}` : ''}
                </span>
              </>}
            </div>

            {genError && (
              <div className="mb-4 px-4 py-3 bg-red-950/50 border border-red-800/40 rounded text-xs text-red-400">
                {genError}
              </div>
            )}

            {!apiKey && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#111] border border-[#1e1e1e] flex items-center justify-center mx-auto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700">Enter your Evomi API key to get started</p>
                </div>
              </div>
            )}

            {apiKey && proxies.length === 0 && !generating && !genError && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-700">Configure settings and click Generate</p>
              </div>
            )}

            {proxies.length > 0 && (
              <div className="flex-1 flex flex-col bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-2 border-b border-[#1a1a1a] bg-[#0f0f0f]">
                  <span className="text-[10px] text-gray-700 uppercase tracking-widest">Output — host:port:user:pass</span>
                  <span className="ml-auto text-[10px] text-gray-700">{proxies.length.toLocaleString()} lines</span>
                </div>
                <textarea readOnly value={proxies.join('\n')}
                  className="flex-1 w-full bg-transparent px-4 py-3 text-xs text-gray-300 resize-none focus:outline-none leading-5 font-mono"
                  spellCheck={false} />
              </div>
            )}

            {generating && proxies.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xs text-gray-600 animate-pulse">
                  {progress.total > 0 ? `Batch ${progress.done} of ${progress.total}…` : 'Starting…'}
                </p>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}
