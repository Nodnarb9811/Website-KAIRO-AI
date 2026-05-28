import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { marbleVertex, marbleFragment } from '../shaders/marble'
import { scroll, fig, fx, useStore, clamp, smooth } from '../lib/state'

export function KairosFigure() {
  const group = useRef<THREE.Group>(null!)
  const ball = useRef<THREE.Mesh>(null!)
  const scales = useRef<THREE.Group>(null!)
  const forelock = useRef<THREE.Mesh>(null!)
  const forelockLight = useRef<THREE.PointLight>(null!)

  const marble = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        vertexShader: marbleVertex,
        fragmentShader: marbleFragment,
        uniforms: {
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uGoldMix: { value: 0 },
          uKeyDir: { value: new THREE.Vector3(0.6, 0.8, 0.4).normalize() },
          uColCool: { value: new THREE.Color('#cdd4dc') },
          uColWarm: { value: new THREE.Color('#f1e9d6') },
          uColVein: { value: new THREE.Color('#6b7480') },
          uColGold: { value: new THREE.Color('#e8d39a') },
        },
      }),
    [],
  )

  const torsoGeo = useMemo(() => {
    const pts: [number, number][] = [
      [0.02, 0.0], [0.55, 0.05], [0.78, 0.45], [0.62, 1.1], [0.92, 1.7],
      [0.86, 2.35], [0.5, 2.7], [0.46, 3.0], [0.0, 3.05],
    ]
    const profile = pts.map(([x, y]) => new THREE.Vector2(x * 1.35, y * 1.05))
    const g = new THREE.LatheGeometry(profile, 64)
    g.computeVertexNormals()
    return g
  }, [])

  const goldRingMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#e8d39a', transparent: true, opacity: 0 }),
    [],
  )
  const forelockMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#e8d39a', transparent: true, opacity: 0 }),
    [],
  )

  useFrame((_, dt) => {
    const p = scroll.progress
    const t = (marble.uniforms.uTime.value += dt)
    const seized = useStore.getState().seized

    const reveal = smooth(clamp((p - 0.28) / 0.12)) * (1 - smooth(clamp((p - 0.86) / 0.1)))
    const gold = smooth(clamp((p - 0.16) / (seized ? 0.4 : 0.5))) * (seized ? 1.0 : 0.55)
    marble.uniforms.uReveal.value = reveal
    marble.uniforms.uGoldMix.value = gold
    goldRingMat.opacity = reveal * 0.9

    // life
    if (ball.current) {
      ball.current.rotation.y += dt * 0.15
      ball.current.rotation.x = Math.sin(t * 0.2) * 0.1
    }
    if (scales.current) scales.current.rotation.z = Math.sin(t * 0.4) * 0.06

    // turn on miss / back on reset
    group.current.rotation.y += (fig.targetRotY - group.current.rotation.y) * 0.06
    if (fig.targetRotY === 0) group.current.position.y = 1.2 + Math.sin(t * 0.5) * 0.08

    // forelock glow — pulses as we approach, off when grabbed or turned away
    const approach = clamp((p - 0.46) / 0.09) * (1 - clamp((p - 0.62) / 0.05))
    const glow = seized ? 0 : approach * fig.forelockOn * (0.7 + 0.3 * Math.sin(t * 6))
    forelockMat.opacity = glow
    if (forelockLight.current) forelockLight.current.intensity = glow * 3.0
  })

  return (
    <group ref={group} position={[0, 1.2, -8]}>
      {/* torso / bust */}
      <mesh geometry={torsoGeo} material={marble} position={[0, 0.2, 0]} />
      {/* head */}
      <mesh material={marble} position={[0, 3.55, 0]} scale={[1, 1.12, 1]}>
        <sphereGeometry args={[0.62, 48, 48]} />
      </mesh>
      {/* wing */}
      <mesh material={marble} position={[-1.1, 2.2, -0.3]} rotation={[0.3, 0.2, 2.4]} scale={[1, 1.6, 0.18]}>
        <torusGeometry args={[1.5, 0.5, 16, 60, Math.PI * 1.1]} />
      </mesh>
      {/* blade */}
      <mesh material={marble} position={[0, -1.0, 0]}>
        <boxGeometry args={[0.05, 2.0, 0.7]} />
      </mesh>
      {/* rolling sphere */}
      <mesh ref={ball} material={marble} position={[0, -2.8, 0]}>
        <sphereGeometry args={[1.6, 48, 48]} />
      </mesh>

      {/* scales — the myth's balance */}
      <group ref={scales} position={[0, 2.4, 0.9]}>
        <mesh material={goldRingMat} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 2.4, 8]} />
        </mesh>
        <mesh material={goldRingMat} position={[-1.2, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.012, 8, 40]} />
        </mesh>
        <mesh material={goldRingMat} position={[1.2, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.012, 8, 40]} />
        </mesh>
      </group>

      {/* forelock — the single glowing lock */}
      <mesh ref={forelock} material={forelockMat} position={[0, 3.95, 0.5]}>
        <sphereGeometry args={[0.16, 24, 24]} />
      </mesh>
      <pointLight ref={forelockLight} position={[0, 3.95, 0.5]} color="#e8d39a" intensity={0} distance={8} />
    </group>
  )
}
