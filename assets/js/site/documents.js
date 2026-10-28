export function initDocuments() {
  const dialog = document.querySelector('.document-dialog');
  const body = dialog?.querySelector('[data-document-body]');
  if (!dialog || !body) return;
  let opener;
  document.querySelectorAll('[data-doc]').forEach(card => card.addEventListener('click', () => {
    const file = card.dataset.doc;
    if (!file) return;
    opener = card;
    const title = card.querySelector('h3')?.textContent || 'Certificate';
    dialog.querySelector('#document-title').textContent = title;
    dialog.querySelector('[data-document-open]').href = file;
    dialog.querySelector('[data-document-download]').href = file;
    const preview = document.createElement(card.dataset.docKind === 'image' ? 'img' : 'iframe');
    preview.src = card.dataset.docKind === 'image' ? file : `${file}#view=FitH`;
    if (preview.tagName === 'IMG') preview.alt = title;
    else preview.title = title;
    preview.addEventListener('error', () => {
      const text = document.createElement('p');
      text.className = 'document-error';
      text.textContent = 'Preview unavailable. Open or download the file below.';
      body.replaceChildren(text);
    });
    body.replaceChildren(preview);
    document.body.classList.add('document-open');
    dialog.showModal();
    document.dispatchEvent(new Event('documentpreviewchange'));
    dialog.querySelector('[data-document-close]').focus();
  }));
  dialog.querySelector('[data-document-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    body.replaceChildren();
    document.body.classList.remove('document-open');
    document.dispatchEvent(new Event('documentpreviewchange'));
    opener?.focus();
  });
}
