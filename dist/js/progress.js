/* Lightweight localStorage progress tracker: "Mark as learned" + x/15 %. */
import { MODELS } from './model-data.js';
import { safeStorage } from './storage.js';

const KEY = 'atlas_learned';

export function loadLearned() {
  try { return new Set(JSON.parse(safeStorage.get(KEY, '[]')) || []); } catch { return new Set(); }
}
function saveLearned(set) {
  safeStorage.set(KEY, JSON.stringify([...set]));
}

export function initProgress() {
  const learned = loadLearned();
  const btn = document.getElementById('mark-learned');
  const wrap = document.getElementById('progress-wrap');
  if (!btn && !wrap) return;

  // Current model id from data-mode attribute
  const mode = document.getElementById('progress-wrap');
  const currentId = wrap ? wrap.getAttribute('data-model') : (btn ? btn.getAttribute('data-model') : null);

  if (btn && currentId) {
    const renderBtn = () => {
      const done = learned.has(currentId);
      btn.textContent = done ? '✓ Learned' : 'Mark as Learned';
      btn.classList.toggle('btn-primary', !done);
      btn.classList.toggle('btn-ghost', done);
      btn.setAttribute('aria-pressed', done);
    };
    renderBtn();
    btn.addEventListener('click', () => {
      if (learned.has(currentId)) learned.delete(currentId);
      else learned.add(currentId);
      saveLearned(learned);
      renderBtn();
      renderBar();
    });
  }

  function renderBar() {
    if (!wrap) return;
    const pct = Math.round((learned.size / MODELS.length) * 100);
    const fill = wrap.querySelector('.progress-fill');
    const label = wrap.querySelector('.progress-label');
    if (fill) { fill.style.width = pct + '%'; fill.setAttribute('aria-valuenow', pct); }
    if (label) label.innerHTML = `Models explored: <b>${learned.size} / ${MODELS.length}</b> · Progress <b>${pct}%</b>`;
  }
  renderBar();
}

/* Render progress bar used on the home page. */
export function renderProgressBar(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const learned = loadLearned();
  const pct = Math.round((learned.size / MODELS.length) * 100);
  el.innerHTML = `
    <div class="progress-label">Models explored: <b>${learned.size} / ${MODELS.length}</b> · Progress <b>${pct}%</b></div>
    <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
      <div class="progress-fill" style="width:${pct}%"></div>
    </div>`;
}