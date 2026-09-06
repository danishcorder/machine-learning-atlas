/* Model Compass — comparison table with filtering + multi-select.
 * Reads MODELS from model-data.js. */
import { safeStorage } from './storage.js';
import { MODELS } from './model-data.js';

const CATEGORY_FILTERS = ['All', 'Regression', 'Classification', 'Clustering', 'Dimensionality Reduction'];
const LEARNING_FILTERS = ['All', 'Supervised', 'Unsupervised'];
/* comparison.html lives in /pages/ → prefix root-relative model links */
const PRE = location.pathname.includes('/pages/') ? '../' : '';

export function initComparison() {
  const wrap = document.getElementById('compass-root');
  if (!wrap) return;

  let cat = 'All';
  let learn = 'All';
  let selectedOnly = false;

  function render() {
    const visible = MODELS.filter((m) =>
      (cat === 'All' || m.category === cat || (cat === 'Dimensionality Reduction' && m.category === 'Dimensionality Reduction')) &&
      (learn === 'All' || m.learningType === learn)
    );

    wrap.innerHTML = `
      <div class="card" style="margin-bottom:1.5rem">
        <div class="filter-chips" id="cat-chips">
          ${CATEGORY_FILTERS.map((c) => `<button class="chip ${cat === c ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="section-subtitle">Compare each model side by side, or select up to 3 to focus the comparison.</div>
        <div class="compare-select">${MODELS.map((m, i) => `
          <label class="compare-check"><input type="checkbox" data-cmp="${m.id}" ${isSelected(m.id) ? 'checked' : ''}><span>${m.name}</span></label>`).join('')}
        </div>
      </div>
      <div class="table-wrap">
        <table class="comparison-table" role="table">
          <thead><tr>
            <th>Model</th><th>Learning</th><th>Problem</th><th>Output</th>
            <th>Math</th><th>Interpretability</th><th>Training</th><th>Prediction</th>
            <th>Strength</th><th>Weakness</th><th>Typical Applications</th>
          </tr></thead>
          <tbody>${visible.map(rowHtml).join('')}</tbody>
        </table>
      </div>
      <p class="viz-note">Dimension trade-offs: interpretability, complexity and speed are model-specific, shown at a glance.</p>`;
  }

  function isSelected(id) {
    try {
      const arr = JSON.parse(safeStorage.get('atlas_compare', '[]') || '[]');
      return arr.includes(id);
    } catch { return false; }
  }

  function rowHtml(m) {
    const sel = isSelected(m.id);
    return `<tr class="${sel ? 'highlight' : ''}" data-name="${m.id}">
      <td class="row-head"><a href="${PRE}${m.pagePath}" style="color:var(--accent-secondary)">${m.name}</a></td>
      <td>${m.learningType}</td>
      <td>${m.problemType}</td>
      <td>${m.output}</td>
      <td>${m.mathematicalDepth}</td>
      <td>${m.interpretability}</td>
      <td>${m.trainingComplexity}</td>
      <td>${m.predictionSpeed}</td>
      <td>${m.strengths[0]}</td>
      <td>${m.weaknesses[0]}</td>
      <td>${(m.applications || []).slice(0, 2).map((a) => a.problem).join(', ')}</td>
    </tr>`;
  }

  wrap.addEventListener('click', (e) => {
    if (e.target.classList.contains('chip')) {
      const chips = wrap.querySelectorAll('#cat-chips .chip');
      chips.forEach((c) => c.classList.toggle('active', c === e.target));
      cat = e.target.getAttribute('data-cat');
      render();
    }
  });
  wrap.addEventListener('change', (e) => {
    if (e.target.matches('.compare-check input')) {
      const id = e.target.getAttribute('data-cmp');
      const checked = e.target.checked;
      let arr = [];
      try { arr = JSON.parse(safeStorage.get('atlas_compare', '[]') || '[]'); } catch { arr = []; }
      if (checked) { if (!arr.includes(id)) arr.push(id); }
      else arr = arr.filter((x) => x !== id);
      if (arr.length > 3) {
        alert('Select up to 3 models to keep the comparison readable.');
        e.target.checked = false;
        arr = arr.filter((x) => x !== id);
      }
      safeStorage.set('atlas_compare', JSON.stringify(arr));
      render();
    }
  });

  render();
}

export default initComparison;