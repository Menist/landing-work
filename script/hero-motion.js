const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function initHeroMotion() {
  const hero = document.querySelector(".hero");

  if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const root = document.documentElement;
  let targetProgress = 0;
  let currentProgress = 0;
  let rafId = 0;

  root.classList.add("has-hero-motion");

  const updateTarget = () => {
    const rect = hero.getBoundingClientRect();
    const distance = Math.max(rect.height - window.innerHeight * 0.35, 1);
    targetProgress = clamp(-rect.top / distance, 0, 1);

    if (!rafId) {
      rafId = window.requestAnimationFrame(render);
    }
  };

  const render = () => {
    currentProgress += (targetProgress - currentProgress) * 0.12;

    if (Math.abs(targetProgress - currentProgress) < 0.001) {
      currentProgress = targetProgress;
    }

    hero.style.setProperty("--hero-bg-shift-y", `${(currentProgress * -24).toFixed(2)}px`);
    hero.style.setProperty("--hero-glow-shift-y", `${(currentProgress * -13).toFixed(2)}px`);
    hero.style.setProperty("--hero-overlay-shift-y", `${(currentProgress * -8).toFixed(2)}px`);
    hero.style.setProperty("--hero-content-shift-y", `${(currentProgress * -10).toFixed(2)}px`);
    hero.style.setProperty("--hero-copy-shift-y", `${(currentProgress * -6.5).toFixed(2)}px`);
    hero.style.setProperty("--hero-spotlight-shift-y", `${(currentProgress * -15).toFixed(2)}px`);
    hero.style.setProperty("--hero-overlay-opacity", (1 - currentProgress * 0.045).toFixed(3));
    hero.style.setProperty("--hero-spotlight-opacity", (1 - currentProgress * 0.035).toFixed(3));

    if (Math.abs(targetProgress - currentProgress) >= 0.001) {
      rafId = window.requestAnimationFrame(render);
      return;
    }

    rafId = 0;
  };

  window.addEventListener("scroll", updateTarget, { passive: true });
  window.addEventListener("resize", updateTarget, { passive: true });

  updateTarget();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroMotion, { once: true });
} else {
  initHeroMotion();
}
