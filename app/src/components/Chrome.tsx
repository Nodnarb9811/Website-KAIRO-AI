import { useEffect, useRef, useState } from 'react'
import { scroll } from '../lib/state'

// minimal ambient drone — off by default, respects autoplay policy (created on first toggle)
function useDrone() {
  const ctx = useRef<AudioContext | null>(null)
  const gain = useRef<GainNode | null>(null)
  const [on, setOn] = useState(false)

  const toggle = async () => {
    if (!ctx.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      ctx.current = new AC()
      gain.current = ctx.current.createGain()
      gain.current.gain.value = 0
      gain.current.connect(ctx.current.destination)
      const mk = (f: number, type: OscillatorType, detune = 0) => {
        const o = ctx.current!.createOscillator()
        o.type = type
        o.frequency.value = f
        o.detune.value = detune
        o.connect(gain.current!)
        o.start()
      }
      mk(55, 'sine')
      mk(82.4, 'sine', 6)
      mk(110, 'triangle', -4)
    }
    if (ctx.current.state === 'suspended') await ctx.current.resume()
    const next = !on
    setOn(next)
    const t = ctx.current.currentTime
    gain.current!.gain.cancelScheduledValues(t)
    gain.current!.gain.linearRampToValueAtTime(next ? 0.18 : 0.0, t + 0.8)
  }
  return { on, toggle }
}

export function Chrome() {
  const { on, toggle } = useDrone()
  const seal = useRef<HTMLDivElement>(null!)
  const hint = useRef<HTMLDivElement>(null!)
  const brand = useRef<HTMLDivElement>(null!)
  const sound = useRef<HTMLButtonElement>(null!)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const p = scroll.progress
      hint.current.style.opacity = p < 0.04 ? '1' : '0'
      seal.current.style.opacity = p > 0.9 ? '1' : '0'
      seal.current.style.transform = p > 0.9 ? 'scale(1)' : 'scale(.6)'
      // fade the persistent top chrome out in the editorial (the corner seal carries the brand)
      const chrome = p > 0.9 ? '0' : '1'
      brand.current.style.opacity = chrome
      sound.current.style.opacity = chrome
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <div
        ref={brand}
        className="fixed top-6 left-6 z-[7] font-mono text-[11px] tracking-[0.4em] uppercase text-paper/70 mix-blend-difference transition-opacity duration-500"
      >
        KAIROS AI
      </div>
      <button
        ref={sound}
        onClick={toggle}
        className="fixed top-6 right-6 z-[7] font-mono text-[10px] tracking-[0.28em] uppercase text-paper/60 hover:text-gold-bright transition-[opacity,color] duration-500 mix-blend-difference"
      >
        Sound · {on ? 'On' : 'Off'}
      </button>
      <div
        ref={hint}
        className="fixed left-1/2 -translate-x-1/2 bottom-[30px] z-[7] font-mono text-[10px] tracking-[0.3em] uppercase text-chronos/70 transition-opacity duration-500 text-center"
      >
        Scroll to begin
        <span
          className="scroll-bar block w-px h-[34px] mx-auto mt-2.5"
          style={{ background: 'linear-gradient(rgba(138,150,163,.7), transparent)' }}
        />
      </div>
      <div
        ref={seal}
        className="fixed right-6 bottom-6 z-[6] w-16 h-16 rounded-full border border-gold/50 flex items-center justify-center backdrop-blur-sm pointer-events-none opacity-0 transition-[opacity,transform] duration-700 [transition-timing-function:cubic-bezier(.16,1,.3,1)]"
        style={{ background: 'radial-gradient(circle at 35% 30%, rgba(232,211,154,.25), rgba(10,11,13,.85))' }}
      >
        <span className="seal-glyph font-display italic text-[26px] text-gold-bright">K</span>
      </div>
    </>
  )
}
