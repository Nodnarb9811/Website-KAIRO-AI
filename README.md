# Kairo AI — Landing Page

A modern, dark, single-page marketing site for **Kairo AI**, an (illustrative)
agentic-intelligence product for teams. Built as a self-contained static site —
no build step, no dependencies.

> Design is an original interpretation inspired by sleek modern AI-startup
> aesthetics (bold display type, dark canvas, gradient accents, smooth scroll
> reveals). All copy and branding are original.

## Stack

- Plain **HTML / CSS / JavaScript** — zero dependencies
- Google Fonts: *Space Grotesk* (display) + *Inter* (body)
- Vanilla JS for scroll reveals, animated counters, sticky nav, mobile menu

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup and all sections |
| `styles.css` | Design system + layout + responsive rules |
| `script.js` | Scroll reveal, stat counters, nav, demo form |

## Run locally

It's a static site — just open `index.html`, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Sections

Hero · social proof · features · workflow · stats · pricing · CTA · footer.

The CTA form is front-end only (no backend wired up).
