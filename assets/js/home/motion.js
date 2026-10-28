export function initMotion() {
  const machine = document.querySelector('.portfolio-machine');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  if (!machine) return;
  let frame;
  machine.addEventListener('pointermove', (event) => {
    if (reduced.matches || !pointer.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = machine.getBoundingClientRect();
      machine.style.setProperty('--light-x', `${(event.clientX - box.left) / box.width * 100}%`);
      machine.style.setProperty('--light-y', `${(event.clientY - box.top) / box.height * 100}%`);
    });
  }, { passive: true });
}
