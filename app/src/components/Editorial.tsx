const SERVICES = [
  { num: '001', title: 'Workflow Automation', body: 'End-to-end pipelines that remove the manual middle. Agents that act, not chatbots that suggest.' },
  { num: '002', title: 'AI Systems Engineering', body: 'Production-grade LLM systems — retrieval, tooling, evals, guardrails — built to run unattended.' },
  { num: '003', title: 'Operator Embedding', body: 'We sit inside your team and ship. Hands on keyboards, in your stack, against your metrics.' },
  { num: '004', title: 'The Moment Audit', body: 'We locate the single highest-leverage intervention in your operation — and seize it.' },
]

export function Editorial() {
  return (
    <main className="marble-grain relative z-[5] bg-paper text-ink px-[clamp(22px,7vw,120px)] pt-[clamp(60px,9vw,140px)]">
      <div className="relative max-w-[1180px] mx-auto">
        {/* hero */}
        <section className="border-t border-ink/20 pt-7 mb-[clamp(80px,12vw,180px)]">
          <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-gold">VI · The Operator's Domain</span>
          <h1 className="font-display font-light text-[clamp(44px,8vw,128px)] leading-[0.96] -tracking-[0.02em] my-[18px]">
            I don't consult.
            <br />
            <em className="italic text-gold">I operate.</em>
          </h1>
          <p className="font-mono font-light text-[clamp(12px,1.4vw,15px)] tracking-[0.06em] max-w-[54ch] text-ink/70 leading-[1.7]">
            Kairos AI embeds inside your operation and builds the automation that runs it — at the one moment it
            matters most. Not slides. Not strategy decks. Systems that ship and keep running.
          </p>
        </section>

        <Section placard="I · Philosophy">
          <h2 className="font-display font-light text-[clamp(28px,4vw,52px)] leading-[1.05] max-w-[18ch]">
            Most teams are trapped in <em className="italic text-gold">Chronos</em> — the linear grind of sequential
            work.
          </h2>
          <p className="lede">
            Kairos is the opportune moment: the instant where the right intervention changes the trajectory of
            everything after it. We find that moment in your business and operate AI inside it — so leverage compounds
            instead of leaking.
          </p>
        </Section>

        <Section placard="II · What We Operate">
          <h2 className="font-display font-light text-[clamp(28px,4vw,52px)] leading-[1.05]">
            Implementation, <em className="italic text-gold">not</em> advice.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/15 border border-ink/15 mt-[30px]">
            {SERVICES.map((s) => (
              <div key={s.num} className="bg-paper p-[clamp(26px,3vw,40px)]">
                <div className="font-mono text-[11px] tracking-[0.3em] text-gold">{s.num}</div>
                <h3 className="font-display text-[clamp(22px,2.6vw,32px)] my-3">{s.title}</h3>
                <p className="font-mono font-light text-[13px] leading-[1.7] text-ink/70">{s.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section placard="III · Method">
          <h2 className="font-display font-light text-[clamp(28px,4vw,52px)] leading-[1.05]">
            Find the moment. <em className="italic text-gold">Operate</em> it. Compound it.
          </h2>
          <p className="lede">
            A fixed engagement, a shipped system, measurable leverage. We do not bill by the hour of conversation. We
            are accountable to what runs in production after we leave.
          </p>
        </Section>

        {/* CTA */}
        <section className="text-center py-[clamp(90px,14vw,220px)] border-t border-ink/15">
          <span className="block font-mono text-[11px] uppercase tracking-[0.34em] text-gold mb-[22px]">VII · Seize It</span>
          <h2 className="font-display font-light text-[clamp(40px,7vw,104px)] leading-none -tracking-[0.02em]">
            The moment <em className="italic text-gold">doesn't wait.</em>
          </h2>
          <a
            className="inline-flex items-center gap-3.5 mt-11 font-mono text-[13px] uppercase tracking-[0.26em] text-ink no-underline px-[34px] py-[18px] border border-ink transition-all duration-[400ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] hover:bg-ink hover:text-paper hover:gap-[22px]"
            href="mailto:hello@kairos.ai?subject=Seize%20the%20moment"
          >
            Seize the moment →
          </a>
        </section>

        <footer className="border-t border-ink/15 pt-10 pb-16 flex justify-between flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
          <span>Kairos AI — Automation &amp; Implementation</span>
          <span>καιρός · the opportune moment</span>
        </footer>
      </div>
    </main>
  )
}

function Section({ placard, children }: { placard: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-ink/15 py-[clamp(40px,6vw,90px)] grid grid-cols-1 md:grid-cols-[220px_1fr] gap-[30px] md:gap-[60px]">
      <div className="flex flex-col gap-3.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-gold">{placard}</span>
      </div>
      <div className="[&_.lede]:font-mono [&_.lede]:font-light [&_.lede]:text-[clamp(13px,1.4vw,16px)] [&_.lede]:leading-[1.8] [&_.lede]:text-ink/[0.78] [&_.lede]:max-w-[60ch] [&_.lede]:mt-6">
        {children}
      </div>
    </section>
  )
}
