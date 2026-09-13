import { safeStorage } from './storage.js';
export function initTheme() {
  const root = document.documentElement;
  const saved = safeStorage.get('atlas_theme', 'dark');
  root.setAttribute('data-theme', saved === 'light' ? 'light' : 'dark');
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const updateLabel = () => {
    const light = root.getAttribute('data-theme') === 'light';
    btn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    btn.title = light ? 'Switch to dark mode' : 'Switch to light mode';
    btn.innerHTML = `<span class="control-icon" aria-hidden="true">${light ? '&#9728;' : '&#9789;'}</span><span class="control-label">${light ? 'Light' : 'Dark'}</span>`;
  };
  updateLabel();
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next); safeStorage.set('atlas_theme', next); updateLabel();
  });
}
