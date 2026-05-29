import { useEffect, useRef } from 'react'
import { scroll, clamp, smooth } from '../lib/state'

// The Kairos relief video, composited (screen blend) over the WebGL time-stream.
// It emerges through the warping particles in Act II, then hands off to the marble figure in Act III.
export function Relief() {
  const layer = useRef<HTMLDivElement>(null!)
  const video = useRef<HTMLVideoElement>(null!)

  useEffect(() => {
    video.current.play().catch(() => {})
    let raf = 0
    const loop = () => {
      const p = scroll.progress
      const op = smooth(clamp((p - 0.1) / 0.12)) * (1 - smooth(clamp((p - 0.34) / 0.12)))
      layer.current.style.opacity = op.toFixed(3)
      video.current.style.transform = `scale(${(1.08 + op * 0.07).toFixed(3)})`
      const v = video.current
      if (op > 0.02 && v.paused) v.play().catch(() => {})
      else if (op <= 0.02 && !v.paused) v.pause()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={layer} className="fixed inset-0 z-[1] opacity-0 pointer-events-none">
      <video ref={video} muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover relief-video">
        <source src="/kairos-relief.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 pointer-events-none relief-tint" />
    </div>
  )
}
