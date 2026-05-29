import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scroll } from '../lib/state'

gsap.registerPlugin(ScrollTrigger)

/**
 * Drives the single normalized scroll progress (0..1) from the tall #cinematic
 * spacer into the non-reactive `scroll.progress` ref, read each frame by the 3D layer.
 */
export function useScrollProgress(triggerId = 'cinematic') {
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: `#${triggerId}`,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        scroll.progress = self.progress
      },
    })
    return () => st.kill()
  }, [triggerId])
}
