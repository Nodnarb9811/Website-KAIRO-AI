import { useEffect, useRef } from 'react'
import { scroll, clamp } from '../lib/state'

type Act = { in: number; mid: number; out: number }
const ACTS: Record<string, Act> = {
  a1: { in: 0.01, mid: 0.06, out: 0.14 },
  a2: { in: 0.16, mid: 0.21, out: 0.29 },
  a3: { in: 0.31, mid: 0.4, out: 0.54 },
  a5: { in: 0.7, mid: 0.78, out: 0.86 },
}

function actOpacity(p: number, a: Act) {
  if (p < a.in || p > a.out) return 0
  const fadeIn = clamp((p - a.in) / (a.mid - a.in))
  const fadeOut = clamp((a.out - p) / (a.out - a.mid))
  return Math.min(fadeIn, fadeOut)
}

// split text into char spans for letter-by-letter reveal
function Split({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} data-reveal>
      {Array.from(text).map((ch, i) => (
        <span className="char" key={i}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}

export function ActText() {
  const root = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    let raf = 0
    const acts = root.current.querySelectorAll<HTMLElement>('[data-act]')
    const loop = () => {
      const p = scroll.progress
      acts.forEach((el) => {
        const key = el.dataset.act!
        const a = ACTS[key]
        el.style.opacity = actOpacity(p, a).toFixed(3)
        // reveal lines
        const local = clamp((p - a.in) / ((a.out - a.in) * 0.55))
        const lines = el.querySelectorAll<HTMLElement>('[data-reveal]')
        lines.forEach((line, li) => {
          const chars = line.querySelectorAll<HTMLElement>('.char')
          const ll = clamp(local - li * 0.12)
          const shown = Math.floor(ll * (chars.length + 6))
          chars.forEach((c, ci) => {
            const on = ci < shown
            c.style.opacity = on ? '1' : '0'
            c.style.transform = on ? 'translateY(0)' : 'translateY(.25em)'
          })
        })
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={root} className="fixed inset-0 z-[2] flex items-center justify-center pointer-events-none">
      {/* ACT I */}
      <div data-act="a1" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,900px)] px-[4vw] text-center opacity-0">
        <div className="font-mono uppercase tracking-[0.42em] text-chronos text-[clamp(10px,1.1vw,13px)] mb-[1.6em]">
          I · Chronos
        </div>
        <div className="font-display font-light text-[clamp(34px,6.4vw,86px)] leading-[1.02] -tracking-[0.01em]">
          <Split text="Most businesses live in Chronos." />
        </div>
        <div className="font-mono font-light uppercase tracking-[0.24em] text-[clamp(11px,1.3vw,15px)] text-paper/60 mt-[1.4em]">
          <Split text="Linear time. Sequential. Relentless." />
        </div>
      </div>

      {/* ACT II */}
      <div data-act="a2" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,900px)] px-[4vw] text-center opacity-0">
        <div className="font-mono uppercase tracking-[0.42em] text-chronos text-[clamp(10px,1.1vw,13px)] mb-[1.6em]">
          II · The Threshold
        </div>
        <div className="font-display font-light text-[clamp(26px,4.4vw,58px)] leading-[1.06]">
          <Split text="Then there is the moment." />
        </div>
      </div>

      {/* ACT III — dictionary definition */}
      <div data-act="a3" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,900px)] px-[4vw] text-center opacity-0">
        <div className="inline-block text-left border border-gold/30 bg-void/40 backdrop-blur-sm px-[clamp(26px,4vw,56px)] py-[clamp(22px,3vw,40px)]">
          <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-gold mb-3.5">III · Kairos</div>
          <div className="font-display italic text-[clamp(30px,4.6vw,56px)]">kairos</div>
          <div className="font-mono text-[12px] tracking-[0.12em] text-chronos my-1.5">
            noun · (in rhetoric) /ˈkʌɪrɒs/
          </div>
          <div className="font-display font-light text-[clamp(17px,1.8vw,23px)] text-paper/80 max-w-[30ch] leading-[1.4]">
            the supreme, opportune moment to act — seized, not awaited.
          </div>
        </div>
      </div>

      {/* ACT V — convergence */}
      <div data-act="a5" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,900px)] px-[4vw] text-center opacity-0">
        <div className="font-mono uppercase tracking-[0.42em] text-chronos text-[clamp(10px,1.1vw,13px)] mb-[1.6em]">
          V · Convergence
        </div>
        <div className="font-display font-light text-[clamp(26px,4.4vw,58px)] leading-[1.06]">
          <Split text="AI, operated at the right moment." />
        </div>
        <div className="font-display font-light text-[clamp(34px,6.4vw,86px)] leading-[1.02] text-gold-bright mt-[0.5em]">
          <Split text="I don't consult. I operate." />
        </div>
      </div>
    </div>
  )
}
