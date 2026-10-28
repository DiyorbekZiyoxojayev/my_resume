export function initCounters() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const counters = [...document.querySelectorAll('[data-count]')];
  const start = performance.now();
  const duration = 1150;
  function draw(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - progress) ** 3;
    for (const counter of counters) {
      counter.textContent = Math.round(Number(counter.dataset.count) * eased) + (counter.dataset.suffix || '');
    }
    if (progress < 1) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
