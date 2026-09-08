/* Shared UI: active nav, hamburger, model sidebar, prev/next, TOC, DNA fill, reveal-on-scroll. */
import { MODELS, MODEL_MAP, MODEL_GROUPS, prevModel, nextModel } from './model-data.js';

const ORDER = MODELS.map((m) => m.id);
/* pages live in /pages/ → prefix site-root-relative hrefs so links work from anywhere */
const PRE = location.pathname.includes('/pages/') ? '../' : '';

export function initNavigation(currentModelId) {
  initNavbar();
  initRevealObserver();
  if (currentModelId) {
    buildSidebar(currentModelId);
    buildPrevNext(currentModelId);
    buildTOC(currentModelId);
    fillDNA(currentModelId);
    fillContinueLearning(currentModelId);
  }
}

function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (hamburger && links) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
  }
  const modelSelect = document.getElementById('model-select');
  if (modelSelect) modelSelect.addEventListener('change', () => {
    if (modelSelect.value) window.location.href = modelSelect.value;
  });
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('model-sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      const open = sidebar.classList.toggle('open');
      sidebarToggle.setAttribute('aria-expanded', open);
    });
  }
}

function initRevealObserver() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .animate-up, .stagger').forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .animate-up, .stagger').forEach((el) => io.observe(el));
}

function buildSidebar(currentId) {
  const el = document.getElementById('model-sidebar');
  if (!el) return;
  let html = '<div class="sidebar-card">';
  html += `<div class="model-picker-label">MODEL LIBRARY <span>${ORDER.indexOf(currentId) + 1} / ${ORDER.length}</span></div><select id="model-select" class="model-select" aria-label="Choose a model">`;
  ORDER.forEach((id) => { const m = MODEL_MAP[id]; html += `<option value="${PRE}${m.pagePath}" ${id === currentId ? 'selected' : ''}>${escapeHtml(m.name)}</option>`; });
  html += '</select></div>';
  html += '<div class="sidebar-card sidebar-categories"><div class="model-picker-label">BROWSE BY CATEGORY</div>';
  MODEL_GROUPS.forEach((g) => {
    html += `<details class="sidebar-group" ${g.models.includes(currentId) ? 'open' : ''}><summary>${escapeHtml(g.name)}<span>${g.models.length}</span></summary><ul class="sidebar-list">`;
    g.models.forEach((id) => {
      const m = MODEL_MAP[id];
      const active = id === currentId ? 'active' : '';
      html += `<li><a href="${PRE}${m.pagePath}" class="${active}"><span class="dot"></span>${escapeHtml(m.name)}</a></li>`;
    });
    html += '</ul></details>';
  });
  html += '</div>';
  el.innerHTML = html;
}

function currentName(id) {
  const m = MODEL_MAP[id];
  return m ? m.name : 'Models';
}

function buildPrevNext(currentId) {
  const wrap = document.getElementById('prev-next');
  if (!wrap) return;
  const prev = prevModel(currentId);
  const next = nextModel(currentId);
  wrap.innerHTML = `
    <div class="nav-controls">
      ${prev ? `<a class="nav-ctrl" href="${PRE}${prev.pagePath}"><span class="dir">← Previous</span><span class="nm">${escapeHtml(prev.name)}</span></a>`
             : `<span class="nav-ctrl"><span class="dir">← Previous</span><span class="nm" style="color:var(--text-muted)">Start of series</span></span>`}
      <div class="nav-center"><a href="${PRE}index.html" class="btn btn-ghost btn-sm">← All Models</a></div>
      ${next ? `<a class="nav-ctrl right" href="${PRE}${next.pagePath}"><span class="dir">Next →</span><span class="nm">${escapeHtml(next.name)}</span></a>`
             : `<span class="nav-ctrl right"><span class="dir">Next →</span><span class="nm" style="color:var(--text-muted)">End of series</span></span>`}
    </div>`;
}

function buildTOC(currentId) {
  const el = document.getElementById('model-toc');
  if (!el) return;
  const sections = [
    ['overview', 'Overview'], ['problem', 'The Problem'], ['why', 'Why It Matters'],
    ['intuition', 'Intuition'], ['math', 'Mathematical Foundation'], ['equation', 'The Equation'],
    ['learns', 'How It Learns'], ['algorithm', 'Algorithm'], ['visuals', 'Visual Explanation'],
    ['example', 'Worked Example'], ['data', 'Data & Features'], ['evaluation', 'Evaluation'],
    ['strengths', 'Strengths'], ['limitations', 'Limitations'], ['when', 'When To Use'],
    ['not', 'When Not To Use'], ['apps', 'Real-World Applications'],
    ['related', 'Related Models'], ['recap', '60-Second Recap'], ['continue', 'Continue Learning']
  ];
  el.innerHTML = sections.map((s, i) =>
    `<a href="#${s[0]}"><span class="toc-n">${String(i + 1).padStart(2, '0')}</span>${s[1]}</a>`
  ).join('');
}

function fillDNA(currentId) {
  const el = document.getElementById('dna-card');
  if (!el) return;
  const m = MODEL_MAP[currentId];
  if (!m) return;
  el.innerHTML = `
    <div class="dna-header">Model DNA</div>
    <div class="dna-grid">
      <span class="dna-label">Learning Type</span><span class="dna-value">${escapeHtml(m.learningType)}</span>
      <span class="dna-label">Problem</span><span class="dna-value">${escapeHtml(m.problemType)}</span>
      <span class="dna-label">Output</span><span class="dna-value">${escapeHtml(m.output)}</span>
      <span class="dna-label">Math Depth</span><span class="dna-value">${escapeHtml(m.mathematicalDepth)}</span>
      <span class="dna-label">Interpretability</span><span class="dna-value">${escapeHtml(m.interpretability)}</span>
      <span class="dna-label">Training Complexity</span><span class="dna-value">${escapeHtml(m.trainingComplexity)}</span>
      <span class="dna-label">Prediction Speed</span><span class="dna-value">${escapeHtml(m.predictionSpeed)}</span>
      <span class="dna-label">Typical Data Size</span><span class="dna-value">${escapeHtml(m.typicalDatasetSize)}</span>
    </div>
    <a class="row-link" href="${PRE}comparison.html">Compare with other models →</a>`;
}

function fillContinueLearning(currentId) {
  const el = document.getElementById('continue-learning');
  if (!el) return;
  const m = MODEL_MAP[currentId];
  if (!m) return;
  const related = (m.relatedModels || []).map((name) => {
    const found = MODELS.find((x) => x.name === name);
    return found ? `· <a href="${PRE}${found.pagePath}" style="color:var(--accent-secondary)">${escapeHtml(name)}</a>` : `· ${escapeHtml(name)}`;
  }).join(' ');
  el.innerHTML = `
    <div class="card">
      <h3 class="card-title">Continue Learning</h3>
      <p class="card-body">Mastered <strong>${escapeHtml(m.name)}</strong>? Build a connected mental map with related models:</p>
      <p class="card-body" style="margin-top:0.6rem; line-height:1.9;">${related}</p>
      <p class="card-body" style="margin-top:1rem;"><a href="${PRE}index.html" style="color:var(--accent-primary);font-weight:600">Back to Model Explorer →</a></p>
    </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

export default initNavigation;
