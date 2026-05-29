import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { particleVertex, particleFragment } from '../shaders/particles'
import { CONFIG, scroll, fx, useStore, clamp, smooth } from '../lib/state'

const SPREAD_X = 26
const SPREAD_Y = 16
const DEPTH = 240

export function ParticleRiver() {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const { geometry, uniforms } = useMemo(() => {
    const N = CONFIG.particleCount
    const positions = new Float32Array(N * 3)
    const speeds = new Float32Array(N)
    const seeds = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      positions[i * 3 + 0] = (Math.random() * 2 - 1) * SPREAD_X
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * SPREAD_Y
      positions[i * 3 + 2] = Math.random() * DEPTH - DEPTH * 0.5
      speeds[i] = 0.5 + Math.random() * 1.4
      seeds[i] = Math.random()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

    const u = {
      uTime: { value: 0 },
      uWarp: { value: 0 },
      uFlow: { value: 0 },
      uGoldMix: { value: 0 },
      uSeize: { value: 0 },
      uSeizeT: { value: 0 },
      uDim: { value: 1 },
      uSize: { value: CONFIG.particleCount > 60000 ? 18.0 : 13.0 },
      uPixelRatio: { value: CONFIG.pixelRatio },
      uDepth: { value: DEPTH },
      uColChronos: { value: new THREE.Color('#8a96a3') },
      uColGold: { value: new THREE.Color('#c9a24b') },
      uColGoldHi: { value: new THREE.Color('#e8d39a') },
      uLightPos: { value: new THREE.Vector3(0, 1.5, -8) },
    }
    return { geometry: g, uniforms: u }
  }, [])

  useFrame((_, dt) => {
    const u = matRef.current.uniforms
    const p = scroll.progress
    const seized = useStore.getState().seized
    u.uTime.value += dt
    u.uWarp.value = smooth(clamp((p - 0.12) / 0.18))
    u.uFlow.value = smooth(clamp((p - 0.3) / 0.42))
    const gold = smooth(clamp((p - 0.16) / (seized ? 0.4 : 0.5))) * (seized ? 1.0 : 0.55)
    u.uGoldMix.value = gold
    // decay the shockwave
    if (fx.seize > 0.001) {
      fx.seizeT += dt
      fx.seize = Math.max(0, fx.seize - dt / 2.4)
    }
    u.uSeize.value = fx.seize
    u.uSeizeT.value = fx.seizeT
    // dim the time-stream to a calm ember as the editorial takes over (gutters beside text)
    u.uDim.value = THREE.MathUtils.lerp(1, CONFIG.editorialStream, smooth(clamp((p - 0.85) / 0.13)))
  })

  return (
    <points frustumCulled={false} geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
