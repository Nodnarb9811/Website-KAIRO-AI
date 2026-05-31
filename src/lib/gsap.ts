import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once, import this module wherever GSAP/ScrollTrigger is needed.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
