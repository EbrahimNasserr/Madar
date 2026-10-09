import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

/**
 * Smooth-scroll to a CSS selector (e.g. "#features").
 * Uses the Lenis instance when available, falls back to native scroll.
 * The offset accounts for the sticky navbar height (72px).
 */
export function scrollToSection(target: string, offset = -72) {
  const el = document.querySelector(target) as HTMLElement | null;
  if (!el) return;

  if (instance) {
    instance.scrollTo(el, { offset });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
