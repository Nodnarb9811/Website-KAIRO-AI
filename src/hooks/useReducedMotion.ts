import { useEffect, useState } from "react";

/**
 * Tracks `prefers-reduced-motion`. Everything that lerps, lags, staggers, or
 * turntables must read this and degrade to a static reveal when true.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
