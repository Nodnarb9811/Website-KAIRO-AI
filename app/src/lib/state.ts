import { create } from 'zustand'

export const isMobile =
  typeof navigator !== 'undefined' &&
  (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 720)

export const CONFIG = {
  particleCount: isMobile ? 38000 : 120000,
  pixelRatio: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, isMobile ? 1.5 : 2),
  dof: !isMobile,
  windowMs: 2600, // how long the moment stays grabbable
  holdMs: 720, // how long you must hold to seize it
}

// Mutable, non-reactive scroll progress — read every frame without re-rendering React.
export const scroll = { progress: 0 }

// Non-reactive FX bus written by the interaction layer, read by the 3D layer each frame.
export const fx = {
  seize: 0, // 0..1 shockwave amplitude (set to 1 on a successful grab, decays)
  seizeT: 0, // seconds since the shockwave fired
}

// Figure control written by the forelock interaction, lerped by the figure each frame.
export const fig = {
  targetRotY: 0, // turn 180° (PI) on a miss to show the bald back of the head
  forelockOn: 1, // forelock glow gate
}

type Phase = 'idle' | 'open' | 'holding' | 'success' | 'missed'

interface Store {
  phase: Phase
  seized: boolean
  loaded: boolean
  setPhase: (p: Phase) => void
  setSeized: (s: boolean) => void
  setLoaded: (l: boolean) => void
}

export const useStore = create<Store>((set) => ({
  phase: 'idle',
  seized: false,
  loaded: false,
  setPhase: (phase) => set({ phase }),
  setSeized: (seized) => set({ seized }),
  setLoaded: (loaded) => set({ loaded }),
}))

export const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b)
export const smooth = (t: number) => t * t * (3 - 2 * t)
