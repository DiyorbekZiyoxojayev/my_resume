export function initClipboard() {
  const status = document.querySelector('[data-copy-status]');
  if (!status) return;
  let timer;
  document.querySelectorAll('[data-copy], [data-copy-email]').forEach(button => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy || 'diyorbekziyoxojayev@gmail.com';
      let message;
      try {
        await navigator.clipboard.writeText(value);
        message = 'Copied to clipboard';
      } catch { message = `Copy: ${value}`; }
      status.textContent = message;
      status.classList.add('is-visible');
      clearTimeout(timer);
      timer = setTimeout(() => status.classList.remove('is-visible'), 3500);
    });
  });
}
