import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

type LenisContextValue = {
  lenis: Lenis | null;
  /** Smooth-scroll to a selector or element (used by nav links). */
  scrollTo: (target: string | HTMLElement, offset?: number) => void;
  /** Loader gates scrolling until the reveal finishes. */
  start: () => void;
  stop: () => void;
};

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollTo: () => {},
  start: () => {},
  stop: () => {},
});

export const useLenis = () => useContext(LenisContext);

/**
 * Single source of scroll truth.
 *
 * Wiring (this is the whole game):
 *   1. Lenis runs the smooth scroll with a ~0.1 lerp.
 *   2. `lenis.on('scroll', ScrollTrigger.update)` — every scroll tick refreshes
 *      all ScrollTriggers so scrubs/pins read the smoothed position.
 *   3. We drive `lenis.raf(time)` from `gsap.ticker` and kill GSAP's lag
 *      smoothing, so GSAP and Lenis share ONE rAF loop (no double rAF jank).
 *
 * Reduced motion: Lenis is created with smoothing off, so the page scrolls
 * natively and ScrollTrigger still fires its (now non-lerped) reveals.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      lerp: reduced ? 1 : 0.1,
      smoothWheel: !reduced,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = instance;
    setLenis(instance);

    // 2 — keep ScrollTrigger in sync with the smoothed scroll position.
    instance.on("scroll", ScrollTrigger.update);

    // 3 — one shared ticker.
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [reduced]);

  const value: LenisContextValue = {
    lenis,
    scrollTo: (target, offset = 0) =>
      lenisRef.current?.scrollTo(target, {
        offset,
        duration: reduced ? 0 : 1.2,
      }),
    start: () => lenisRef.current?.start(),
    stop: () => lenisRef.current?.stop(),
  };

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}
