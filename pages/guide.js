import Head from 'next/head';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';

const SECTIONS = [
  {
    id: 'formats',
    icon: '📋',
    title: 'Proxy Format',
    content: (
      <div className="space-y-4">
        <p className="text-gray-400 leading-relaxed">
          Santah Resis proxies are generated in <span className="text-white font-mono">host:port:user:pass</span> format — the most widely supported format across botting software.
        </p>
        <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-[#1e1e1e] bg-[#0f0f0f] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500/60" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <span className="w-2 h-2 rounded-full bg-lime-500/60" />
            <span className="text-[10px] text-gray-600 font-mono ml-1">example proxy</span>
          </div>
          <pre className="px-4 py-3 text-xs text-lime-300 font-mono overflow-x-auto whitespace-pre-wrap break-all">
{`rp.evomi.com:1000:biggestwa:kNxodLDTBwgvOnP2ugQR_country-US_session-AB3K9XYZ`}
          </pre>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { label: 'Host', value: 'rp.evomi.com', color: 'text-lime-400' },
            { label: 'Port', value: '1000', color: 'text-yellow-400' },
            { label: 'Username', value: 'biggestwa', color: 'text-blue-400' },
            { label: 'Password + Params', value: 'pass_country-US_...', color: 'text-red-400' },
          ].map(p => (
            <div key={p.label} className="bg-[#111] border border-[#1e1e1e] rounded p-2">
              <div className="text-gray-600 text-[10px] mb-1">{p.label}</div>
              <div className={`font-mono truncate ${p.color}`}>{p.value}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'rotating',
    icon: '🔄',
    title: 'Rotating Proxies',
    tag: 'New IP every request',
    tagColor: 'text-lime-400 bg-lime-500/10 border-lime-500/20',
    content: (
      <div className="space-y-4">
        <p className="text-gray-400 leading-relaxed">
          Every request is routed through a <span className="text-white">different IP address</span> automatically. No session is maintained between requests.
        </p>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white">Best for:</h4>
          <ul className="space-y-1.5 text-sm text-gray-400">
            <li className="flex items-start gap-2"><span className="text-lime-500 mt-0.5">✓</span> Mass scraping / data collection</li>
            <li className="flex items-start gap-2"><span className="text-lime-500 mt-0.5">✓</span> Account creation at scale</li>
            <li className="flex items-start gap-2"><span className="text-lime-500 mt-0.5">✓</span> Monitoring product availability (no login needed)</li>
            <li className="flex items-start gap-2"><span className="text-lime-500 mt-0.5">✓</span> Testing site responses across many IPs</li>
          </ul>
        </div>
        <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-4">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Bot config example</p>
          <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{`Mode: Rotating
Proxy list: paste all proxies
Proxy per task: 1
Rotate on: Every request`}</pre>
        </div>
        <div className="flex items-start gap-2 p-3 bg-yellow-900/10 border border-yellow-500/20 rounded-lg">
          <span className="text-yellow-500 text-sm flex-shrink-0">⚠</span>
          <p className="text-xs text-yellow-200/70">Not ideal for checkout flows — the site will see different IPs mid-session which can trigger fraud detection.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'sticky',
    icon: '📌',
    title: 'Sticky Proxies',
    tag: 'Same IP, up to 1440 min',
    tagColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    content: (
      <div className="space-y-4">
        <p className="text-gray-400 leading-relaxed">
          Maintains the <span className="text-white">same IP address</span> for the duration of your session. Evomi will try to keep you on the same IP — if it drops, it reassigns intelligently.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Best for:</h4>
            <ul className="space-y-1.5 text-sm text-gray-400">
              <li className="flex items-start gap-2"><span className="text-lime-500 mt-0.5">✓</span> Add-to-cart → checkout flows</li>
              <li className="flex items-start gap-2"><span className="text-lime-500 mt-0.5">✓</span> Account-based botting (login sessions)</li>
              <li className="flex items-start gap-2"><span className="text-lime-500 mt-0.5">✓</span> Sneaker / retail copping</li>
              <li className="flex items-start gap-2"><span className="text-lime-500 mt-0.5">✓</span> Pokémon Center, Walmart, Target drops</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Lifetime setting:</h4>
            <div className="space-y-1.5 text-sm text-gray-400">
              <div className="flex justify-between"><span>Quick drop (fast site)</span><span className="text-lime-400 font-mono">5–15 min</span></div>
              <div className="flex justify-between"><span>Normal checkout</span><span className="text-lime-400 font-mono">20–30 min</span></div>
              <div className="flex justify-between"><span>Account warmup</span><span className="text-lime-400 font-mono">60–120 min</span></div>
              <div className="flex justify-between"><span>Long sessions</span><span className="text-lime-400 font-mono">240–1440 min</span></div>
            </div>
          </div>
        </div>
        <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg p-4">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Bot config example</p>
          <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{`Mode: Sticky / Residential
Proxy per task: 1 proxy = 1 task
Rotate on: Task retry or new task
Session duration: 30 min`}</pre>
        </div>
      </div>
    ),
  },
  {
    id: 'hard',
    icon: '🔒',
    title: 'Hard Sticky Proxies',
    tag: 'IP held as long as possible',
    tagColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    content: (
      <div className="space-y-4">
        <p className="text-gray-400 leading-relaxed">
          Evomi holds the <span className="text-white">same IP as long as it possibly can</span> — even across multiple sessions. Unlike sticky, there&apos;s no lifetime limit. The IP only changes if it becomes unavailable.
        </p>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white">Best for:</h4>
          <ul className="space-y-1.5 text-sm text-gray-400">
            <li className="flex items-start gap-2"><span className="text-lime-500 mt-0.5">✓</span> Long-running account aging / warmup</li>
            <li className="flex items-start gap-2"><span className="text-lime-500 mt-0.5">✓</span> Accounts that need IP consistency across days</li>
            <li className="flex items-start gap-2"><span className="text-lime-500 mt-0.5">✓</span> Sites that flag IP changes mid-session aggressively</li>
          </ul>
        </div>
        <div className="flex items-start gap-2 p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
          <span className="text-red-400 text-sm flex-shrink-0">!</span>
          <p className="text-xs text-red-200/70">Hard sticky is <strong>incompatible with the lifetime setting</strong>. Do not set a lifetime when using hard mode.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'botting',
    icon: '🤖',
    title: 'Botting Setup Guide',
    content: (
      <div className="space-y-6">
        <p className="text-gray-400 leading-relaxed">
          How to plug Santah Resis proxies into popular botting software.
        </p>

        {[
          {
            name: 'Cyber AIO / NSB / Wrath',
            steps: [
              'Go to Proxies tab → Import proxies',
              'Select format: HOST:PORT:USER:PASS',
              'Paste your list and save',
              'In task settings, assign proxy group',
              'Use 1 proxy per task for sticky, rotate for scraping',
            ],
          },
          {
            name: 'Kodai / Splashforce',
            steps: [
              'Settings → Proxy Lists → New List',
              'Format: HOST:PORT:USER:PASS',
              'Import and name your list',
              'Assign to tasks via task editor',
              'Recommended: sticky 30min for checkout tasks',
            ],
          },
          {
            name: 'Mango / Balko',
            steps: [
              'Dashboard → Proxies → Add Proxy List',
              'Choose HOST:PORT:USER:PASS format',
              'Paste and save',
              'Link proxy list to your task group',
            ],
          },
          {
            name: 'Manual / Custom Bot',
            steps: [
              'Parse each line: split by ":" → host, port, user, pass',
              'Build URL: http://user:pass@host:port',
              'Pass to requests library as HTTP proxy',
              'For sticky: reuse same proxy object per session',
              'For rotating: pick a new proxy per request',
            ],
          },
        ].map(bot => (
          <div key={bot.name} className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-[#0f0f0f] border-b border-[#1e1e1e]">
              <span className="text-sm font-semibold text-white">{bot.name}</span>
            </div>
            <ol className="px-4 py-3 space-y-1.5">
              {bot.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="text-lime-600 font-mono text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'tips',
    icon: '💡',
    title: 'Pro Tips',
    content: (
      <div className="space-y-3">
        {[
          {
            tip: 'One proxy per task',
            detail: 'Assign exactly one proxy to each bot task. Sharing proxies across tasks causes IP collisions and bans.',
            color: 'border-lime-500/20 bg-lime-500/5',
          },
          {
            tip: 'State targeting for geo-locked drops',
            detail: 'Some sites like Pokémon Center or local retailer drops require IPs from a specific state. Use the State filter to match the drop region.',
            color: 'border-lime-500/20 bg-lime-500/5',
          },
          {
            tip: 'Use ISP targeting for cleaner IPs',
            detail: 'IPs from major ISPs (Comcast, AT&T, Spectrum) look more legitimate than smaller providers. Filter by ISP when success rate matters.',
            color: 'border-lime-500/20 bg-lime-500/5',
          },
          {
            tip: 'Test before your run',
            detail: 'Use the RTT tester on the dashboard to verify your proxies are alive and hitting the right sites before a drop.',
            color: 'border-lime-500/20 bg-lime-500/5',
          },
          {
            tip: 'Fraud score filter for sensitive sites',
            detail: 'Enable expert settings and set a max fraud score of 20–30 for sites with aggressive fraud detection (Pokémon Center, Target).',
            color: 'border-lime-500/20 bg-lime-500/5',
          },
          {
            tip: 'Generate fresh proxies per run',
            detail: 'Regenerate your proxy list before each drop. Old sticky session IDs may have expired or been flagged.',
            color: 'border-yellow-500/20 bg-yellow-500/5',
          },
        ].map((t, i) => (
          <div key={i} className={`border rounded-lg p-4 ${t.color}`}>
            <h4 className="text-sm font-semibold text-white mb-1">{t.tip}</h4>
            <p className="text-xs text-gray-400 leading-relaxed">{t.detail}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export default function Guide() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Proxy Guide — Santah Resis</title>
        <meta name="description" content="How to use residential proxies for botting — rotating, sticky, hard sessions, and bot setup guides." />
      </Head>

      <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur border-b border-[#141414]">
          <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between gap-6">
            <a href="/" className="flex items-center gap-2 no-underline flex-shrink-0">
              <span className="text-xl leading-none">🎅</span>
              <span className="font-bold text-sm">
                <span className="text-lime-400">Santah</span><span className="text-white"> Resis</span>
              </span>
            </a>
            <div className="flex items-center gap-1">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/guide" active>Guide</NavLink>
              {session
                ? <NavLink href="/dashboard">Dashboard</NavLink>
                : <button onClick={() => signIn('discord')}
                    className="ml-2 px-3 py-1.5 bg-lime-500 hover:bg-lime-400 text-black text-xs font-bold rounded-lg transition-colors">
                    Login
                  </button>
              }
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-12 flex gap-10">

          {/* Sidebar TOC */}
          <aside className="hidden lg:block w-52 flex-shrink-0 self-start sticky top-20">
            <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-3">On this page</p>
            <nav className="space-y-1">
              {SECTIONS.map(s => (
                <a key={s.id} href={`#${s.id}`}
                  className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-gray-500 hover:text-gray-200 hover:bg-[#111] transition-colors no-underline">
                  <span>{s.icon}</span>
                  <span>{s.title}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 space-y-12">

            {/* Hero */}
            <div className="pb-8 border-b border-[#141414]">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-500/10 border border-lime-500/20 rounded-full text-lime-400 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                Proxy Guide
              </div>
              <h1 className="text-4xl font-black mb-4">
                How to use proxies<br />
                <span className="text-lime-400">for botting</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                Everything you need to know — proxy formats, session types, bot configuration, and tips for maximizing success rate on drops.
              </p>
            </div>

            {/* Sections */}
            {SECTIONS.map(s => (
              <section key={s.id} id={s.id} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold">{s.title}</h2>
                  </div>
                  {s.tag && (
                    <span className={`ml-2 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${s.tagColor}`}>
                      {s.tag}
                    </span>
                  )}
                </div>
                {s.content}
              </section>
            ))}

            {/* CTA */}
            <div className="border-t border-[#141414] pt-10 text-center">
              <p className="text-gray-500 mb-4 text-sm">Ready to generate your proxies?</p>
              {session
                ? <Link href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm rounded-xl transition-colors no-underline">
                    Go to Dashboard →
                  </Link>
                : <button onClick={() => signIn('discord')}
                    className="px-6 py-3 bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm rounded-xl transition-colors">
                    Login with Discord →
                  </button>
              }
            </div>

          </main>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, children, active = false }) {
  return (
    <a href={href}
      className={`px-3 py-1.5 rounded text-xs transition-colors no-underline ${
        active
          ? 'text-lime-400 bg-lime-500/10'
          : 'text-gray-500 hover:text-gray-200 hover:bg-[#111]'
      }`}>
      {children}
    </a>
  );
}
