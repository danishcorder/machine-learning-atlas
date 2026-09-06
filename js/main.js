/* ML ATLAS — central entry point.
 * Pages declare <body data-model="model-id"> (model pages) and/or host
 * containers: #qa-list, #model-sidebar, #prev-next, #model-toc, #dna-card,
 * #progress-wrap, #compass-root, #selector-root, #home-progress, #model-explorer.
 */
import { MODELS, MODEL_MAP, MODEL_GROUPS } from './model-data.js';
import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initSearch } from './search.js';
import { initQA } from './quiz.js';
import { initProgress, renderProgressBar } from './progress.js';
import { initComparison } from './comparison.js';
import { initModelSelector } from './model-selector.js';
import { buildModelPage } from './model-page.js';

const MODEL_ID = document.body.getAttribute('data-model');

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSearch();
  initNavigation(MODEL_ID);
  initProgress();

  if (MODEL_ID && MODEL_MAP[MODEL_ID]) {
    buildModelPage(MODEL_ID);
    initQA(MODEL_ID);
    loadVisualization(MODEL_MAP[MODEL_ID].visualization);
  }

  initComparison();
  initModelSelector();
  renderProgressBar('home-progress');
  buildHomeExplorer();
});

/* dynamically import the lab engine for this model's page */
async function loadVisualization(vizId) {
  if (!vizId) return;
  try {
    const mod = await import(`./visualizations/${vizId}.js`);
    const fn = mod.default || Object.values(mod)[0];
    if (typeof fn === 'function') fn();
    initVizCaption(MODEL_MAP[MODEL_ID]);
  } catch (err) {
    console.warn(`Visualization "${vizId}" could not be loaded:`, err);
  }
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


function initVizCaption(model) {
  const lab = document.getElementById('lab');
  if (!lab || !model) return;
  let caption = lab.querySelector('.viz-caption');
  if (!caption) {
    caption = document.createElement('div');
    caption.className = 'viz-caption';
    caption.setAttribute('role','status');
    caption.setAttribute('aria-live','polite');
    const stage = lab.querySelector('.viz-stage');
    (stage?.parentElement || lab).appendChild(caption);
  }
  const update = () => {
    const stats = [...lab.querySelectorAll('.viz-stats > div')].slice(0,3).map(el => {
      const k=el.querySelector('.stat-label')?.textContent?.trim();
      const v=el.querySelector('.stat-value')?.textContent?.trim();
      return k && v ? `${k}: ${v}` : '';
    }).filter(Boolean);
    const guide = {
      'linear-regression':'Move points or parameters and watch the fitted line minimize squared residual error.',
      'logistic-regression':'Adjust the sigmoid or threshold and watch probabilities become class decisions.',
      'knn':'Move the query point or change K; the prediction comes from the closest neighbours.',
      'svm':'Train the separator and watch the margin change as support vectors constrain the optimum.',
      'kmeans':'Run Lloyd’s algorithm: assign each point to its nearest centroid, then recompute cluster means.',
      'decision-tree':'Grow another level and compare information gain with the resulting leaf purity.',
      'dbscan':'Change ε and minPts to see density create core, border and noise points.',
      'pca':'Rotate the principal direction and compare how much variance the projection preserves.'
    }[model.id] || `Interact with the controls to see how ${model.name} changes its learned representation.`;
    caption.innerHTML = `<span class="caption-step">LIVE EXPLANATION</span><strong>${guide}</strong>${stats.length?`<small>${stats.join(' · ')}</small>`:''}`;
  };
  const observer = new MutationObserver(update);
  observer.observe(lab,{subtree:true,childList:true,characterData:true});
  lab.addEventListener('input',update); lab.addEventListener('click',()=>setTimeout(update,0));
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search-cta')?.addEventListener('click', () => document.getElementById('search-btn')?.click());
});
