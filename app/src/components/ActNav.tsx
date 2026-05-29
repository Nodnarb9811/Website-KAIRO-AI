import { useEffect, useRef } from 'react'
import { scroll } from '../lib/state'

const ACTS = [
  { num: 'I', label: 'Chronos' },
  { num: 'II', label: 'Threshold' },
  { num: 'III', label: 'Kairos' },
  { num: 'IV', label: 'Seize' },
  { num: 'V', label: 'Convergence' },
  { num: 'VI', label: 'Operate' },
]
const BOUNDS = [0, 0.15, 0.3, 0.55, 0.68, 0.85, 1.001]

export function ActNav() {
  const root = useRef<HTMLUListElement>(null!)

  useEffect(() => {
    const items = Array.from(root.current.querySelectorAll('li'))
    let raf = 0
    const loop = () => {
      const p = scroll.progress
      let idx = 0
      for (let i = 0; i < BOUNDS.length - 1; i++) {
        if (p >= BOUNDS[i] && p < BOUNDS[i + 1]) {
          idx = i
          break
        }
      }
      items.forEach((li, i) => li.classList.toggle('on', i === idx))
      root.current.style.opacity = p > 0.01 && p < 0.9 ? '1' : '0'
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <ul
      ref={root}
      className="hidden sm:flex fixed right-[26px] top-1/2 -translate-y-1/2 z-[7] flex-col gap-4 list-none m-0 p-0 mix-blend-difference transition-opacity duration-[600ms] opacity-0"
    >
      {ACTS.map((a) => (
        <li
          key={a.num}
          className="act-nav-item flex items-center justify-end gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase text-chronos/45 transition-colors duration-[400ms]"
        >
          <span className="act-nav-lbl opacity-0 translate-x-1.5 transition-[opacity,transform] duration-[400ms]">
            {a.label}
          </span>
          <span className="w-[26px] text-right">{a.num}</span>
          <span className="act-nav-tick w-4 h-px bg-current transition-[width] duration-[400ms]" />
        </li>
      ))}
    </ul>
  )
}
