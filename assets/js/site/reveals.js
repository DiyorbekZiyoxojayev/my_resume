export function initReveals() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  }, { threshold: .06, rootMargin: '0px 0px 30px 0px' });
  document.querySelectorAll('.section .panel').forEach(panel => {
    panel.classList.add('reveal-pending');
    observer.observe(panel);
  });
}
