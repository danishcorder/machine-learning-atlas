/* ML ATLAS — Model page builder.
 * Fills the data-driven sections of a model page from model-data.js:
 * problem scenarios, data & features, evaluation, strengths, limitations,
 * assumptions, when-to-use / when-not, recap. Narrative sections (intuition,
 * math, equation, algorithm, lab, worked example) stay hand-written in HTML.
 */
import { MODEL_MAP, MODELS } from './model-data.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const modelHref = (model) => (location.pathname.includes('/pages/') ? '../' : '') + model.pagePath.replace(/^pages\//, '');

export function buildModelPage(modelId) {
  const m = MODEL_MAP[modelId];
  if (!m) return;

  fill('#sec-overview-body', () => `
    <p class="model-overview-text">${esc(m.overview)}</p>
    <div class="teaching-schema">
      <article><span>OBJECTIVE / CORE MATH</span><div class="math-objective">${m.objective || ''}</div></article>
      <article><span>HOW IT LEARNS</span><p>${esc(m.optimization || 'See the mathematical and algorithm sections below for the learning rule.')}</p></article>
      <article class="tuning-card"><span>HYPERPARAMETERS THAT MATTER</span><dl>${(m.hyperparameters || []).map(([k,v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></article>
    </div>`);

  fill('#sec-apps-grid', () => (m.applications || []).map((a) => `
    <div class="card app-card">
      <h4 class="app-title">${esc(a.problem)}</h4>
      <dl class="app-dl">
        <div><dt>Data</dt><dd>${esc(a.data)}</dd></div>
        <div><dt>Features</dt><dd>${esc(a.features)}</dd></div>
        <div><dt>Target</dt><dd>${esc(a.target)}</dd></div>
        <div><dt>Why this model</dt><dd>${esc(a.whyThisModel)}</dd></div>
        <div><dt>Expected output</dt><dd>${esc(a.expectedOutput)}</dd></div>
      </dl>
    </div>`).join(''));

  fill('#sec-data-features', () => {
    const a = (m.applications || [])[0];
    if (!a) return '';
    return `
      <div class="stat-grid">
        <div class="stat-card"><span class="stat-label">Example features</span><span class="stat-value-small">${esc(a.features)}</span></div>
        <div class="stat-card"><span class="stat-label">Target to predict</span><span class="stat-value-small">${esc(a.target)}</span></div>
        <div class="stat-card"><span class="stat-label">Training data</span><span class="stat-value-small">${esc(a.data)}</span></div>
        <div class="stat-card"><span class="stat-label">Prediction</span><span class="stat-value-small">${esc(m.output)}</span></div>
      </div>
      <p class="section-subtitle" style="margin-top:0.8rem;">Training means showing the model many (features → target) pairs so it can learn the mapping. Prediction means applying the learned mapping to features it has never seen.</p>`;
  });

  fill('#sec-evaluation', () => `
    <p class="section-subtitle" style="margin-bottom:0.8rem;">The metrics practitioners use to judge this model:</p>
    <div class="hero-badges">${(m.evaluationMetrics || []).map((x) => `<span class="badge">${esc(x)}</span>`).join('')}</div>`);

    fill('#sec-strengths', () => `<ul class="pill-list good">${m.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`);
  fill('#sec-limitations', () => {
    const weak = (m.weaknesses || []).map((s) => `<li>${esc(s)}</li>`).join('');
    const assum = (m.assumptions || []).map((s) => `<li>${esc(s)}</li>`).join('');
    return `<ul class="pill-list bad">${weak}</ul>` +
      (assum ? `<h3 style="margin:1.2rem 0 0.5rem;">Assumptions of the model</h3><p class="section-subtitle">Violating these is why the limitations above bite — knowing them tells you when the math no longer holds.</p><ul class="pill-list">${assum}</ul>` : '');
  });

  fill('#sec-when', () => `<ul class="pill-list good">${m.strengths.map((s) => `<li><strong>Use when:</strong> ${esc(s)}</li>`).join('')}</ul>`);
  fill('#sec-whennot', () => `<ul class="pill-list bad">${m.weaknesses.map((s) => `<li><strong>Avoid when:</strong> ${esc(s)}</li>`).join('')}</ul>`);

  fill('#sec-recap', () => `
    <div class="card recap-card">
      <p><strong>${esc(m.name)}</strong> — ${esc(m.description)}</p>
      <ul class="recap-list">
        <li><strong>Learning type:</strong> ${esc(m.learningType)} · <strong>Problem:</strong> ${esc(m.problemType)} · <strong>Output:</strong> ${esc(m.output)}</li>
        <li><strong>Core strength:</strong> ${esc(m.strengths[0])}</li>
        <li><strong>Core limitation:</strong> ${esc(m.weaknesses[0])}</li>
        <li><strong>Judge it with:</strong> ${(m.evaluationMetrics || []).slice(0, 3).map(esc).join(' · ')}</li>
      </ul>
    </div>`);

  fill('#sec-related', () => {
    const chips = (m.relatedModels || []).map((name) => {
      const found = MODELS.find((x) => x.name === name);
      return found
        ? `<a class="badge" href="${modelHref(found)}" style="text-transform:none;">${esc(name)} →</a>`
        : `<span class="badge" style="text-transform:none;">${esc(name)}</span>`;
    });
    return `<div class="hero-badges">${chips.join('')}</div>`;
  });
}

function fill(selector, htmlFn) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = htmlFn();
}

export default buildModelPage;
