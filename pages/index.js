import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

const FEATURES = [
  {
    icon: '🌎',
    title: 'Premium US Residential',
    desc: 'Real residential IPs across all 50 states. Undetectable, clean, and battle-tested.',
  },
  {
    icon: '📍',
    title: 'State & City Targeting',
    desc: 'Pin your proxies to any US state or city. Granular geo-control built right in.',
  },
  {
    icon: '⚡',
    title: 'Instant Generation',
    desc: 'Generate up to 10,000 proxies in seconds. Copy, export, and deploy immediately.',
  },
  {
    icon: '🔒',
    title: 'Sticky Sessions',
    desc: 'Keep the same IP for up to 24 hours with sticky or hard session support.',
  },
  {
    icon: '🎯',
    title: 'ISP Targeting',
    desc: 'Choose from 3,000+ ISPs including Comcast, AT&T, Verizon, and Spectrum.',
  },
  {
    icon: '🛡️',
    title: 'Expert Filters',
    desc: 'Filter by fraud score, device type, latency, and more for maximum success rate.',
  },
];

export default function Landing() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [status, router]);

  return (
    <>
      <Head>
        <title>Santah Resis — Premium US Residential Proxies</title>
        <meta name="description" content="Premium US residential proxies with state & city targeting. Instant generation, sticky sessions, ISP filtering." />
      </Head>

      <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* Nav */}
        <nav className="border-b border-[#141414] px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl leading-none">🎅</span>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-lime-400">Santah</span>
                <span className="text-white"> Resis</span>
              </span>
            </div>
            <button
              onClick={() => signIn('discord')}
              className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-medium rounded-lg transition-colors"
            >
              <DiscordIcon />
              Login with Discord
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-28 text-center">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-lime-500/5 rounded-full blur-3xl" />
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-red-600/5 rounded-full blur-3xl" />
          </div>

          {/* Snowflakes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {['top-8 left-[10%]','top-16 right-[15%]','top-4 left-[45%]','top-24 left-[30%]','top-12 right-[35%]','top-32 left-[70%]','top-6 right-[55%]','top-40 left-[20%]'].map((pos, i) => (
              <span key={i} className={`absolute text-white/5 text-3xl ${pos}`}>❄</span>
            ))}
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-500/10 border border-lime-500/20 rounded-full text-lime-400 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              Premium US Residential Network
            </div>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 leading-none">
              <span className="text-white">Proxies that</span>
              <br />
              <span className="text-lime-400">actually</span>
              <span className="text-red-500"> work.</span>
            </h1>

            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Premium US residential proxies with state & city targeting, ISP filtering,
              and sticky sessions. Built for scale — generate 10,000 proxies instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => signIn('discord')}
                className="flex items-center gap-2.5 px-8 py-3.5 bg-lime-500 hover:bg-lime-400 text-black font-bold text-base rounded-xl transition-all hover:scale-105 shadow-lg shadow-lime-500/20"
              >
                <DiscordIcon className="text-black" />
                Get Started Free
              </button>
              <span className="text-gray-600 text-sm">Login with Discord · No credit card</span>
            </div>

            {/* Proxy preview */}
            <div className="mt-16 mx-auto max-w-2xl bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl overflow-hidden text-left">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1a1a1a] bg-[#0f0f0f]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-lime-500/60" />
                <span className="text-[10px] text-gray-600 ml-2 font-mono">proxies.txt</span>
              </div>
              <div className="px-4 py-4 space-y-1.5 font-mono text-[11px]">
                {[
                  'biggestwa:kNxodLDTBwgvOnP2ugQR_country-US_region-california@rp.evomi.com:1000',
                  'biggestwa:kNxodLDTBwgvOnP2ugQR_country-US_region-texas@rp.evomi.com:1000',
                  'biggestwa:kNxodLDTBwgvOnP2ugQR_country-US_session-AB3K7XY9@rp.evomi.com:1000',
                ].map((p, i) => (
                  <div key={i} className="text-gray-500 truncate">
                    <span className="text-lime-600/70 select-none">{i + 1}  </span>
                    {p}
                  </div>
                ))}
                <div className="text-gray-700 text-[10px] pt-1">… 9,997 more proxies</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-20 border-t border-[#141414]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-3xl font-bold mb-3">
              Everything you need
            </h2>
            <p className="text-center text-gray-500 mb-12">Residential proxies built for serious use cases.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => (
                <div key={i} className="bg-[#0f0f0f] border border-[#1a1a1a] hover:border-[#242424] rounded-xl p-5 transition-colors group">
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-lime-400 transition-colors">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="px-6 py-16 border-t border-[#141414]">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-4xl mb-4">🎅</div>
            <h2 className="text-3xl font-black mb-4">
              Ready to <span className="text-lime-400">go?</span>
            </h2>
            <p className="text-gray-500 mb-8">Login with Discord and start generating proxies in seconds.</p>
            <button
              onClick={() => signIn('discord')}
              className="flex items-center gap-2.5 px-8 py-3.5 bg-lime-500 hover:bg-lime-400 text-black font-bold text-base rounded-xl transition-all hover:scale-105 mx-auto shadow-lg shadow-lime-500/20"
            >
              <DiscordIcon className="text-black" />
              Login with Discord
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#141414] px-6 py-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎅</span>
              <span className="font-bold text-sm">
                <span className="text-lime-400">Santah</span> Resis
              </span>
            </div>
            <p className="text-gray-700 text-xs">© {new Date().getFullYear()} Santah Resis. Premium US Residential Proxies.</p>
          </div>
        </footer>

      </div>
    </>
  );
}

function DiscordIcon({ className = '' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.045.031.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  );
}
