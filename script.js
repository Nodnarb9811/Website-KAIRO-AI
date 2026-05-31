// Sticky nav background on scroll
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") navLinks.classList.remove("open");
});

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`;
  io.observe(el);
});

// Animated stat counters
const statNums = document.querySelectorAll(".stat-num");
const statIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      statIO.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
statNums.forEach((el) => statIO.observe(el));

// CTA form (demo only — no backend)
const form = document.getElementById("ctaForm");
const note = document.getElementById("ctaNote");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = form.querySelector("input").value.trim();
  if (email) {
    note.textContent = `Thanks — we'll reach out to ${email} soon. ✦`;
    form.reset();
  }
});
