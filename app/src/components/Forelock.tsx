import { useEffect, useRef, useState } from 'react'
import { CONFIG, scroll, fx, fig, useStore } from '../lib/state'

const R = 54
const CIRC = 2 * Math.PI * R

type Phase = 'idle' | 'open' | 'holding' | 'success' | 'missed'

export function Forelock() {
  const setSeized = useStore((s) => s.setSeized)
  const setPhaseStore = useStore((s) => s.setPhase)

  const phase = useRef<Phase>('idle')
  const openedAt = useRef(0)
  const holdStart = useRef(0)
  const resetAt = useRef(0)
  const seizedRef = useRef(false)

  const windowArc = useRef<SVGCircleElement>(null!)
  const holdArc = useRef<SVGCircleElement>(null!)

  const [active, setActive] = useState(false)
  const [missed, setMissed] = useState(false)
  const [label, setLabel] = useState('Seize it')
  const [flash, setFlash] = useState('')

  const inRange = (p: number) => p >= 0.55 && p <= 0.67

  const setPhase = (p: Phase) => {
    phase.current = p
    setPhaseStore(p)
  }

  useEffect(() => {
    windowArc.current.style.strokeDasharray = `${CIRC}`
    holdArc.current.style.strokeDasharray = `${CIRC}`
    holdArc.current.style.strokeDashoffset = `${CIRC}`

    const open = (now: number) => {
      setPhase('open')
      openedAt.current = now
      setActive(true)
      setMissed(false)
      setLabel('Seize it')
      setFlash('')
    }
    const succeed = () => {
      setPhase('success')
      seizedRef.current = true
      setSeized(true)
      setActive(false)
      setFlash('Seized.')
      fx.seize = 1
      fx.seizeT = 0
      window.setTimeout(() => setFlash(''), 1400)
    }
    const miss = (now: number) => {
      setPhase('missed')
      setMissed(true)
      fig.targetRotY = Math.PI // show the bald back of the head
      fig.forelockOn = 0
      setFlash('The moment doesn’t wait.')
      setLabel('Missed')
      resetAt.current = now + 2600
    }
    const reset = (now: number) => {
      fig.targetRotY = 0
      fig.forelockOn = 1
      setFlash('Try again.')
      window.setTimeout(() => {
        setFlash('')
        if (inRange(scroll.progress)) open(performance.now())
        else setPhase('idle')
      }, 1300)
    }

    let raf = 0
    const loop = () => {
      const now = performance.now()
      const p = scroll.progress
      const here = inRange(p)

      if (here && phase.current === 'idle' && !seizedRef.current) open(now)
      if (!here && phase.current === 'open') {
        setActive(false)
        setPhase('idle')
      }

      if (phase.current === 'open' || phase.current === 'holding') {
        const elapsed = now - openedAt.current
        const wRemain = 1 - Math.min(elapsed / CONFIG.windowMs, 1)
        windowArc.current.style.strokeDashoffset = `${CIRC * (1 - wRemain)}`
        if (elapsed > CONFIG.windowMs) {
          miss(now)
        }
      }
      if (phase.current === 'holding') {
        const frac = Math.min((now - holdStart.current) / CONFIG.holdMs, 1)
        holdArc.current.style.strokeDashoffset = `${CIRC * (1 - frac)}`
        if (frac >= 1) succeed()
      }
      if (phase.current === 'missed' && now >= resetAt.current) {
        reset(now)
        phase.current = 'idle' // avoid re-entering reset; reset() schedules reopen
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [setSeized, setPhaseStore])

  const startHold = (e: React.PointerEvent) => {
    e.preventDefault()
    if (phase.current !== 'open') return
    setPhase('holding')
    holdStart.current = performance.now()
    setLabel('Hold…')
  }
  const endHold = () => {
    if (phase.current === 'holding') {
      setPhase('open')
      holdArc.current.style.strokeDashoffset = `${CIRC}`
      setLabel('Seize it')
    }
  }
  useEffect(() => {
    window.addEventListener('pointerup', endHold)
    return () => window.removeEventListener('pointerup', endHold)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[3] flex flex-col items-center justify-center transition-opacity duration-500 ${
        active ? 'opacity-100 pointer-events-auto cursor-pointer' : 'opacity-0 pointer-events-none'
      }`}
      onPointerDown={startHold}
    >
      <div className="font-mono uppercase tracking-[0.42em] text-chronos text-[12px] opacity-80 mb-[30px]">
        IV · Seize the Forelock
      </div>
      <div className="seize-ring relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(138,150,163,.22)" strokeWidth="1.5" />
          <circle
            ref={windowArc}
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="rgba(201,162,75,.4)"
            strokeWidth="1.5"
          />
          <circle
            ref={holdArc}
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#e8d39a"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(232,211,154,.8))' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="w-2 h-2 rounded-full bg-gold-bright"
            style={{ boxShadow: '0 0 18px 4px rgba(232,211,154,.7)' }}
          />
        </div>
      </div>
      <div className={`font-mono text-[12px] uppercase tracking-[0.4em] mt-[26px] ${missed ? 'text-chronos' : 'text-gold'}`}>
        {label}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-chronos/60 mt-2.5">press &amp; hold</div>
      <div
        className={`absolute left-0 right-0 bottom-[22%] text-center font-display italic text-[clamp(22px,3vw,38px)] text-paper transition-opacity duration-500 ${
          flash ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {flash}
      </div>
    </div>
  )
}
