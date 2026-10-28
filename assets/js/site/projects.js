export function initProjects() {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.project-card[data-category]')];
  const output = document.querySelector('[data-filter-results]');
  let active = 'all';
  function render() {
    let count = 0;
    for (const card of cards) {
      card.hidden = active !== 'all' && card.dataset.category !== active;
      if (!card.hidden) count++;
    }
    for (const button of buttons) {
      const selected = button.dataset.filter === active;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    }
    if (output) output.textContent = `${count} projects and publications`;
  }
  for (const button of buttons) button.addEventListener('click', () => { active = button.dataset.filter; render(); });
  render();
}
