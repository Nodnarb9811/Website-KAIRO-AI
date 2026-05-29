import { Editorial } from './Editorial'

// Reduced-motion / low-power: a still-beautiful static hero, then the editorial domain.
export function Fallback() {
  return (
    <>
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center p-6"
        style={{ background: 'radial-gradient(120% 90% at 50% 20%, #14161a, #0a0b0d)' }}
      >
        <div className="inline-block text-left border border-gold/30 bg-void/50 backdrop-blur-sm px-[clamp(26px,4vw,56px)] py-[clamp(22px,3vw,40px)]">
          <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-gold mb-3.5">Kairos · καιρός</div>
          <div className="font-display italic text-[clamp(30px,4.6vw,56px)] text-paper">kairos</div>
          <div className="font-mono text-[12px] tracking-[0.12em] text-chronos my-1.5">
            noun · the opportune moment to act
          </div>
          <div className="font-display font-light text-[clamp(17px,1.8vw,23px)] text-paper/80">
            I don't consult. I operate.
          </div>
        </div>
      </section>
      <Editorial />
    </>
  )
}
