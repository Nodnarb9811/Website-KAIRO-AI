import { useEffect, useState } from 'react'
import { useStore } from '../lib/state'

export function Preloader() {
  const setLoaded = useStore((s) => s.setLoaded)
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let v = 0
    const id = window.setInterval(() => {
      v = Math.min(100, v + Math.random() * 18)
      setPct(v)
      if (v >= 100) {
        window.clearInterval(id)
        window.setTimeout(() => {
          setDone(true)
          setLoaded(true)
        }, 350)
      }
    }, 120)
    return () => window.clearInterval(id)
  }, [setLoaded])

  return (
    <div
      className={`fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center transition-[opacity,visibility] duration-[1200ms] delay-200 ${
        done ? 'opacity-0 invisible pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-[min(60vw,420px)] h-px bg-chronos/20 relative overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full transition-[width] duration-150"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, rgba(201,162,75,.2), #e8d39a)' }}
        />
      </div>
      <div className="flex justify-between w-[min(60vw,420px)] mt-[18px] font-mono text-[11px] tracking-[0.28em] uppercase text-chronos/70">
        <span>Kairos · καιρός</span>
        <span className="text-gold">{Math.floor(pct)}%</span>
      </div>
    </div>
  )
}
