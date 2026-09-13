/* ML ATLAS — central entry point.
 * Pages declare <body data-model="model-id"> (model pages) and/or host
 * containers: #model-sidebar, #prev-next, #model-toc, #dna-card,
 * #progress-wrap, #compass-root, #selector-root, #home-progress, #model-explorer.
 */
import { MODELS, MODEL_MAP, MODEL_GROUPS } from './model-data.js';
import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initSearch } from './search.js';
import { initProgress, renderProgressBar } from './progress.js';
import { initComparison } from './comparison.js';
import { initModelSelector } from './model-selector.js';
import { buildModelPage } from './model-page.js';
import { renderStaticVisual } from './static-visuals.js';
import { initLearning } from './learning.js';

const MODEL_ID = document.body.getAttribute('data-model');

document.addEventListener('DOMContentLoaded', () => {
  registerOfflineSupport();
  initTheme();
  initCreatorLink();
  initSearch();
  initNavigation(MODEL_ID);
  initProgress();

  if (MODEL_ID && MODEL_MAP[MODEL_ID]) {
    buildModelPage(MODEL_ID);
    renderStaticVisual(MODEL_ID);
    typesetMath();
  }

  initComparison();
  initModelSelector();
  renderProgressBar('home-progress');
  buildHomeExplorer();
  initLearning(MODEL_ID);
});

function initCreatorLink() {
  const actions = document.querySelector('.nav-actions');
  if (!actions || actions.querySelector('.creator-link')) return;
  const prefix = location.pathname.includes('/pages/') ? '' : 'pages/';
  const link = document.createElement('a');
  link.className = 'creator-link icon-btn';
  link.href = `${prefix}about.html#creator`;
  link.title = 'Meet the creator';
  link.setAttribute('aria-label', 'Meet the creator, Muhammad Danish');
  link.innerHTML = '<span class="creator-avatar" aria-hidden="true">MD</span><span class="creator-link-label">Creator</span>';
  actions.append(link);
}

function registerOfflineSupport() {
  if (!('serviceWorker' in navigator)) return;
  const workerUrl = new URL('../sw.js', import.meta.url);
  const scopeUrl = new URL('../', import.meta.url);
  navigator.serviceWorker.register(workerUrl, { scope: scopeUrl.href }).catch((err) => {
    console.warn('Offline support could not be enabled:', err);
  });
}

function typesetMath(attempt = 0) {
  if (!window.MathJax?.typesetPromise) {
    if (attempt < 20) window.setTimeout(() => typesetMath(attempt + 1), 150);
    return;
  }
  window.MathJax.typesetPromise([
    ...document.querySelectorAll('.math-objective, .equation-card, .equation-symbol-list, .lr-disclosure-body')
  ]).catch(() => {});
}

/* Home page: model explorer grid with category filter chips */
function buildHomeExplorer() {
  const root = document.getElementById('model-grid-root') || document.getElementById('model-explorer');
  if (!root) return;
  let filter = 'All';
  const chips = ['All', ...MODEL_GROUPS.map(g => g.name)];

  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function render() {
    const items = filter === 'All' ? MODELS : MODELS.filter(m => m.category === filter);
    root.innerHTML = `
      <div class="filter-chips" role="tablist" aria-label="Filter models by category">
        ${chips.map(c => `<button class="chip ${c===filter?'active':''}" data-cat="${esc(c)}" role="tab" aria-selected="${c===filter}">${esc(c)}</button>`).join('')}
      </div>
      <div class="grid-cards">
        ${items.map(m => `
          <div class="model-card reveal visible">
            <div>
              <div class="model-card-cat">${esc(m.category.toUpperCase())} · ${esc(m.learningType.toUpperCase())}</div>
              <h3>${esc(m.name)}</h3>
              <p>${esc(m.description)}</p>
              <div class="model-card-meta">
                <span class="badge badge-neutral">${esc(m.difficultyStars)}</span>
                <span class="badge badge-neutral">${esc(m.interpretability)} interpretability</span>
              </div>
            </div>
            <a href="${m.pagePath}" class="explore-link">Open interactive tutorial →</a>
          </div>`).join('')}
      </div>`;
    root.querySelectorAll('.chip').forEach(ch => ch.addEventListener('click', () => {
      filter = ch.getAttribute('data-cat');
      render();
    }));
  }
  render();
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search-cta')?.addEventListener('click', () => document.getElementById('search-btn')?.click());
});
