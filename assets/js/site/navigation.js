export function initNavigation() {
  // Re-align direct links after fonts and hero artwork finish sizing the page.
  // A visitor who already starts navigating keeps control of the viewport.
  const initialHash = location.hash;
  let interacted = false;
  const markInteraction = () => { interacted = true; };
  for (const event of ['pointerdown', 'wheel', 'touchstart', 'keydown']) {
    window.addEventListener(event, markInteraction, { once: true, passive: true });
  }
  async function alignInitialSection() {
    await document.fonts.ready;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!interacted && initialHash && location.hash === initialHash) {
        document.getElementById(initialHash.slice(1))?.scrollIntoView({ behavior: 'instant' });
      }
    }));
  }
  if (document.readyState === 'complete') alignInitialSection();
  else window.addEventListener('load', alignInitialSection, { once: true });
  const toggle = document.querySelector('.navigation-toggle');
  const links = document.querySelector('.section-links');
  if (!toggle || !links) return;
  function close() { links.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && links.classList.contains('is-open')) { close(); toggle.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-navigation')) close(); });
  matchMedia('(min-width: 901px)').addEventListener('change', close);
  const sections = [...document.querySelectorAll('#home, .section[id]')];
  const anchors = [...links.querySelectorAll('a')];
  let scheduled = false;
  function paint() {
    scheduled = false;
    const probe = Math.min(innerHeight * .35, 240);
    let active = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= probe) active = section;
    for (const anchor of anchors) {
      if (anchor.hash === `#${active.id}`) anchor.setAttribute('aria-current', 'location');
      else anchor.removeAttribute('aria-current');
    }
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(paint); }
  }, { passive: true });
  window.addEventListener('resize', paint);
  paint();
}
