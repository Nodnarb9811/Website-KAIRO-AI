import { useEffect, useRef } from 'react'

const MOVES = [
  { label: 'Embed', desc: 'I come inside your business for a week. Not a survey. Not a workshop. I sit with your team and watch the work happen.' },
  { label: 'Diagnose', desc: 'I map the moments — the five places in your operation where AI compresses weeks into minutes, hours into seconds, and expensive humans into expensive humans doing better work.' },
  { label: 'Build', desc: 'I ship the system. Agents, automations, voice, vision, internal tools — whatever the moment demands. Production-grade. Yours.' },
  { label: 'Operate', desc: "I stay. AI doesn't sit still — models evolve, edge cases emerge, new moments open up. I tune the system as it runs, fold in each new capability as it arrives, and keep the work compounding. The operator who built it is the operator who keeps it sharp." },
]

const MOMENTS = [
  { k: '001', lead: 'The moment a lead arrives.', bold: 'Auto-qualified, auto-replied, calendar booked', tail: 'before a human looks.' },
  { k: '002', lead: 'The moment a customer asks.', bold: 'Voice and chat agents that close,', tail: 'not deflect.' },
  { k: '003', lead: 'The moment a report is due.', bold: 'Data pulled, drafted, formatted, sent.', tail: '' },
  { k: '004', lead: 'The moment a decision is made.', bold: 'Internal tools that surface the signal', tail: 'under the noise.' },
  { k: '005', lead: 'The moment work is repeated.', bold: 'Anything done twice is an automation', tail: 'waiting.' },
]

// Placeholder evidence — anonymised illustrative examples. Replace with real client / moment / number.
const CASES = [
  { client: 'Peninsula trades firm', moment: 'Quote-to-booking automated the moment an enquiry lands.', num: '11 hrs/week back' },
  { client: 'Regional clinic group', moment: 'Voice agent handling after-hours triage and bookings.', num: '+38% booked calls' },
  { client: 'Wholesale distributor', moment: 'End-of-month reporting drafted, formatted and sent itself.', num: '3 days → 20 min' },
]

export function Editorial() {
  const root = useRef<HTMLElement>(null!)

  useEffect(() => {
    const els = Array.from(root.current.querySelectorAll<HTMLElement>('.reveal'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      els.forEach((e) => e.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  return (
    <main id="editorial" ref={root} className="relative z-[5] text-ink px-[clamp(14px,4vw,72px)] py-[clamp(40px,7vw,120px)]">
      <div className="ed-panel marble-grain relative max-w-[1180px] mx-auto px-[clamp(22px,5vw,80px)] py-[clamp(36px,5vw,80px)]">
        <div className="warm-grade" />
        <div className="relative z-[1]">
          {/* I · THE DIAGNOSIS */}
          <section data-chapter="0" className="relative border-t border-ink/20 pt-7 mb-[clamp(80px,12vw,180px)]">
            <span className="ghost-num">I</span>
            <span className="reveal block font-mono text-[11px] uppercase tracking-[0.34em] text-gold">I · The Diagnosis</span>
            <h1 className="reveal font-display font-light text-[clamp(44px,8vw,120px)] leading-[0.96] -tracking-[0.02em] my-[18px]">
              Most businesses live in <em className="italic text-gold">Chronos.</em>
            </h1>
            <p className="reveal font-mono font-light text-[clamp(12px,1.4vw,15px)] tracking-[0.06em] max-w-[60ch] text-ink/70 leading-[1.7]">
              Chronos is linear time. The slow march. Quarterly. Sequential. Whatever-everyone-else-is-doing. It is
              where most businesses run — and where most of them will stay, while the window for AI quietly closes
              around them.
            </p>
            <p className="reveal body-copy">
              Right now, every operator in the country is staring at the same opportunity. Most will read another
              article about it. A few will hire a consultant to write a slide deck about it. One in fifty will actually
              do something.
            </p>
            <div className="reveal truth">The deck is not the doing.</div>
            <div className="reveal truth dim">The window is open. It will not be open for long.</div>
          </section>

          {/* II · THE DOCTRINE */}
          <Chapter n="1" ghost="II" placard="II · The Doctrine">
            <h2 className="reveal font-display font-light text-[clamp(28px,4vw,52px)] leading-[1.05]">
              I don't consult. <em className="italic text-gold">I operate.</em>
            </h2>
            <p className="reveal body-copy">
              Consultants leave you with a strategy. Operators leave you with a system — and stay on the floor while it
              runs.
            </p>
            <p className="reveal body-copy">
              I don't write the report — I build the agent. I don't recommend the workflow — I deploy it, wire it into
              your stack, train your team on it, and keep operating it as your business evolves. The work doesn't end
              when the deck is delivered. It begins.
            </p>
            <div className="reveal truth">Verbs over nouns. Built over briefed.</div>
          </Chapter>

          {/* III · THE OPERATOR */}
          <Chapter n="2" ghost="III" placard="III · The Operator">
            <h2 className="reveal font-display font-light text-[clamp(28px,4vw,52px)] leading-[1.05]">
              Engineering depth. Operator instincts. <em className="italic text-gold">Both, in one set of hands.</em>
            </h2>
            <p className="reveal body-copy">
              I'm Brandon — Brando — an AI implementation specialist based on the Mornington Peninsula, building
              production-grade systems for Australian businesses.
            </p>
            <p className="reveal body-copy">My work sits at the production edge of applied AI:</p>
            <p className="reveal plaque">
              Large language models, agentic systems, retrieval-augmented architectures, voice and vision pipelines,
              automation infrastructure, and internal tooling. I work natively across [Anthropic, OpenAI, n8n, Make,
              Vapi, Supabase, etc.] and have deployed [N+] systems into live Australian operations.
            </p>
            <p className="reveal body-copy">
              Not demos. Not pilots. Systems that run inside the business, hold up under real load, and pay for
              themselves.
            </p>
            <p className="reveal body-copy">
              What separates the work is the perspective behind it. I've spent years inside Australian businesses —
              running Audio Spectrum, Sorrento Sharks, and others — which means I'm not theorising about your operation.
              I build for the way it actually works: customers, staff, suppliers, Monday mornings, the quarter-end
              crunch.
            </p>
            <p className="reveal body-copy">
              That combination is rare. Most engineers can ship the technology. Most consultants can describe the
              strategy. Few do both, inside the business, with their hands on the keys.
            </p>
            <div className="reveal truth">You're not hiring a vendor. You're hiring the person who builds it, ships it, and stays.</div>
          </Chapter>

          {/* IV · THE METHOD */}
          <Chapter n="3" ghost="IV" placard="IV · The Method">
            <h2 className="reveal font-display font-light text-[clamp(28px,4vw,52px)] leading-[1.05]">
              Embed. Diagnose. Build. <em className="italic text-gold">Operate.</em>
            </h2>
            <p className="reveal body-copy">Four moves. Decisive at the front. Compounding at the back.</p>
            <div className="moves">
              {MOVES.map((m) => (
                <div className="move reveal" key={m.label}>
                  <div className="mlabel">{m.label}</div>
                  <div className="mdesc">{m.desc}</div>
                </div>
              ))}
            </div>
            <div className="reveal truth">Built once. Operated always.</div>
          </Chapter>

          {/* V · THE WORK */}
          <Chapter n="4" ghost="V" placard="V · The Work">
            <h2 className="reveal font-display font-light text-[clamp(28px,4vw,52px)] leading-[1.05]">
              Five moments, <em className="italic text-gold">seized.</em>
            </h2>
            <p className="reveal body-copy">Every business has moments where AI changes the maths.</p>
            <ul className="moments">
              {MOMENTS.map((m) => (
                <li className="reveal" key={m.k}>
                  <span className="mk">{m.k}</span>
                  <span className="mt">
                    {m.lead} <b>{m.bold}</b>
                    {m.tail ? ` ${m.tail}` : ''}
                  </span>
                </li>
              ))}
            </ul>
            <p className="reveal body-copy">If your business has these moments — and it does — you have a Kairos problem.</p>
            <div className="reveal truth">Five moments. Five compounding wins.</div>
          </Chapter>

          {/* VI · EVIDENCE */}
          <Chapter n="5" ghost="VI" placard="VI · Evidence">
            <h2 className="reveal font-display font-light text-[clamp(28px,4vw,52px)] leading-[1.05]">
              Moments <em className="italic text-gold">captured.</em>
            </h2>
            <div className="cases">
              {CASES.map((c) => (
                <div className="case reveal" key={c.client}>
                  <div className="c-client">{c.client}</div>
                  <div className="c-moment">{c.moment}</div>
                  <div className="c-num">{c.num}</div>
                </div>
              ))}
            </div>
            <div className="reveal truth">Built. Shipped. Running.</div>
          </Chapter>

          {/* VII · THE FORELOCK */}
          <section data-chapter="6" className="relative text-center py-[clamp(90px,14vw,220px)] border-t border-ink/15">
            <span className="ghost-num center">VII</span>
            <span className="reveal block font-mono text-[11px] uppercase tracking-[0.34em] text-gold mb-[22px]">
              VII · The Forelock
            </span>
            <h2 className="reveal font-display font-light text-[clamp(36px,6vw,88px)] leading-none -tracking-[0.02em]">
              The moment is here. <em className="italic text-gold">So is the lock.</em>
            </h2>
            <p className="reveal body-copy mx-auto text-center" style={{ maxWidth: '60ch' }}>
              The myth is clear. You grab the forelock as Kairos approaches. You do not grab the back of his head as he
              leaves.
            </p>
            <p className="reveal body-copy mx-auto text-center" style={{ maxWidth: '60ch' }}>
              And the moment doesn't arrive once. It arrives daily — every lead, every customer, every decision, every
              line of work that could be done sharper, faster, smarter. The operator who is inside catches each one.
            </p>
            <p className="reveal body-copy mx-auto text-center" style={{ maxWidth: '60ch' }}>
              If you're an Australian operator who knows the window is open right now — and you'd rather build than read
              another article about it — we should talk. A small bench by design. Long arcs, not one-off installs. No
              theatre.
            </p>
            <a
              className="cta-forelock reveal inline-flex items-center gap-3.5 mt-12 font-mono text-[13px] uppercase tracking-[0.26em] text-ink no-underline px-[34px] py-[18px] border border-ink transition-all duration-[400ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)]"
              href="mailto:brandon@kairosai.com.au?subject=Seize%20the%20moment"
            >
              Seize the moment →
            </a>
          </section>

          <footer className="border-t border-ink/15 pt-10 pb-4 flex justify-between flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
            <span>Kairos AI — Automation &amp; Implementation · Mornington Peninsula</span>
            <span>καιρός · the opportune moment</span>
          </footer>
        </div>
      </div>
    </main>
  )
}

function Chapter({
  n,
  ghost,
  placard,
  children,
}: {
  n: string
  ghost: string
  placard: string
  children: React.ReactNode
}) {
  return (
    <section
      data-chapter={n}
      className="relative border-t border-ink/15 py-[clamp(40px,6vw,90px)] grid grid-cols-1 md:grid-cols-[220px_1fr] gap-[30px] md:gap-[60px]"
    >
      <span className="ghost-num">{ghost}</span>
      <div className="flex flex-col gap-3.5">
        <span className="reveal font-mono text-[11px] uppercase tracking-[0.34em] text-gold">{placard}</span>
      </div>
      <div className="relative z-[1]">{children}</div>
    </section>
  )
}
