/* Global search: matches model names, descriptions, keywords AND concepts /
 * math topics / equations. Keyboard navigable with focus trap + Escape.
 */
import { MODELS } from './model-data.js';
import { CONCEPTS } from './concepts.js';

export function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  if (!searchBtn) return;

  // Build modal once
  const modal = document.createElement('div');
  modal.className = 'search-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="search-box">
      <input type="text" class="search-input" id="search-query"
             placeholder="Search models, concepts, math (e.g. gradient descent, entropy, margin)..."
             aria-label="Search models and concepts">
      <p class="search-hint">Try: "gradient descent", "entropy", "cross-entropy", "margin", "clustering"</p>
      <ul class="search-results" id="search-results-list" aria-live="polite"></ul>
      <p class="search-hint">↑↓ navigate · Enter open · Esc close</p>
    </div>`;
  document.body.appendChild(modal);

  const queryInput = modal.querySelector('#search-query');
  const resultsList = modal.querySelector('#search-results-list');
  let selectedIndex = -1;

  function open() {
    modal.classList.add('active');
    queryInput.value = '';
    resultsList.innerHTML = '';
    selectedIndex = -1;
    setTimeout(() => queryInput.focus(), 10);
  }
  function close() {
    modal.classList.remove('active');
    searchBtn.focus();
  }

  searchBtn.addEventListener('click', open);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });

  queryInput.addEventListener('input', () => {
    const q = normalize(queryInput.value);
    render(q);
  });

  queryInput.addEventListener('keydown', (e) => {
    const items = resultsList.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      highlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      highlight(items);
    } else if (e.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) {
      e.preventDefault();
      items[selectedIndex].click();
    }
  });

  function highlight(items) {
    items.forEach((el, i) => el.classList.toggle('selected', i === selectedIndex));
    if (items[selectedIndex]) items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  function normalize(s) { return s.toLowerCase().trim(); }

  function render(q) {
    selectedIndex = -1;
    resultsList.innerHTML = '';
    if (!q) return;

    const modelHits = MODELS.filter((m) =>
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.problemType.toLowerCase().includes(q) ||
      (m.keywords || []).some((k) => k.toLowerCase().includes(q)) ||
      m.description.toLowerCase().includes(q)
    );
    const conceptHits = CONCEPTS.filter((c) =>
      c.term.toLowerCase().includes(q) || (c.models || []).some((mdl) => mdl.toLowerCase().includes(q))
    );

    if (!modelHits.length && !conceptHits.length) {
      resultsList.innerHTML = '<li class="search-empty">No results. Try "entropy", "gradient descent", "margin".</li>';
      return;
    }

    modelHits.forEach((m) => {
      const li = document.createElement('li');
      li.className = 'search-result-item';
      li.setAttribute('tabindex', '0');
      li.innerHTML = `<div><strong>${escapeHtml(m.name)}</strong>
        <div style="font-size:0.78rem; color:var(--text-muted)">${escapeHtml(m.problemType)} · ${escapeHtml(m.learningType)}</div></div>
        <span class="badge badge-neutral">Model</span>`;
      li.addEventListener('click', () => { window.location.href = prefix() + m.pagePath.replace(/^pages\//,''); });
      li.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.location.href = prefix() + m.pagePath.replace(/^pages\//,''); });
      resultsList.appendChild(li);
    });

    conceptHits.forEach((c) => {
      const li = document.createElement('li');
      li.className = 'search-result-item';
      li.setAttribute('tabindex', '0');
      li.innerHTML = `<div><strong>${escapeHtml(c.term)}</strong>
        <div style="font-size:0.78rem; color:var(--text-muted)">${escapeHtml(c.models.join(', '))}</div></div>
        <span class="tag">${escapeHtml(c.kind)}</span>`;
      li.addEventListener('click', () => { window.location.href = prefix() + c.url; });
      li.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.location.href = prefix() + c.url; });
      resultsList.appendChild(li);
    });
  }

  function prefix() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }
}

export default initSearch;