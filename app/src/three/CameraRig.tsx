import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { scroll, smooth, clamp } from '../lib/state'

type Key = { p: number; pos: [number, number, number]; tgt: [number, number, number]; fov: number }

const KEYS: Key[] = [
  { p: 0.0, pos: [0, 0, 44], tgt: [0, 0, -20], fov: 62 }, // Act I — drifting the river
  { p: 0.15, pos: [0, 1, 24], tgt: [0, 1, -12], fov: 56 }, // Act II — toward the light
  { p: 0.3, pos: [0, 2, 12], tgt: [0, 2.2, -8], fov: 50 }, // Act III — figure appears
  { p: 0.45, pos: [9, 2.6, 7], tgt: [0, 2.0, -8], fov: 46 }, // Act III — orbit
  { p: 0.55, pos: [0.5, 3.4, 5.5], tgt: [0, 3.8, -8], fov: 40 }, // Act IV — forelock close
  { p: 0.68, pos: [-9, 3, 9], tgt: [0, 2.0, -8], fov: 48 }, // Act V — convergence
  { p: 0.85, pos: [0, 1, 20], tgt: [0, 1, -8], fov: 55 }, // Act V/VI — pull back
  { p: 1.0, pos: [0, 0, 34], tgt: [0, 0, -10], fov: 60 }, // Act VI — recede to domain
]

const _pos = new THREE.Vector3()
const _tgt = new THREE.Vector3()

function sample(p: number) {
  let a = KEYS[0]
  let b = KEYS[KEYS.length - 1]
  for (let i = 0; i < KEYS.length - 1; i++) {
    if (p >= KEYS[i].p && p <= KEYS[i + 1].p) {
      a = KEYS[i]
      b = KEYS[i + 1]
      break
    }
  }
  const span = b.p - a.p || 1
  const t = smooth(clamp((p - a.p) / span))
  _pos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], t),
  )
  _tgt.set(
    THREE.MathUtils.lerp(a.tgt[0], b.tgt[0], t),
    THREE.MathUtils.lerp(a.tgt[1], b.tgt[1], t),
    THREE.MathUtils.lerp(a.tgt[2], b.tgt[2], t),
  )
  return THREE.MathUtils.lerp(a.fov, b.fov, t)
}

export function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  useFrame(() => {
    const fov = sample(scroll.progress)
    const m = mouse.current
    // pointer read from window (set in effect below)
    m.x += (m.tx - m.x) * 0.05
    m.y += (m.ty - m.y) * 0.05
    camera.position.copy(_pos)
    camera.position.x += m.x * 2.2
    camera.position.y += -m.y * 1.4
    camera.lookAt(_tgt.x + m.x * 0.6, _tgt.y - m.y * 0.4, _tgt.z)
    const cam = camera as THREE.PerspectiveCamera
    cam.fov += (fov - cam.fov) * 0.1
    cam.updateProjectionMatrix()
  })

  // damped mouse parallax
  if (typeof window !== 'undefined') {
    window.onpointermove = (e) => {
      mouse.current.tx = e.clientX / window.innerWidth - 0.5
      mouse.current.ty = e.clientY / window.innerHeight - 0.5
    }
  }

  return null
}
