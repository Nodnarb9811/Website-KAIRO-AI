import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
  DepthOfField,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { CONFIG, scroll, fx, clamp, smooth } from '../lib/state'

export function Effects() {
  const bloom = useRef<any>(null)
  const ca = useRef<any>(null)

  useFrame(() => {
    const p = scroll.progress
    const warp = smooth(clamp((p - 0.12) / 0.18))
    const gold = smooth(clamp((p - 0.16) / 0.5))
    if (bloom.current) bloom.current.intensity = 0.5 + gold * 0.9 + fx.seize * 1.2
    if (ca.current?.offset) {
      const amt = 0.0005 + warp * 0.002 + fx.seize * 0.005
      ca.current.offset.set(amt, amt)
    }
  })

  return (
    <EffectComposer multisampling={CONFIG.dof ? 2 : 0}>
      <Bloom ref={bloom} intensity={0.6} luminanceThreshold={0.6} luminanceSmoothing={0.4} mipmapBlur />
      {CONFIG.dof ? (
        <DepthOfField focusDistance={0.012} focalLength={0.04} bokehScale={3} height={480} />
      ) : (
        <></>
      )}
      <ChromaticAberration
        ref={ca}
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0005, 0.0005)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.25} darkness={0.85} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.18} />
    </EffectComposer>
  )
}
