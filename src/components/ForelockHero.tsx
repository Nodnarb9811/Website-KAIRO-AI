import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ForelockHero — "The Forelock"
 * --------------------------------------------------------------------------
 * Kairos in myth has hair only at the front. Grab the forelock as he
 * approaches or he is gone — bald, ungraspable.
 *
 * A gold strand drifts across the marble hero. The cursor exerts a magnetic
 * pull within a radius; intercept the strand's tip and the KAIROS wordmark
 * resolves, gold blooms, the doctrine lands. Miss the window and it passes,
 * the screen cools to grey, and a quieter line surfaces — then it resets.
 *
 * Guardrail: the headline is ALWAYS readable. The catch is a reward layer,
 * never a gate.
 */

type Phase = "drifting" | "caught" | "missed";

interface ForelockHeroProps {
  /** Wordmark rendered as the always-readable headline. */
  wordmark?: string;
  /** Doctrine line shown the moment the forelock is caught. */
  doctrineLine?: string;
  /** Sub-line beneath the doctrine on a successful catch. */
  doctrineSub?: string;
  /** The quieter line that surfaces on a miss. */
  missLine?: string;
  /** Hint shown while the moment is still in play. */
  hintLine?: string;
  /** Seconds the forelock takes to sweep across — the catch window. */
  windowSeconds?: number;
  /** Cursor radius (px) at which the strand starts bending toward you. */
  magnetRadius?: number;
  /** Cursor radius (px) within which the forelock is caught. */
  catchRadius?: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function ForelockHero({
  wordmark = "KAIROS",
  doctrineLine = "Opportunity has a forelock. You seized it.",
  doctrineSub = "Kairos — the supreme moment. Act, and it is yours.",
  missLine = "The moment passed. They always do.",
  hintLine = "Catch the strand.",
  windowSeconds = 5.5,
  magnetRadius = 190,
  catchRadius = 46,
}: ForelockHeroProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Live interaction state lives in refs so the rAF loop never re-renders.
  const sizeRef = useRef({ w: 1200, h: 800 });
  const pointerRef = useRef({ x: -9999, y: -9999, inside: false });
  const startRef = useRef<number>(performance.now());
  const phaseRef = useRef<Phase>("drifting");
  const rafRef = useRef<number>(0);
  const reducedRef = useRef(false);

  // Rendered geometry — committed to state at most ~60fps via the loop.
  const [path, setPath] = useState("");
  const [tip, setTip] = useState({ x: -9999, y: -9999, glow: 0, near: 0 });
  const [phase, setPhase] = useState<Phase>("drifting");
  const [progress, setProgress] = useState(0); // 0..1 sweep position

  const rearm = useCallback(() => {
    phaseRef.current = "drifting";
    startRef.current = performance.now();
    setPhase("drifting");
  }, []);

  // Measure container + honor reduced motion.
  useEffect(() => {
    const measure = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      sizeRef.current = { w: r.width, h: r.height };
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onMq = () => (reducedRef.current = mq.matches);
    mq.addEventListener?.("change", onMq);

    return () => {
      ro.disconnect();
      mq.removeEventListener?.("change", onMq);
    };
  }, []);

  // Pointer tracking (mouse + touch), in element-local coordinates.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const toLocal = (cx: number, cy: number) => {
      const r = el.getBoundingClientRect();
      pointerRef.current = { x: cx - r.left, y: cy - r.top, inside: true };
    };
    const onMove = (e: PointerEvent) => toLocal(e.clientX, e.clientY);
    const onLeave = () => (pointerRef.current.inside = false);

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // The animation loop — drives the drift, the magnetic bend, and the verdict.
  useEffect(() => {
    const tick = (now: number) => {
      const { w, h } = sizeRef.current;
      const { x: px, y: py, inside } = pointerRef.current;
      const phaseNow = phaseRef.current;
      const dur = windowSeconds * 1000;

      // Sweep progress 0..1 across the window (only advances while drifting).
      let t = 0;
      if (phaseNow === "drifting") {
        t = clamp((now - startRef.current) / dur, 0, 1);
      } else if (phaseNow === "caught") {
        t = 1; // frozen where it was grabbed
      }

      // Baseline path of the forelock as it travels left -> right, riding a
      // gentle wave across the marble. The "tip" is the graspable end.
      const margin = Math.min(120, w * 0.12);
      const travel = lerp(-margin, w + margin, easeInOut(t));
      const baseY = h * 0.46 + Math.sin(now / 900) * (h * 0.05);

      // Tip baseline (the catchable point trails the leading edge slightly).
      let tipX = travel;
      let tipY = baseY + Math.sin(now / 520 + 1.3) * (h * 0.035);

      // Magnetic pull: when the cursor is within radius, the tip eases toward
      // it — the strand "wants" to be caught.
      let near = 0;
      let caughtNow = false;
      if (inside && (phaseNow === "drifting" || phaseNow === "caught")) {
        const dx = px - tipX;
        const dy = py - tipY;
        const dist = Math.hypot(dx, dy);
        if (dist < magnetRadius) {
          near = 1 - dist / magnetRadius; // 0..1 closeness
          const pull = easeInOut(near) * (phaseNow === "caught" ? 1 : 0.85);
          tipX = lerp(tipX, px, pull);
          tipY = lerp(tipY, py, pull);
          if (dist < catchRadius && phaseNow === "drifting") caughtNow = true;
        }
      }

      // Phase transitions.
      if (caughtNow && phaseNow === "drifting") {
        phaseRef.current = "caught";
        setPhase("caught");
      } else if (phaseNow === "drifting" && t >= 1) {
        phaseRef.current = "missed";
        setPhase("missed");
        window.setTimeout(() => {
          if (phaseRef.current === "missed") rearm();
        }, 2600);
      }

      // Build the strand: a flowing cubic bezier anchored off the top-left,
      // curling down to the tip. The leading control point bends toward the
      // cursor for that "reaching" feel.
      const ax = tipX - Math.max(220, w * 0.26);
      const ay = h * 0.16 + Math.sin(now / 1100) * (h * 0.03);
      const c1x = lerp(ax, tipX, 0.35) + Math.sin(now / 700) * 26;
      const c1y = lerp(ay, tipY, 0.2) - h * 0.06;
      const c2x = lerp(ax, tipX, 0.72) + near * (px - tipX) * 0.12;
      const c2y = lerp(ay, tipY, 0.85) + near * (py - tipY) * 0.12;
      const d = `M ${ax.toFixed(1)} ${ay.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${tipX.toFixed(1)} ${tipY.toFixed(1)}`;

      const glow = phaseNow === "caught" ? 1 : near;

      setPath(d);
      setTip({ x: tipX, y: tipY, glow, near });
      setProgress(t);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [windowSeconds, magnetRadius, catchRadius, rearm]);

  const caught = phase === "caught";
  const missed = phase === "missed";
  // The window is "closing" — used to warm the strand with urgency near the end.
  const urgency = phase === "drifting" ? clamp((progress - 0.55) / 0.45, 0, 1) : 0;

  return (
    <section
      ref={wrapRef}
      onPointerDown={() => {
        if (missed) rearm();
      }}
      className={[
        "relative isolate flex min-h-screen w-full select-none items-center justify-center overflow-hidden",
        "transition-[filter,background-color] duration-[1400ms] ease-out",
        missed ? "grayscale" : "",
      ].join(" ")}
      style={{
        cursor: tip.near > 0.15 && !missed ? "grab" : "default",
        backgroundColor: missed ? "#0b0b0d" : "#0a0a0c",
      }}
      aria-label="Kairos — the opportune moment"
    >
      {/* Marble field ---------------------------------------------------- */}
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 18%, #1c1c22 0%, #131318 45%, #08080b 100%)",
        }}
      />
      {/* Faint marble veining */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0) 2px, rgba(255,255,255,0) 9px), repeating-linear-gradient(28deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0) 3px, rgba(255,255,255,0) 14px)",
        }}
      />
      {/* Gold bloom that swells on a catch */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-[1200ms] ease-out"
        style={{
          opacity: caught ? 1 : 0,
          background:
            "radial-gradient(60% 50% at 50% 52%, rgba(212,175,55,0.30) 0%, rgba(212,175,55,0.10) 35%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* The forelock (SVG strand + tip) --------------------------------- */}
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 -z-0 h-full w-full"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="goldStrand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9a7a22" stopOpacity="0" />
            <stop offset="35%" stopColor="#d9b94e" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#f6e7a8" />
            <stop offset="100%" stopColor="#fff7df" />
          </linearGradient>
          <filter id="strandGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={4 + tip.glow * 8} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft underlay for the strand's halo */}
        <path
          d={path}
          fill="none"
          stroke="url(#goldStrand)"
          strokeWidth={10 + tip.glow * 14}
          strokeLinecap="round"
          opacity={missed ? 0 : 0.22 + tip.glow * 0.4}
          style={{ filter: "blur(6px)", transition: "opacity 600ms ease" }}
        />
        {/* The strand itself */}
        <path
          d={path}
          fill="none"
          stroke="url(#goldStrand)"
          strokeWidth={2.4 + tip.glow * 2.2 + urgency * 0.8}
          strokeLinecap="round"
          filter="url(#strandGlow)"
          opacity={missed ? 0 : 1}
          style={{ transition: "opacity 600ms ease" }}
        />
        {/* The graspable tip */}
        <g
          opacity={missed ? 0 : 1}
          style={{ transition: "opacity 500ms ease" }}
          filter="url(#strandGlow)"
        >
          <circle
            cx={tip.x}
            cy={tip.y}
            r={6 + tip.glow * 9}
            fill="#fff7df"
          />
          {/* Magnetic-pull ring — appears only when you're close */}
          <circle
            cx={tip.x}
            cy={tip.y}
            r={catchRadius + 10 + (1 - tip.near) * 24}
            fill="none"
            stroke="#f6e7a8"
            strokeWidth={1.2}
            opacity={tip.near * 0.7 * (caught ? 0 : 1)}
          />
        </g>
      </svg>

      {/* Headline + doctrine — ALWAYS readable ---------------------------- */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h1
          className="font-serif tracking-[0.18em] leading-none transition-[color,text-shadow] duration-[1100ms] ease-out"
          style={{
            fontSize: "clamp(3.5rem, 16vw, 13rem)",
            color: caught ? "#f6e7a8" : missed ? "#6b6b73" : "#e9e6dd",
            textShadow: caught
              ? "0 0 38px rgba(212,175,55,0.55), 0 0 6px rgba(255,247,223,0.6)"
              : "0 2px 30px rgba(0,0,0,0.6)",
          }}
        >
          {wordmark}
        </h1>

        {/* Reserved space so layout never jumps between states */}
        <div className="mt-7 flex min-h-[5.5rem] max-w-2xl flex-col items-center justify-start">
          {/* Caught */}
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: caught ? 1 : 0,
              transform: caught ? "translateY(0)" : "translateY(8px)",
              position: caught ? "relative" : "absolute",
              pointerEvents: caught ? "auto" : "none",
            }}
          >
            <p className="font-serif text-xl text-amber-200/95 sm:text-2xl">
              {doctrineLine}
            </p>
            <p className="mt-2 text-sm tracking-wide text-amber-100/55 sm:text-base">
              {doctrineSub}
            </p>
            <button
              onClick={rearm}
              className="mt-5 rounded-full border border-amber-300/30 px-5 py-2 text-xs uppercase tracking-[0.25em] text-amber-100/70 transition-colors hover:border-amber-300/70 hover:text-amber-100"
            >
              Let it pass again
            </button>
          </div>

          {/* Missed */}
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: missed ? 1 : 0,
              transform: missed ? "translateY(0)" : "translateY(8px)",
              position: missed ? "relative" : "absolute",
            }}
          >
            <p className="font-serif text-xl italic text-neutral-400 sm:text-2xl">
              {missLine}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-neutral-600">
              click anywhere — it returns
            </p>
          </div>

          {/* Drifting hint */}
          <div
            className="transition-opacity duration-500"
            style={{
              opacity: phase === "drifting" ? 0.6 - urgency * 0.1 : 0,
              position: phase === "drifting" ? "relative" : "absolute",
            }}
          >
            <p className="text-xs uppercase tracking-[0.34em] text-neutral-400">
              {hintLine}
            </p>
          </div>
        </div>
      </div>

      {/* The closing window — a thin gold meter draining as the moment ends */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[2px] w-full bg-white/5">
        <div
          className="h-full origin-left"
          style={{
            transform: `scaleX(${phase === "drifting" ? 1 - progress : caught ? 1 : 0})`,
            background:
              "linear-gradient(90deg, rgba(212,175,55,0.2), #f6e7a8)",
            opacity: missed ? 0 : 1,
            transition: caught ? "transform 700ms ease" : "none",
          }}
        />
      </div>
    </section>
  );
}
