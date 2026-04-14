import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

// ─── Static data ────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 'rp',   label: 'Premium Residential', short: 'Premium', endpoint: 'premium-residential.evomi.com', http: 1000, socks5: 1002 },
  { id: 'rpc',  label: 'Core Residential',    short: 'Core',    endpoint: 'core-residential.evomi.com',    http: 1000, socks5: 1002 },
  { id: 'mp',   label: 'Mobile',              short: 'Mobile',  endpoint: 'mp.evomi.com',                  http: 3000, socks5: 3002 },
  { id: 'dcp',  label: 'Datacenter',          short: 'DC',      endpoint: 'dcp.evomi.com',                 http: 2000, socks5: 2002 },
];

const FORMATS = [
  { id: '1', label: 'user:pass@host:port' },
  { id: '2', label: 'host:port:user:pass'  },
  { id: '3', label: 'user:pass:host:port'  },
];

const CONTINENTS = [
  { code: '',               label: 'Any Continent'  },
  { code: 'africa',         label: 'Africa'         },
  { code: 'asia',           label: 'Asia'           },
  { code: 'europe',         label: 'Europe'         },
  { code: 'north-america',  label: 'North America'  },
  { code: 'south-america',  label: 'South America'  },
  { code: 'oceania',        label: 'Oceania'        },
];

const DEVICES = [
  { code: '',        label: 'Any Device' },
  { code: 'windows', label: 'Windows'   },
  { code: 'unix',    label: 'Unix/Linux' },
  { code: 'apple',   label: 'Apple/macOS' },
];

// Comprehensive country list (ISO 3166-1 alpha-2)
const STATIC_COUNTRIES = [
  {code:'AD',label:'Andorra'},{code:'AE',label:'UAE'},{code:'AF',label:'Afghanistan'},
  {code:'AG',label:'Antigua & Barbuda'},{code:'AL',label:'Albania'},{code:'AM',label:'Armenia'},
  {code:'AO',label:'Angola'},{code:'AR',label:'Argentina'},{code:'AT',label:'Austria'},
  {code:'AU',label:'Australia'},{code:'AZ',label:'Azerbaijan'},{code:'BA',label:'Bosnia'},
  {code:'BB',label:'Barbados'},{code:'BD',label:'Bangladesh'},{code:'BE',label:'Belgium'},
  {code:'BF',label:'Burkina Faso'},{code:'BG',label:'Bulgaria'},{code:'BH',label:'Bahrain'},
  {code:'BI',label:'Burundi'},{code:'BJ',label:'Benin'},{code:'BN',label:'Brunei'},
  {code:'BO',label:'Bolivia'},{code:'BR',label:'Brazil'},{code:'BS',label:'Bahamas'},
  {code:'BT',label:'Bhutan'},{code:'BW',label:'Botswana'},{code:'BY',label:'Belarus'},
  {code:'BZ',label:'Belize'},{code:'CA',label:'Canada'},{code:'CD',label:'DR Congo'},
  {code:'CF',label:'Central African Rep.'},{code:'CG',label:'Congo'},{code:'CH',label:'Switzerland'},
  {code:'CI',label:"Côte d'Ivoire"},{code:'CL',label:'Chile'},{code:'CM',label:'Cameroon'},
  {code:'CN',label:'China'},{code:'CO',label:'Colombia'},{code:'CR',label:'Costa Rica'},
  {code:'CU',label:'Cuba'},{code:'CV',label:'Cape Verde'},{code:'CY',label:'Cyprus'},
  {code:'CZ',label:'Czechia'},{code:'DE',label:'Germany'},{code:'DJ',label:'Djibouti'},
  {code:'DK',label:'Denmark'},{code:'DM',label:'Dominica'},{code:'DO',label:'Dominican Rep.'},
  {code:'DZ',label:'Algeria'},{code:'EC',label:'Ecuador'},{code:'EE',label:'Estonia'},
  {code:'EG',label:'Egypt'},{code:'ER',label:'Eritrea'},{code:'ES',label:'Spain'},
  {code:'ET',label:'Ethiopia'},{code:'FI',label:'Finland'},{code:'FJ',label:'Fiji'},
  {code:'FR',label:'France'},{code:'GA',label:'Gabon'},{code:'GB',label:'United Kingdom'},
  {code:'GD',label:'Grenada'},{code:'GE',label:'Georgia'},{code:'GH',label:'Ghana'},
  {code:'GM',label:'Gambia'},{code:'GN',label:'Guinea'},{code:'GQ',label:'Equatorial Guinea'},
  {code:'GR',label:'Greece'},{code:'GT',label:'Guatemala'},{code:'GW',label:'Guinea-Bissau'},
  {code:'GY',label:'Guyana'},{code:'HN',label:'Honduras'},{code:'HR',label:'Croatia'},
  {code:'HT',label:'Haiti'},{code:'HU',label:'Hungary'},{code:'ID',label:'Indonesia'},
  {code:'IE',label:'Ireland'},{code:'IL',label:'Israel'},{code:'IN',label:'India'},
  {code:'IQ',label:'Iraq'},{code:'IR',label:'Iran'},{code:'IS',label:'Iceland'},
  {code:'IT',label:'Italy'},{code:'JM',label:'Jamaica'},{code:'JO',label:'Jordan'},
  {code:'JP',label:'Japan'},{code:'KE',label:'Kenya'},{code:'KG',label:'Kyrgyzstan'},
  {code:'KH',label:'Cambodia'},{code:'KI',label:'Kiribati'},{code:'KM',label:'Comoros'},
  {code:'KN',label:'St. Kitts & Nevis'},{code:'KP',label:'North Korea'},{code:'KR',label:'South Korea'},
  {code:'KW',label:'Kuwait'},{code:'KZ',label:'Kazakhstan'},{code:'LA',label:'Laos'},
  {code:'LB',label:'Lebanon'},{code:'LC',label:'St. Lucia'},{code:'LI',label:'Liechtenstein'},
  {code:'LK',label:'Sri Lanka'},{code:'LR',label:'Liberia'},{code:'LS',label:'Lesotho'},
  {code:'LT',label:'Lithuania'},{code:'LU',label:'Luxembourg'},{code:'LV',label:'Latvia'},
  {code:'LY',label:'Libya'},{code:'MA',label:'Morocco'},{code:'MC',label:'Monaco'},
  {code:'MD',label:'Moldova'},{code:'ME',label:'Montenegro'},{code:'MG',label:'Madagascar'},
  {code:'MH',label:'Marshall Islands'},{code:'MK',label:'North Macedonia'},{code:'ML',label:'Mali'},
  {code:'MM',label:'Myanmar'},{code:'MN',label:'Mongolia'},{code:'MR',label:'Mauritania'},
  {code:'MT',label:'Malta'},{code:'MU',label:'Mauritius'},{code:'MV',label:'Maldives'},
  {code:'MW',label:'Malawi'},{code:'MX',label:'Mexico'},{code:'MY',label:'Malaysia'},
  {code:'MZ',label:'Mozambique'},{code:'NA',label:'Namibia'},{code:'NE',label:'Niger'},
  {code:'NG',label:'Nigeria'},{code:'NI',label:'Nicaragua'},{code:'NL',label:'Netherlands'},
  {code:'NO',label:'Norway'},{code:'NP',label:'Nepal'},{code:'NR',label:'Nauru'},
  {code:'NZ',label:'New Zealand'},{code:'OM',label:'Oman'},{code:'PA',label:'Panama'},
  {code:'PE',label:'Peru'},{code:'PG',label:'Papua New Guinea'},{code:'PH',label:'Philippines'},
  {code:'PK',label:'Pakistan'},{code:'PL',label:'Poland'},{code:'PT',label:'Portugal'},
  {code:'PW',label:'Palau'},{code:'PY',label:'Paraguay'},{code:'QA',label:'Qatar'},
  {code:'RO',label:'Romania'},{code:'RS',label:'Serbia'},{code:'RU',label:'Russia'},
  {code:'RW',label:'Rwanda'},{code:'SA',label:'Saudi Arabia'},{code:'SB',label:'Solomon Islands'},
  {code:'SC',label:'Seychelles'},{code:'SD',label:'Sudan'},{code:'SE',label:'Sweden'},
  {code:'SG',label:'Singapore'},{code:'SI',label:'Slovenia'},{code:'SK',label:'Slovakia'},
  {code:'SL',label:'Sierra Leone'},{code:'SM',label:'San Marino'},{code:'SN',label:'Senegal'},
  {code:'SO',label:'Somalia'},{code:'SR',label:'Suriname'},{code:'SS',label:'South Sudan'},
  {code:'ST',label:'São Tomé & Príncipe'},{code:'SV',label:'El Salvador'},{code:'SY',label:'Syria'},
  {code:'SZ',label:'Eswatini'},{code:'TD',label:'Chad'},{code:'TG',label:'Togo'},
  {code:'TH',label:'Thailand'},{code:'TJ',label:'Tajikistan'},{code:'TL',label:'Timor-Leste'},
  {code:'TM',label:'Turkmenistan'},{code:'TN',label:'Tunisia'},{code:'TO',label:'Tonga'},
  {code:'TR',label:'Turkey'},{code:'TT',label:'Trinidad & Tobago'},{code:'TV',label:'Tuvalu'},
  {code:'TZ',label:'Tanzania'},{code:'UA',label:'Ukraine'},{code:'UG',label:'Uganda'},
  {code:'US',label:'United States'},{code:'UY',label:'Uruguay'},{code:'UZ',label:'Uzbekistan'},
  {code:'VA',label:'Vatican City'},{code:'VC',label:'St. Vincent'},{code:'VE',label:'Venezuela'},
  {code:'VN',label:'Vietnam'},{code:'VU',label:'Vanuatu'},{code:'WS',label:'Samoa'},
  {code:'YE',label:'Yemen'},{code:'ZA',label:'South Africa'},{code:'ZM',label:'Zambia'},
  {code:'ZW',label:'Zimbabwe'},
];

// ─── Helpers ────────────────────────────────────────────────────────────────

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
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-8 h-4 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-[#2a2a2a]'}`}
      >
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
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`px-3 py-1 rounded text-xs transition-all ${
            value === o.id
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900'
              : 'bg-[#141414] border border-[#222] text-gray-500 hover:border-[#333] hover:text-gray-300'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="text-[10px] text-gray-600 block mb-1">{label}</label>}
      <input
        {...props}
        className="w-full bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 placeholder-gray-700 focus:outline-none focus:border-indigo-500/60 transition-colors"
      />
    </div>
  );
}

// ─── Country multi-select ────────────────────────────────────────────────────

function CountrySelect({ selected, onChange, countries }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const filtered = countries.filter(c =>
    !query || c.label.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().startsWith(query.toLowerCase())
  ).slice(0, 80);

  const toggle = (code) => {
    onChange(selected.includes(code) ? selected.filter(x => x !== code) : [...selected, code]);
  };

  return (
    <div ref={ref} className="relative">
      <label className="text-[10px] text-gray-600 block mb-1">Countries</label>
      <div
        onClick={() => setOpen(!open)}
        className="min-h-[30px] bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 cursor-pointer flex flex-wrap gap-1 items-center hover:border-[#2a2a2a] transition-colors"
      >
        {selected.length === 0
          ? <span className="text-xs text-gray-700">Any country</span>
          : selected.map(code => (
            <span key={code} className="inline-flex items-center gap-0.5 bg-indigo-900/40 border border-indigo-700/30 text-indigo-300 rounded px-1.5 py-0.5 text-[10px]">
              {code}
              <button
                onClick={e => { e.stopPropagation(); toggle(code); }}
                className="ml-0.5 text-indigo-400 hover:text-white leading-none"
              >×</button>
            </span>
          ))
        }
      </div>
      {open && (
        <div className="absolute z-50 w-full top-full mt-1 bg-[#0f0f0f] border border-[#222] rounded-lg shadow-2xl overflow-hidden">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search countries..."
            className="w-full bg-transparent border-b border-[#222] px-3 py-2 text-xs text-gray-300 placeholder-gray-700 focus:outline-none"
            onClick={e => e.stopPropagation()}
          />
          <div className="max-h-52 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.code}
                onClick={e => { e.stopPropagation(); toggle(c.code); }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-[#1a1a1a] transition-colors ${
                  selected.includes(c.code) ? 'text-indigo-300 bg-indigo-900/20' : 'text-gray-400'
                }`}
              >
                <span className="w-4 text-center text-[10px]">{selected.includes(c.code) ? '✓' : ''}</span>
                <span className="text-gray-600 w-7 flex-shrink-0">{c.code}</span>
                <span className="truncate">{c.label}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="px-3 py-3 text-xs text-gray-700">No matches</p>}
          </div>
          <div className="border-t border-[#222] px-3 py-2 flex justify-between">
            <button onClick={() => onChange([])} className="text-[10px] text-gray-700 hover:text-gray-400 transition-colors">Clear all</button>
            <button onClick={() => setOpen(false)} className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ISP searchable select ───────────────────────────────────────────────────

function IspSelect({ isps, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const filtered = isps.filter(isp =>
    !query || isp.label.toLowerCase().includes(query.toLowerCase()) || isp.code.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 60);

  const selected = isps.find(i => i.code === value);

  return (
    <div ref={ref} className="relative">
      <label className="text-[10px] text-gray-600 block mb-1">ISP</label>
      <div
        onClick={() => setOpen(!open)}
        className="bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 cursor-pointer text-xs hover:border-[#2a2a2a] transition-colors flex items-center justify-between"
      >
        <span className={selected ? 'text-gray-300' : 'text-gray-700'}>{selected ? selected.label : 'Any ISP'}</span>
        <span className="text-gray-700">▾</span>
      </div>
      {open && (
        <div className="absolute z-50 w-full top-full mt-1 bg-[#0f0f0f] border border-[#222] rounded-lg shadow-2xl overflow-hidden">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search ISPs..."
            className="w-full bg-transparent border-b border-[#222] px-3 py-2 text-xs text-gray-300 placeholder-gray-700 focus:outline-none"
            onClick={e => e.stopPropagation()}
          />
          <div className="max-h-52 overflow-y-auto">
            <button
              onClick={() => { onChange(''); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-[#1a1a1a]"
            >Any ISP</button>
            {filtered.map(isp => (
              <button
                key={isp.code}
                onClick={() => { onChange(isp.code); setOpen(false); setQuery(''); }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#1a1a1a] transition-colors ${
                  value === isp.code ? 'text-indigo-300 bg-indigo-900/20' : 'text-gray-400'
                }`}
              >
                <span className="text-gray-600 mr-2">{isp.code}</span>{isp.label}
              </button>
            ))}
            {filtered.length === 0 && <p className="px-3 py-3 text-xs text-gray-700">No matches</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function Home() {
  // API auth
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState('');
  const [accountData, setAccountData] = useState(null);
  const [countries, setCountries] = useState(STATIC_COUNTRIES);
  const [ispsByProduct, setIspsByProduct] = useState({});

  // Form
  const [product, setProduct] = useState('rp');
  const [protocol, setProtocol] = useState('http');
  const [amount, setAmount] = useState(10);
  const [format, setFormat] = useState('1');
  const [sessionType, setSessionType] = useState('rotating');
  const [lifetime, setLifetime] = useState(30);

  // Geo
  const [selCountries, setSelCountries] = useState([]);
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [continent, setContinent] = useState('');
  const [selIsp, setSelIsp] = useState('');
  const [asn, setAsn] = useState('');
  const [zipcode, setZipcode] = useState('');

  // Expert (rp only)
  const [fraudscore, setFraudscore] = useState('');
  const [device, setDevice] = useState('');
  const [latency, setLatency] = useState('');
  const [adblock, setAdblock] = useState(false);
  const [http3, setHttp3] = useState(false);
  const [localDns, setLocalDns] = useState(false);
  const [extended, setExtended] = useState(false);

  // Output options
  const [stripHttp, setStripHttp] = useState(true);
  const [maskEnabled, setMaskEnabled] = useState(false);
  const [maskHost, setMaskHost] = useState('proxy.example.com');

  // Output
  const [proxies, setProxies] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [copied, setCopied] = useState(false);

  // ── Connect ──────────────────────────────────────────────────────────────

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

      if (!accRes.ok) throw new Error('Invalid API key or connection failed');

      const acc = await accRes.json();
      if (!acc.success && !acc.products) throw new Error(acc.error || 'Authentication failed');

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
    // Extract ISPs per product
    const ispMap = {};
    for (const [prod, data] of Object.entries(settings)) {
      if (typeof data !== 'object' || !data) continue;
      if (data.isps && typeof data.isps === 'object') {
        ispMap[prod] = Object.entries(data.isps).map(([code, info]) => ({
          code,
          label: typeof info === 'string' ? info : (info.label || info.name || code),
          countries: Array.isArray(info?.countries) ? info.countries : [],
        })).sort((a, b) => a.label.localeCompare(b.label));
      }
    }
    if (Object.keys(ispMap).length > 0) setIspsByProduct(ispMap);

    // Extract country list if API provides it
    const first = Object.values(settings)[0];
    if (first?.countries) {
      let list = [];
      if (Array.isArray(first.countries)) {
        list = first.countries.map(c =>
          typeof c === 'string' ? { code: c, label: c } :
          { code: c.code || c.iso || c, label: c.label || c.name || c.code || c }
        );
      } else if (typeof first.countries === 'object') {
        list = Object.entries(first.countries).map(([code, info]) => ({
          code,
          label: typeof info === 'string' ? info : (info.label || info.name || code),
        }));
      }
      if (list.length > 0) setCountries(list.sort((a, b) => a.label.localeCompare(b.label)));
    }
  };

  // ── Generate ─────────────────────────────────────────────────────────────

  const generate = useCallback(async () => {
    if (!apiKey) return;
    setGenerating(true);
    setGenError('');
    setProxies([]);

    const params = new URLSearchParams({
      apikey: apiKey,
      product,
      protocol,
      amount,
      format,
      prepend_protocol: 'false', // we control protocol display ourselves
    });

    if (sessionType === 'sticky') params.set('session', 'sticky');
    if (sessionType === 'hard')   params.set('session', 'hard');
    if (sessionType === 'sticky' && lifetime) params.set('lifetime', lifetime);

    if (selCountries.length > 0) params.set('countries', selCountries.join(','));
    if (region)   params.set('region', region.trim().toLowerCase().replace(/\s+/g, '.'));
    if (city)     params.set('city', city.trim().toLowerCase().replace(/\s+/g, '.'));
    if (continent) params.set('continent', continent);
    if (selIsp)   params.set('isp', selIsp);
    if (asn)      params.set('asn', asn.trim());
    if (zipcode)  params.set('zipcode', zipcode.trim());

    // Expert (premium residential only)
    if (product === 'rp') {
      if (fraudscore) params.set('fraudscore', fraudscore);
      if (device)     params.set('device', device);
      if (latency)    params.set('latency', latency);
      if (adblock)    params.set('adblock', 'true');
      if (http3)      params.set('http3', '1');
      if (localDns)   params.set('localdns', '1');
      if (extended)   params.set('extended', '1');
    }

    try {
      const res = await fetch(`/api/generate?${params}`);
      const text = await res.text();
      if (!res.ok) throw new Error(text || `Error ${res.status}`);

      const prod = PRODUCTS.find(p => p.id === product);
      const lines = text.split('\n').filter(l => l.trim());

      const processed = lines.map(line => {
        let p = line.trim();

        // Strip protocol prefix — we asked prepend_protocol=false so
        // they should already be clean, but strip anyway as safety net
        if (stripHttp) {
          p = p.replace(/^https?:\/\//i, '');
        }
        // For socks5, add the prefix back for clarity
        if (protocol === 'socks5' && !stripHttp) {
          if (!p.startsWith('socks5://')) p = 'socks5://' + p;
        }

        // Mask hostname
        if (maskEnabled && maskHost.trim() && prod) {
          p = p.replace(prod.endpoint, maskHost.trim());
        }

        return p;
      });

      setProxies(processed);
    } catch (e) {
      setGenError(e.message);
    } finally {
      setGenerating(false);
    }
  }, [
    apiKey, product, protocol, amount, format, sessionType, lifetime,
    selCountries, region, city, continent, selIsp, asn, zipcode,
    fraudscore, device, latency, adblock, http3, localDns, extended,
    stripHttp, maskEnabled, maskHost,
  ]);

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
    a.download = `proxies-${product}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  const getBalance = (pid) => accountData?.products?.[pid]?.balance_mb ?? null;
  const curProd = PRODUCTS.find(p => p.id === product);
  const isRp = product === 'rp';
  const isps = (ispsByProduct[product] || []).filter(isp =>
    selCountries.length === 0 || isp.countries.some(c => selCountries.includes(c))
  );
  const hasIsps = isps.length > 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Head>
        <title>Evomi Proxy Generator</title>
      </Head>

      <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-[#080808] border-b border-[#161616]">
          <div className="max-w-screen-2xl mx-auto px-5 h-12 flex items-center gap-5">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.5"/>
                  <circle cx="6" cy="6" r="2" fill="white"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-200 tracking-tight">Evomi Proxy</span>
            </div>

            {/* API Key */}
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && connect()}
                placeholder="Paste API key..."
                className="flex-1 bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
              <button
                onClick={connect}
                disabled={connecting || !apiKeyInput.trim()}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs rounded transition-colors whitespace-nowrap"
              >
                {connecting ? 'Connecting…' : 'Connect'}
              </button>
              {connectError && <span className="text-xs text-red-400">{connectError}</span>}
              {accountData && !connectError && (
                <span className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Connected
                </span>
              )}
            </div>

            {/* Balances */}
            {accountData && (
              <div className="ml-auto flex items-center gap-4 text-[11px]">
                {PRODUCTS.map(p => {
                  const bal = getBalance(p.id);
                  if (!bal || bal <= 0) return null;
                  return (
                    <span key={p.id} className={product === p.id ? 'text-gray-300' : 'text-gray-600'}>
                      {p.short}{' '}
                      <span className="text-indigo-400">{fmt(bal)} MB</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </header>

        <div className="max-w-screen-2xl mx-auto flex" style={{ height: 'calc(100vh - 48px)' }}>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="w-64 flex-shrink-0 border-r border-[#161616] overflow-y-auto px-4 py-5 space-y-6">

            {/* Product */}
            <Section title="Product">
              <div className="space-y-1">
                {PRODUCTS.map(p => {
                  const bal = getBalance(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => { setProduct(p.id); setSelIsp(''); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-all ${
                        product === p.id
                          ? 'bg-indigo-900/30 border border-indigo-600/30 text-indigo-200'
                          : 'bg-[#111] border border-[#1a1a1a] text-gray-500 hover:border-[#252525] hover:text-gray-300'
                      }`}
                    >
                      <span>{p.label}</span>
                      {bal !== null && bal > 0 && (
                        <span className="text-[10px] text-emerald-600">{fmt(bal)} MB</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Protocol */}
            <Section title="Protocol">
              <PillGroup
                options={[{ id: 'http', label: 'HTTP' }, { id: 'socks5', label: 'SOCKS5' }]}
                value={protocol}
                onChange={setProtocol}
              />
            </Section>

            {/* Amount */}
            <Section title={`Amount — ${amount}`}>
              <div className="flex items-center gap-2">
                <input
                  type="range" min="1" max="500" value={amount}
                  onChange={e => setAmount(+e.target.value)}
                  className="flex-1 accent-indigo-500 h-1"
                />
                <input
                  type="number" min="1" max="500" value={amount}
                  onChange={e => setAmount(Math.min(500, Math.max(1, +e.target.value || 1)))}
                  className="w-14 bg-[#111] border border-[#1e1e1e] rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </Section>

            {/* Format */}
            <Section title="Proxy Format">
              <div className="space-y-1">
                {FORMATS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`w-full px-3 py-1.5 rounded text-[11px] text-left transition-all ${
                      format === f.id
                        ? 'bg-indigo-900/30 border border-indigo-600/30 text-indigo-300'
                        : 'bg-[#111] border border-[#1a1a1a] text-gray-600 hover:border-[#252525] hover:text-gray-400'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </Section>

            {/* Session */}
            <Section title="Session Type">
              <PillGroup
                options={[
                  { id: 'rotating', label: 'Rotating' },
                  { id: 'sticky',   label: 'Sticky'   },
                  { id: 'hard',     label: 'Hard'      },
                ]}
                value={sessionType}
                onChange={setSessionType}
              />
              {sessionType === 'sticky' && (
                <div className="mt-2">
                  <Input
                    label="Lifetime (minutes, 1–120)"
                    type="number" min="1" max="120" value={lifetime}
                    onChange={e => setLifetime(Math.min(120, Math.max(1, +e.target.value || 1)))}
                    placeholder="30"
                  />
                </div>
              )}
              {sessionType === 'hard' && (
                <p className="text-[10px] text-gray-700 mt-1">IP held as long as possible. Incompatible with lifetime.</p>
              )}
            </Section>

            {/* Geo Targeting */}
            <Section title="Geo Targeting">
              <CountrySelect selected={selCountries} onChange={setSelCountries} countries={countries} />
              <div className="mt-2 space-y-2">
                <Input label="Region / State" placeholder="e.g. California" value={region} onChange={e => setRegion(e.target.value)} />
                <Input label="City" placeholder="e.g. New York" value={city} onChange={e => setCity(e.target.value)} />
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Continent</label>
                  <select
                    value={continent}
                    onChange={e => setContinent(e.target.value)}
                    className="w-full bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  >
                    {CONTINENTS.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                </div>
                {hasIsps
                  ? <IspSelect isps={isps} value={selIsp} onChange={setSelIsp} />
                  : <Input label="ISP Code" placeholder="e.g. att, verizon_wireless" value={selIsp} onChange={e => setSelIsp(e.target.value)} />
                }
                <Input label="ASN" placeholder="e.g. AS8881" value={asn} onChange={e => setAsn(e.target.value)} />
                <Input label="ZIP Code" placeholder="e.g. 90210" value={zipcode} onChange={e => setZipcode(e.target.value)} />
              </div>
            </Section>

            {/* Expert Settings */}
            {isRp && (
              <Section title="Expert Settings" note="Premium only">
                <div className="space-y-2">
                  <Input label="Max Fraud Score (0–100)" type="number" min="0" max="100" placeholder="Any" value={fraudscore} onChange={e => setFraudscore(e.target.value)} />
                  <div>
                    <label className="text-[10px] text-gray-600 block mb-1">Device Type</label>
                    <select
                      value={device}
                      onChange={e => setDevice(e.target.value)}
                      className="w-full bg-[#111] border border-[#1e1e1e] rounded px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500/50"
                    >
                      {DEVICES.map(d => <option key={d.code} value={d.code}>{d.label}</option>)}
                    </select>
                  </div>
                  <Input label="Max Latency (ms)" type="number" min="1" placeholder="Any" value={latency} onChange={e => setLatency(e.target.value)} />
                  <div className="space-y-2 pt-1">
                    <Toggle checked={adblock}  onChange={setAdblock}  label="Ad Blocking" />
                    <Toggle checked={http3}    onChange={setHttp3}    label="HTTP3 / QUIC" />
                    <Toggle checked={localDns} onChange={setLocalDns} label="Local DNS" />
                    <Toggle checked={extended} onChange={setExtended} label="Extended Pool (4–6× IPs)" />
                  </div>
                </div>
              </Section>
            )}

            {/* Output Options */}
            <Section title="Output Options">
              <div className="space-y-2.5">
                <Toggle checked={stripHttp} onChange={setStripHttp} label="Strip http:// prefix" />
                <Toggle checked={maskEnabled} onChange={setMaskEnabled} label="Mask hostname" />
                {maskEnabled && (
                  <div className="pl-9 space-y-1">
                    <Input
                      placeholder="proxy.yourdomain.com"
                      value={maskHost}
                      onChange={e => setMaskHost(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-700 leading-relaxed">
                      Replaces <span className="text-gray-600">{curProd?.endpoint}</span> in output.
                      Set up a CNAME → <span className="text-gray-600">{curProd?.endpoint}</span> for functional proxies.
                    </p>
                  </div>
                )}
              </div>
            </Section>

          </aside>

          {/* ── Main Content ─────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0 flex flex-col p-5">

            {/* Action bar */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <button
                onClick={generate}
                disabled={!apiKey || generating}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm rounded font-medium transition-colors"
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Generating…
                  </span>
                ) : `Generate ${amount} ${amount === 1 ? 'Proxy' : 'Proxies'}`}
              </button>

              {proxies.length > 0 && <>
                <button onClick={copyAll} className="px-3 py-2 bg-[#141414] hover:bg-[#1e1e1e] border border-[#222] hover:border-[#2a2a2a] text-xs rounded transition-colors">
                  {copied ? '✓ Copied' : 'Copy All'}
                </button>
                <button onClick={exportTxt} className="px-3 py-2 bg-[#141414] hover:bg-[#1e1e1e] border border-[#222] hover:border-[#2a2a2a] text-xs rounded transition-colors">
                  Export .txt
                </button>
                <button onClick={() => setProxies([])} className="px-3 py-2 bg-[#141414] hover:bg-[#1e1e1e] border border-[#222] hover:border-[#2a2a2a] text-xs text-gray-600 hover:text-gray-400 rounded transition-colors">
                  Clear
                </button>
                <span className="ml-auto text-xs text-gray-700">
                  {proxies.length} {proxies.length === 1 ? 'proxy' : 'proxies'} · {curProd?.label} · {protocol.toUpperCase()}
                </span>
              </>}
            </div>

            {/* Error */}
            {genError && (
              <div className="mb-4 px-4 py-3 bg-red-950/50 border border-red-800/40 rounded text-xs text-red-400">
                {genError}
              </div>
            )}

            {/* Empty state */}
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
                <p className="text-sm text-gray-700">Configure your settings and click Generate</p>
              </div>
            )}

            {/* Proxy output */}
            {proxies.length > 0 && (
              <div className="flex-1 flex flex-col bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-2 border-b border-[#1a1a1a] bg-[#0f0f0f]">
                  <span className="text-[10px] text-gray-700 uppercase tracking-widest">Output</span>
                  <span className="ml-auto text-[10px] text-gray-700">{proxies.length} lines</span>
                </div>
                <textarea
                  readOnly
                  value={proxies.join('\n')}
                  className="flex-1 w-full bg-transparent px-4 py-3 text-xs text-gray-300 resize-none focus:outline-none leading-5 font-mono"
                  spellCheck={false}
                />
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}
