import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { CONFIG, isMobile } from '../lib/state'
import { CameraRig } from './CameraRig'
import { ParticleRiver } from './ParticleRiver'
import { KairosFigure } from './KairosFigure'
import { Effects } from './Effects'

export function Experience() {
  return (
    <Canvas
      id="r3f-canvas"
      dpr={CONFIG.pixelRatio}
      gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 42], fov: 60, near: 0.1, far: 600 }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color('#0a0b0d'), 1)
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        scene.fog = new THREE.FogExp2(new THREE.Color('#0a0b0d'), 0.012)
      }}
    >
      <CameraRig />
      <ParticleRiver />
      <KairosFigure />
      <Effects />
    </Canvas>
  )
}
