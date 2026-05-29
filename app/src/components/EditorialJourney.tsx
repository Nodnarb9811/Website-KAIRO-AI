import { useEffect, useRef } from 'react'
import { clamp } from '../lib/state'

const CHAPTERS = [
  'I · Diagnosis',
  'II · Doctrine',
  'III · Operator',
  'IV · Method',
  'V · Work',
  'VI · Evidence',
  'VII · Forelock',
]

// Drives the editorial "journey": the drawing thread-rail + chapter nodes, the scroll-warming
// grade, and ghost-numeral parallax. Reads window scroll directly (independent of the 3D progress).
export function EditorialJourney() {
  const rail = useRef<HTMLDivElement>(null!)
  const fill = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const nodes = Array.from(rail.current.querySelectorAll<HTMLElement>('.chap-node'))
    let raf = 0
    const loop = () => {
      const main = document.getElementById('editorial')
      if (main) {
        const vh = window.innerHeight
        const y = window.scrollY
        const top = main.offsetTop
        const h = main.offsetHeight
        const edStart = top - vh * 0.9
        const edEnd = top + h - vh * 0.55
        const edProg = clamp((y - edStart) / (edEnd - edStart))
        fill.current.style.height = (edProg * 100).toFixed(1) + '%'

        // active chapter = last whose top crosses the viewport reading line
        const chapters = Array.from(main.querySelectorAll<HTMLElement>('[data-chapter]'))
        let active = 0
        chapters.forEach((c, i) => {
          if (c.getBoundingClientRect().top < vh * 0.45) active = i
        })
        nodes.forEach((n, i) => {
          n.classList.toggle('on', i <= active)
          n.classList.toggle('cur', i === active)
        })

        // visible only while the editorial is on screen
        const visible = y + vh > top + 60 && y < top + h - 120
        rail.current.style.opacity = visible ? '1' : '0'

        // scroll-warming light
        const warm = main.querySelector<HTMLElement>('.warm-grade')
        if (warm) warm.style.opacity = (edProg * 0.9).toFixed(3)

        // ghost numeral parallax
        main.querySelectorAll<HTMLElement>('.ghost-num').forEach((g) => {
          const r = g.getBoundingClientRect()
          const off = r.top + r.height / 2 - vh / 2
          g.style.setProperty('--py', `${(off * -0.06).toFixed(1)}px`)
        })
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={rail} className="chap-rail">
      <div className="chap-line">
        <div ref={fill} className="chap-fill" />
        {CHAPTERS.map((label, i) => (
          <div key={label} className="chap-node" style={{ top: `${(i / (CHAPTERS.length - 1)) * 100}%` }}>
            <span className="dot" />
            <span className="cn-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
