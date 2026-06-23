# KAIROS — The Forelock

> Kairos in myth has hair only at the front. Grab the forelock as he approaches
> — or he is gone, bald, ungraspable.

The signature move, made tactile. A gold strand drifts across a marble hero.
Your cursor has a **magnetic pull** within a radius — intercept the strand's
tip and the **KAIROS wordmark resolves**, gold blooms, and the doctrine lands.
Miss the window and the moment passes: the screen cools to grey and a quieter
line surfaces — _"The moment passed. They always do."_ — then it resets.

**Guardrail:** the headline is always readable. The catch is a reward layer,
never a gate.

## Stack

Vite · React + TypeScript · Tailwind CSS — drops straight into Lovable.

## Run

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # type-check + production build
```

## The piece

Everything lives in [`src/components/ForelockHero.tsx`](src/components/ForelockHero.tsx),
a single self-contained component (no extra runtime deps). It is driven by a
`requestAnimationFrame` loop so the strand, the magnetic bend, and the verdict
all run at frame rate without re-rendering React on every tick.

### Tunable props

| Prop            | Default | Meaning                                              |
| --------------- | ------- | ---------------------------------------------------- |
| `wordmark`      | KAIROS  | The always-readable headline.                        |
| `windowSeconds` | 5.5     | How long the forelock takes to sweep — the window.   |
| `magnetRadius`  | 190     | Cursor radius (px) where the strand bends toward you.|
| `catchRadius`   | 46      | Cursor radius (px) within which it is caught.        |
| `doctrineLine`  | …       | The line that lands on a catch.                      |
| `missLine`      | …       | The quieter line on a miss.                          |

```tsx
<ForelockHero windowSeconds={6} magnetRadius={210} />
```

Respects `prefers-reduced-motion` and supports pointer + touch.
