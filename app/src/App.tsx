import { useReducedMotion } from './hooks/useReducedMotion'
import { useScrollProgress } from './hooks/useScrollProgress'
import { Experience } from './three/Experience'
import { Preloader } from './components/Preloader'
import { Chrome } from './components/Chrome'
import { ActText } from './components/ActText'
import { Forelock } from './components/Forelock'
import { Editorial } from './components/Editorial'
import { Fallback } from './components/Fallback'

export default function App() {
  const reduced = useReducedMotion()
  if (reduced) return <Fallback />
  return <Cinematic />
}

function Cinematic() {
  // single scroll → progress driver for the entire 3D timeline
  useScrollProgress('cinematic')
  return (
    <>
      <Preloader />
      <Experience />
      <Chrome />
      <ActText />
      <Forelock />
      {/* tall transparent spacer that the camera timeline is mapped onto */}
      <div id="cinematic" className="relative z-[1] pointer-events-none" style={{ height: '640vh' }} />
      <Editorial />
    </>
  )
}
