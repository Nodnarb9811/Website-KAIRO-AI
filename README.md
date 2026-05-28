# Kairos AI — "The Moment"

A cinematic, scroll-driven, immersive 3D journey for an AI implementation consultancy.

> **"I don't consult. I operate."**

The site is a *journey*, not a webpage: one continuous camera moves through six acts that
dramatise the myth of **Kairos** (the seized, opportune moment) against **Chronos** (cold,
linear time). Cold blue-grey marble dust resolves into living gold.

---

## Deliverables

| # | Path | What it is |
|---|------|-----------|
| 1 | [`index.html`](./index.html) | **Self-contained preview.** Single file, CDN imports (Three.js + GSAP). Open in any browser — no build step. For fast iteration and sharing. |
| 2 | [`app/`](./app) | **Lovable-ready project.** React + Vite + TypeScript + Tailwind + React Three Fiber + `@react-three/postprocessing` + GSAP. Drop-in for a Vite/Tailwind workspace. |
| 3 | This file | Setup, the scroll→uniform wiring, and the tuning knobs. |

Both share the **same GLSL** (simplex/curl noise, particle transform, marble shader) so the
preview and the production app look identical.

---

## 1 · Self-contained preview

```bash
# no install needed — just serve the file (a server avoids module/CORS issues)
npx serve .
# then open the printed URL and load index.html
```

Or open `index.html` directly in a modern browser. It pulls Three.js `0.161` and GSAP `3.12`
from a CDN via an import map.

## 2 · Lovable / Vite app

```bash
cd app
npm install
npm run dev      # local dev server
npm run build    # type-check (tsc -b) + production build
npm run preview  # preview the production build
```

For Lovable: drop the contents of `app/` into the project root. The stack
(`react`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `gsap`,
`tailwindcss`, `three`) matches the dependencies in [`app/package.json`](./app/package.json).

> **Dependency note:** `postprocessing` is pinned to `~6.36.4` because newer 6.39+ requires
> `three >= 0.168`. If you bump `three`, bump `postprocessing` to match (`6.39.x` for `three` 0.168–0.184).

---

## The journey — six acts

| Act | Scroll | Beat |
|-----|--------|------|
| **I — Chronos** | 0–15% | A straight river of cold marble-dust particles streams toward the horizon. *"Most businesses live in Chronos."* |
| **II — The Threshold** | 15–30% | The streams begin to **warp**; a golden light ignites in the distance. *"Then there is the moment."* |
| **III — Kairos Emerges** | 30–55% | A procedural **marble figure** (torso, wing, blade, rolling sphere, gold scales) resolves; the camera orbits. The *kairos* dictionary definition frames it. |
| **IV — Seize the Forelock** | 55–68% | **Interactive beat.** The forelock glows; *press & hold* to seize the moment before the window closes. Success → time fractures into gold. Miss → the figure turns (bald back of the head), *"The moment doesn't wait. Try again."* |
| **V — Convergence** | 68–85% | Chronos and Kairos merge into a living gold flow-field. *"AI, operated at the right moment. I don't consult. I operate."* |
| **VI — The Operator's Domain** | 85–100% | The 3D recedes into a clean marble-paper editorial layout (services, philosophy, CTA). A rotating marble seal persists in the corner. |

---

## Architecture — how scroll drives everything

```
                       ┌────────────────────────────────────────────┐
  #cinematic (640vh)   │  GSAP ScrollTrigger (scrub)                 │
  tall transparent  →  │  onUpdate → progress (0..1)                 │
  spacer               └───────────────┬────────────────────────────┘
                                        │  (non-reactive ref: `scroll.progress`)
            ┌───────────────────────────┼───────────────────────────┐
            ▼                           ▼                           ▼
      CameraRig                   shader uniforms              DOM overlays
   (pos / lookAt / FOV       (uWarp, uFlow, uGoldMix,       (act text reveals,
    keyframes + parallax)     uSeize, uReveal …)             forelock, chrome)
```

A single normalized `progress` (0→1) is the only input. It is read **every frame** (never via
React state, to avoid re-renders) and mapped to:

### Scroll → uniform mapping

| Uniform | Mapping | Drives |
|---------|---------|--------|
| `uWarp` | `smoothstep(0.12, 0.30, p)` | Act II — particle lines bend via curl noise |
| `uFlow` | `smoothstep(0.30, 0.72, p)` | Act III–V — straight river → flow-field curves |
| `uGoldMix` | `smoothstep(0.16, 0.5, p)`, scaled by whether the moment was seized | Blue Chronos dust → living gold; marble warms |
| `uReveal` (marble) | `smoothstep(0.28, 0.40, p)` then fades out after `0.86` | Figure materialises / recedes |
| `uSeize` / `uSeizeT` | set to `1` / `0` on a **successful grab**, then decays over ~2.4 s | Radial shockwave that ignites the dust |

The camera path is a set of keyframes (`{p, pos, tgt, fov}`) interpolated with a smoothstep ease;
damped mouse-parallax is layered on top (`lerp` factor `0.05`).

- **Preview:** `index.html` → sections `6` (camera), `7` (ScrollTrigger), `12` (render loop).
- **App:** `src/three/CameraRig.tsx`, `src/hooks/useScrollProgress.ts`, `src/lib/state.ts`.

---

## The forelock interaction (the emotional centre)

A small state machine, identical in both builds:

```
idle ──(scroll enters 0.55–0.67)──▶ open ──(pointer down)──▶ holding
  ▲                                   │                          │
  │                                   │ window elapses           │ held long enough
  │                                   ▼                          ▼
  └────────── reset ◀── missed ◀──────┘                       success (seized = true)
```

- **`windowMs`** (default **2600 ms**) — how long the moment stays grabbable after it opens.
- **`holdMs`** (default **720 ms**) — how long you must *hold* to complete the seize.
- **Miss** turns the figure 180° (the bald back of the head — *nothing left to grab*), dims, and
  shows *"The moment doesn't wait. Try again,"* then re-opens. This failure state is the brand
  thesis made physical — it's meant to land, not punish.
- **Success** sets `seized = true`, fires the gold shockwave, and unlocks the full gold
  convergence in Act V.

Tune in:
- **Preview:** `CONFIG.windowMs` / `CONFIG.holdMs` (section `0`), state machine in section `9`.
- **App:** `CONFIG` in `src/lib/state.ts`, logic in `src/components/Forelock.tsx`.

---

## Tuning knobs

| Knob | Preview (`index.html`) | App (`app/`) |
|------|------------------------|--------------|
| **Particle count** | `CONFIG.particleCount` (section 0) — `120k` desktop / `38k` mobile | `CONFIG.particleCount` in `src/lib/state.ts` |
| **Pixel ratio / DOF** | `CONFIG.pixelRatio`, `CONFIG.dof` | same, in `state.ts` |
| **Grab timing** | `CONFIG.windowMs`, `CONFIG.holdMs` | same, in `state.ts` |
| **Camera path** | `KEYS[]` (section 6) | `KEYS[]` in `CameraRig.tsx` |
| **Palette** | `COL` (section 0) + CSS `:root` | shader uniform colors + `tailwind.config.js` + `index.css` |
| **Post FX** | `bloom` / `finalPass` uniforms (sections 5, 12) | `src/three/Effects.tsx` |

---

## Performance & accessibility

- **Capability scaling:** mobile / low-power detection drops particle count, disables
  depth-of-field, and lowers the pixel ratio.
- **`prefers-reduced-motion`:** both builds short-circuit to a static, still-beautiful hero (the
  *kairos* definition over a marble gradient) plus the full editorial — **no 3D, no animation**.
  - Preview: `body.reduced` CSS path + `#fallback`.
  - App: `useReducedMotion()` → `<Fallback />` in `src/App.tsx`.
- **Audio:** a low ambient drone, **off by default**, created only on first user toggle to respect
  autoplay policies. It swells briefly on a successful seize.
- **Preloader:** a single thin gold line draws across the screen with a percentage in IBM Plex
  Mono — no spinner.

---

## Art direction

- **Palette** — Chronos `#8a96a3` on near-black `#0a0b0d`; Kairos gold `#c9a24b → #e8d39a`;
  marble paper `#f4f0e8`, ink `#1a1815`. **Gold only earns its place after Act II.**
- **Type** — Cormorant Garamond (display, thin→regular), IBM Plex Mono (labels, eyebrows,
  definitions). Letter-by-letter reveals tied to scroll.
- **Light** — single warm key + cool fill; gallery-museum quality on the marble (fresnel rim +
  wrapped-diffuse fake subsurface + fbm veining).
- **Motion** — slow, weighted, eased. Nothing bounces. The camera has mass.

---

## Project layout (app)

```
app/
├─ index.html               # Vite entry (fonts)
├─ src/
│  ├─ main.tsx · App.tsx     # reduced-motion gate → Cinematic | Fallback
│  ├─ lib/state.ts           # CONFIG, scroll ref, FX bus, zustand store
│  ├─ hooks/                 # useScrollProgress, useReducedMotion
│  ├─ shaders/               # noise.ts, particles.ts, marble.ts (shared GLSL)
│  ├─ three/                 # Experience (Canvas), CameraRig, ParticleRiver,
│  │                         #   KairosFigure, Effects
│  └─ components/            # ActText, Forelock, Editorial, Preloader, Chrome, Fallback
└─ tailwind.config.js · vite.config.ts · tsconfig.json
```

---

## Note on verification

`app/` is type-checked and builds clean (`npm run build`). The live WebGL render was **not**
visually verified in CI (no browser available in the build container) — open `index.html` or run
`cd app && npm run dev` locally to view the experience and confirm shader compilation on your GPU.
