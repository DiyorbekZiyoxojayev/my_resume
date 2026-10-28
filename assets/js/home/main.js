import { initMotion } from './motion.js';
import { initCounters } from './metrics.js';

export function initHome() {
  initMotion();
  initCounters();

  // Keep normal interactions independent of the 3D engine download.
  import('./justice-viewer.js').then(({ initJusticeViewer }) => initJusticeViewer()).catch(() => {
    const status = document.querySelector('[data-statue-status]');
    if (status) status.textContent = '3D view could not start';
    document.querySelector('.justice-stage')?.setAttribute('aria-busy', 'false');
  });
}
