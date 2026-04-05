import { useState } from 'react'
import swarms from './data/mockSwarms.json'
import { useMockStream } from './hooks/useMockStream.js'

const tx = 'transition-all duration-300 ease-in-out'

function StreamEventRow({ event }) {
  const gap = 'mb-4 last:mb-0'

  switch (event.type) {
    case 'system':
      return (
        <div className={gap}>
          <p className="font-mono text-[13px] leading-relaxed text-zinc-500">
            {event.text}
          </p>
        </div>
      )
    case 'agent':
      return (
        <div className={gap}>
          <p className="font-mono text-[13px] leading-relaxed text-green-400">
            <span className="font-bold text-green-300">{event.from}</span>
            <span className="text-green-500/90"> — </span>
            {event.text}
          </p>
        </div>
      )
    case 'payload':
      return (
        <div className={gap}>
          <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Payload · <span className="text-zinc-400">{event.from}</span>
          </p>
          <pre className="overflow-x-auto rounded-md border border-gray-700 bg-gray-900 p-3 font-mono text-[11px] leading-relaxed text-zinc-300 shadow-[inset_0_2px_8px_rgba(0,0,0,0.45)]">
            {JSON.stringify(event.json, null, 2)}
          </pre>
        </div>
      )
    case 'success':
      return (
        <div className={gap}>
          <p className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-200 bg-clip-text font-mono text-[13px] font-semibold leading-relaxed text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.55)]">
            {event.text}
          </p>
        </div>
      )
    default:
      return null
  }
}

function formatInr(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function App() {
  const [currentView, setCurrentView] = useState('storefront')
  const [activeSwarm, setActiveSwarm] = useState(null)
  const [chatInput, setChatInput] = useState('')
  const [userMessage, setUserMessage] = useState(null)

  const {
    events: streamEvents,
    isStreaming,
    isComplete,
    startStream,
    resetStream,
  } = useMockStream()

  const defaultDeploySwarm = swarms[0] ?? null

  function goStorefront() {
    setCurrentView('storefront')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function scrollToLiveSwarms() {
    setCurrentView('storefront')
    requestAnimationFrame(() => {
      document.getElementById('live-swarms')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  function handleHire(swarm) {
    resetStream()
    setActiveSwarm(swarm)
    setCurrentView('workspace')
    setUserMessage(null)
    setChatInput('')
  }

  function handleDeploySwarm() {
    if (!defaultDeploySwarm) return
    resetStream()
    setActiveSwarm(defaultDeploySwarm)
    setCurrentView('workspace')
    setUserMessage(null)
    setChatInput('')
  }

  function handleSendChat(e) {
    e.preventDefault()
    const text = chatInput.trim()
    if (!text || isStreaming) return
    setUserMessage(text)
    setChatInput('')
    startStream()
  }

  function handleBackToMarketplace() {
    resetStream()
    setUserMessage(null)
    setChatInput('')
    goStorefront()
  }

  const navLinkBase = `text-[13px] font-medium text-zinc-400 ${tx} hover:text-white active:scale-[0.98]`
  const navLinkActive = 'text-white'

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 antialiased">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-30%,rgba(59,130,246,0.14),transparent)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_0%,rgba(139,92,246,0.1),transparent)]" />

      <header
        className={`sticky top-0 z-50 border-b border-white/[0.06] bg-[#070708]/75 ${tx} backdrop-blur-xl backdrop-saturate-150`}
      >
        <nav className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-4 px-4 sm:h-[52px] sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={goStorefront}
              className={`shrink-0 rounded-md px-2 py-1.5 font-mono text-[13px] font-semibold tracking-[0.2em] text-white ${tx} hover:bg-white/[0.06] active:scale-[0.98] sm:px-2.5`}
            >
              CORTEX
            </button>
            <div className="mx-1 hidden h-4 w-px bg-white/[0.08] sm:block" />
            <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-1">
              <button
                type="button"
                onClick={goStorefront}
                className={`${navLinkBase} shrink-0 rounded-md px-2 py-1.5 sm:px-2.5 ${currentView === 'storefront' ? navLinkActive : ''}`}
              >
                Marketplace
              </button>
              <button
                type="button"
                onClick={scrollToLiveSwarms}
                className={`${navLinkBase} shrink-0 rounded-md px-2 py-1.5 sm:px-2.5`}
              >
                Live Swarms
              </button>
              <button
                type="button"
                className={`${navLinkBase} shrink-0 rounded-md px-2 py-1.5 sm:px-2.5`}
              >
                Enterprise
              </button>
              <button
                type="button"
                className={`${navLinkBase} shrink-0 rounded-md px-2 py-1.5 sm:px-2.5`}
              >
                Docs
              </button>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <div className="flex max-w-[140px] items-center gap-2 sm:max-w-none">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9),0_0_24px_rgba(52,211,153,0.45)]" />
              </span>
              <span className="truncate font-mono text-[10px] font-medium tabular-nums tracking-tight text-zinc-300 sm:text-[11px]">
                Network TVL: ₹4.2M
              </span>
            </div>
            <button
              type="button"
              className={`rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] font-semibold text-zinc-100 ${tx} hover:border-white/[0.18] hover:bg-white/[0.08] active:scale-95 sm:px-3.5 sm:py-2 sm:text-xs`}
              onClick={() => alert('Wallet connection mocked for demo!')}
            >
              Connect Wallet
            </button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-[1280px] px-4 pb-28 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        {currentView === 'storefront' && (
          <>
            <section className="mb-12 text-center sm:mb-14">
              <p
                className={`mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-violet-400/90 sm:text-[11px] ${tx}`}
              >
                Protocol · Mainnet-ready orchestration
              </p>
              <h1 className="mx-auto max-w-4xl text-balance bg-gradient-to-br from-white via-zinc-100 to-cyan-400/90 bg-clip-text text-4xl font-bold leading-[1.08] tracking-tight text-transparent sm:text-6xl sm:leading-[1.05] lg:text-7xl">
                The OS for Autonomous Digital Labor.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-zinc-400 sm:text-lg sm:leading-relaxed">
                Stop wiring agent graphs. Hire verified, outcome-driven AI swarms
                that execute in the cloud, verify on-chain, and settle in escrow.
              </p>
              <div className="mx-auto mt-9 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                <button
                  type="button"
                  onClick={handleDeploySwarm}
                  disabled={!defaultDeploySwarm}
                  className={`w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 font-mono text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_40px_-4px_rgba(34,211,238,0.45)] sm:w-auto ${tx} hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_56px_-4px_rgba(34,211,238,0.55)] active:scale-95 disabled:pointer-events-none disabled:opacity-40`}
                >
                  Deploy a Swarm
                </button>
                <button
                  type="button"
                  className={`w-full rounded-lg border border-white/[0.12] bg-transparent px-7 py-3 font-mono text-sm font-medium text-zinc-200 sm:w-auto ${tx} hover:border-white/[0.22] hover:bg-white/[0.04] active:scale-95`}
                >
                  Read the Protocol
                </button>
              </div>
            </section>

            <section
              className={`relative left-1/2 mb-14 w-screen -translate-x-1/2 border-y border-white/[0.06] bg-[#050506]/90 py-3.5 ${tx} backdrop-blur-md sm:py-4`}
            >
              <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-y-3 px-4 sm:grid sm:grid-cols-3 sm:justify-items-center sm:px-6 lg:px-8">
                {[
                  ['Active Agents', '4,192'],
                  ['Tasks Verified', '89,014'],
                  ['Avg Inference Speed', '812 t/s'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex w-full items-baseline justify-between gap-3 border-white/[0.04] sm:block sm:w-auto sm:border-0 sm:text-center"
                  >
                    <span className="whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      {label}
                    </span>
                    <span className="font-mono text-sm font-semibold tabular-nums text-zinc-100 sm:text-base">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section id="live-swarms" className="scroll-mt-24">
              <div className="mb-8 flex flex-col gap-1 border-b border-white/[0.06] pb-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Live swarms
                  </h2>
                  <p className="mt-1.5 text-sm text-zinc-400">
                    On-demand labor units · Escrow-settled · INR pricing
                  </p>
                </div>
                <p className="font-mono text-[11px] text-zinc-600">
                  {swarms.length} verified listings
                </p>
              </div>

              <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {swarms.map((swarm) => (
                  <li key={swarm.id}>
                    <article
                      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-b from-gray-900 to-black p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ring-1 ring-inset ring-white/[0.04] ${tx} hover:-translate-y-1 hover:border-cyan-500/20 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.15),0_24px_80px_-12px_rgba(34,211,238,0.25),0_0_60px_-8px_rgba(59,130,246,0.2)] sm:p-6`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold leading-snug tracking-tight text-zinc-50">
                          {swarm.title}
                        </h3>
                        {swarm.verified && (
                          <span className="shrink-0 rounded-md border border-emerald-500/25 bg-emerald-500/[0.07] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-emerald-400/95">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="mb-4 flex-1 text-[13px] leading-relaxed text-zinc-500">
                        {swarm.description}
                      </p>
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {swarm.workerAgents.map((agent) => (
                          <span
                            key={agent}
                            className="rounded border border-white/[0.06] bg-black/40 px-2 py-0.5 font-mono text-[10px] text-zinc-500"
                          >
                            {agent}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto border-t border-white/[0.06] pt-4">
                        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-zinc-500">
                          <span>99.8% Success Rate</span>
                          <span className="text-white/[0.08]">·</span>
                          <span>Avg Time: 2.4m</span>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-mono text-xl font-semibold tabular-nums tracking-tight text-white sm:text-2xl">
                            {formatInr(swarm.price)}
                          </p>
                          <button
                            type="button"
                            className={`w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 font-mono text-xs font-semibold text-white shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)] sm:w-auto sm:px-5 ${tx} hover:shadow-[0_0_36px_-4px_rgba(34,211,238,0.55)] active:scale-95`}
                            onClick={() => handleHire(swarm)}
                          >
                            Hire Swarm
                          </button>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        {currentView === 'workspace' && (
          <section className="mx-auto flex max-w-[1280px] flex-col gap-8">
            <button
              type="button"
              className={`self-start rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2 font-mono text-xs text-zinc-300 ${tx} hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white active:scale-95`}
              onClick={handleBackToMarketplace}
            >
              ← Back to Marketplace
            </button>

            <header className="border-b border-white/[0.06] pb-6">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-500">
                Active deployment
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {activeSwarm?.title ?? 'No Swarm Hired'}
              </h1>
              {activeSwarm && (
                <p className="mt-2 font-mono text-xs text-zinc-500">
                  Session ID ·{' '}
                  <span className="text-zinc-400">{activeSwarm.id}</span>
                </p>
              )}
            </header>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
              <aside
                className={`flex min-h-[min(360px,50vh)] w-full flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 ${tx} backdrop-blur-sm lg:w-[30%] lg:min-h-0 lg:shrink-0`}
              >
                <div className="mb-4 border-b border-white/[0.06] pb-3">
                  <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Chat / Input
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    Outbound directives to the active swarm session.
                  </p>
                </div>
                <div
                  className="mb-4 min-h-0 flex-1 space-y-3 overflow-y-auto rounded-lg border border-white/[0.06] bg-black/40 p-3"
                  role="log"
                  aria-label="Chat history"
                >
                  {!userMessage ? (
                    <p className="font-mono text-[11px] text-zinc-600">
                      No messages yet. Send a directive below — the handshake
                      stream starts after you send.
                    </p>
                  ) : (
                    <div className="flex justify-end">
                      <div
                        className={`max-w-[95%] rounded-2xl rounded-br-md border border-cyan-500/25 bg-gradient-to-br from-cyan-500/15 to-blue-600/10 px-3.5 py-2.5 ${tx} shadow-[0_0_24px_-8px_rgba(34,211,238,0.35)]`}
                      >
                        <p className="text-right font-mono text-[12px] leading-relaxed text-zinc-100">
                          {userMessage}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <form onSubmit={handleSendChat} className="mt-auto flex flex-col gap-2">
                  <label htmlFor="workspace-chat" className="sr-only">
                    Message to swarm
                  </label>
                  <input
                    id="workspace-chat"
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Direct your swarm…"
                    disabled={isStreaming}
                    className={`min-h-10 w-full rounded-lg border border-white/[0.1] bg-black/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 ${tx} focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-50`}
                  />
                  <button
                    type="submit"
                    disabled={isStreaming}
                    className={`w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 font-mono text-xs font-semibold text-white ${tx} hover:opacity-95 active:scale-95 disabled:pointer-events-none disabled:opacity-40`}
                  >
                    Send
                  </button>
                </form>
              </aside>

              <div className="flex min-w-0 w-full flex-col gap-4 lg:w-[70%]">
                <div className="mb-0 flex items-center justify-between gap-2">
                  <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Simulated handshake terminal
                  </h2>
                  <span className="font-mono text-[10px] text-zinc-600">
                    {isStreaming
                      ? 'streaming…'
                      : isComplete
                        ? 'settled'
                        : 'idle'}
                  </span>
                </div>
                <div
                  className="max-h-[min(560px,65vh)] min-h-[min(360px,50vh)] overflow-y-auto rounded-lg border border-gray-800 bg-black p-4 font-mono shadow-2xl shadow-black/40"
                  role="log"
                  aria-live="polite"
                  aria-label="Agent event stream"
                >
                  {streamEvents.length === 0 && !isStreaming ? (
                    <p className="font-mono text-[12px] text-zinc-600">
                      Awaiting secure channel handshake — send a chat directive
                      to begin.
                    </p>
                  ) : streamEvents.length === 0 && isStreaming ? (
                    <p className="font-mono text-[12px] text-zinc-500">
                      Handshake in progress…
                    </p>
                  ) : (
                    streamEvents.map((event, index) => (
                      <StreamEventRow
                        key={`${index}-${event.type}`}
                        event={event}
                      />
                    ))
                  )}
                </div>

                {isComplete && (
                  <div
                    className={`rounded-xl border border-fuchsia-500/25 bg-gradient-to-br from-[#12081a] via-[#0a0610] to-black p-5 shadow-[0_0_0_1px_rgba(168,85,247,0.12),0_0_48px_-12px_rgba(147,51,234,0.35),0_0_64px_-16px_rgba(236,72,153,0.12)] ${tx}`}
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200/90">
                        Proof of Execution
                      </h3>
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.35)]">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        Verified on Polygon PoS
                      </span>
                    </div>
                    <dl className="space-y-2 font-mono text-[12px] leading-relaxed text-zinc-400">
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                        <dt className="text-zinc-500">Tx Hash:</dt>
                        <dd className="text-zinc-200">0x8fB4...9c3a1</dd>
                      </div>
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                        <dt className="text-zinc-500">Block:</dt>
                        <dd className="tabular-nums text-zinc-200">4819204</dd>
                      </div>
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                        <dt className="text-zinc-500">Gas:</dt>
                        <dd className="text-zinc-200">0.00014 MATIC</dd>
                      </div>
                    </dl>
                    <button
                      type="button"
                      className={`mt-5 w-full rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/[0.08] py-2.5 font-mono text-xs font-semibold text-fuchsia-100 ${tx} hover:border-fuchsia-400/45 hover:bg-fuchsia-500/[0.14] active:scale-[0.98] sm:w-auto sm:px-6`}
                      onClick={() =>
                        alert('Output artifact viewer — demo (no file attached).')
                      }
                    >
                      View Output Artifact
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
