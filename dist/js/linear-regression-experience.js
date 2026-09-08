import { initLinearRegression } from './visualizations/linear-regression.js';

const navItems = [['understand', 'Understand'], ['visualize', 'Visualize'], ['math', 'Math'], ['training', 'Training'], ['practice', 'Practice'], ['apply', 'Apply']];

document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));

function init() {
  document.body.classList.add('lr-page');
  personalizeHero();
  addHeroGraphic();
  buildLearningNav();
  groupFullNotes();
  wireMathSymbols();
  wireQuiz();
  wireMetricCards();
  initLinearRegression('lr-canvas');
}

function personalizeHero() {
  const hero = document.querySelector('.model-hero');
  if (!hero) return;
  const title = hero.querySelector('.model-title');
  const subtitle = hero.querySelector('.model-subtitle');
  const badges = hero.querySelector('.hero-badges');
  const actions = hero.querySelector('.hero-actions');
  if (title) title.textContent = 'Linear Regression';
  if (subtitle) subtitle.textContent = 'Find the best straight-line relationship between input data and a continuous output.';
  if (badges) badges.innerHTML = ['Supervised Learning', 'Regression', 'Beginner', '~12 min'].map((x) => '<span class="badge">' + x + '</span>').join('');
  if (actions) actions.innerHTML = '<a class="btn btn-primary" href="#understand">Start Learning</a><a class="btn btn-ghost" href="#visualize">Open Playground</a>';
}

function addHeroGraphic() {
  const card = document.getElementById('dna-card');
  if (!card || card.querySelector('.lr-hero-graphic')) return;
  const points = [[18, 78], [28, 68], [39, 70], [49, 53], [60, 55], [70, 40], [81, 44], [91, 25]];
  const dots = points.map((point, i) => '<circle class="lr-hero-point" cx="' + point[0] + '%" cy="' + point[1] + '%" r="3.5" style="--delay:' + (i * 80 + 500) + 'ms"/>').join('');
  const graphic = '<div class="lr-hero-graphic"><svg viewBox="0 0 320 180" role="img" aria-label="Animated scatter plot with a best-fit line"><path d="M25 155 H300 M25 155 V20" stroke="var(--text-muted)" stroke-width="1"/><path class="lr-hero-line" d="M28 142 L290 35" fill="none" stroke="var(--accent-primary)" stroke-width="3" stroke-linecap="round"/>' + dots + '<text x="30" y="30" fill="var(--text-muted)" font-size="12">ŷ = β₀ + β₁x</text></svg></div>';
  card.insertAdjacentHTML('afterbegin', graphic);
  card.querySelectorAll('.lr-hero-point').forEach((dot, i) => {
    const point = points[i];
    dot.setAttribute('cx', 25 + point[0] * 2.65);
    dot.setAttribute('cy', 20 + point[1] * 1.45);
  });
}

function buildLearningNav() {
  const toc = document.getElementById('model-toc');
  if (!toc) return;
  toc.className = 'lr-sticky-nav';
  toc.innerHTML = navItems.map((item, i) => '<a href="#' + item[0] + '"><span class="toc-n">' + String(i + 1).padStart(2, '0') + '</span>' + item[1] + '</a>').join('');
  const links = [...toc.querySelectorAll('a')];
  const sections = navItems.map((item) => document.getElementById(item[0])).filter(Boolean);
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
  }), { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}

function groupFullNotes() {
  const main = document.getElementById('main-content');
  const apply = document.getElementById('apply');
  if (!main || !apply || document.querySelector('.lr-full-notes')) return;
  const ids = ['overview', 'data', 'evaluation', 'strengths', 'limitations', 'when', 'not', 'apps', 'related', 'recap', 'continue', 'prev-next'];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const details = document.createElement('details');
  details.className = 'lr-full-notes';
  details.innerHTML = '<summary>Open the full course notes and model reference</summary><div class="lr-full-notes-body"></div>';
  const body = details.querySelector('.lr-full-notes-body');
  sections.forEach((section) => body.appendChild(section));
  main.appendChild(details);
}

function wireMathSymbols() {
  document.querySelectorAll('[data-focus-symbol]').forEach((button) => button.addEventListener('click', () => {
    const key = button.dataset.focusSymbol;
    document.querySelectorAll('.lr-symbol-card').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll('.lr-equation [data-symbol]').forEach((item) => item.classList.toggle('focused', item.dataset.symbol === key));
  }));
}

function wireQuiz() {
  const feedback = document.querySelector('.lr-quiz-feedback');
  document.querySelectorAll('.lr-quiz-option').forEach((button) => button.addEventListener('click', () => {
    const correct = button.dataset.correct === 'true';
    document.querySelectorAll('.lr-quiz-option').forEach((item) => item.classList.remove('correct', 'incorrect'));
    button.classList.add(correct ? 'correct' : 'incorrect');
    if (feedback) feedback.textContent = correct ? 'Correct. The slope is the expected change in prediction for one unit of input.' : 'Not quite. Look for the parameter that controls the line’s tilt.';
  }));
}

function wireMetricCards() {
  const explanations = ['MAE treats every error evenly and is easy to interpret.', 'MSE penalizes large errors more heavily, making it useful during fitting.', 'RMSE returns to the same units as the target, which helps communicate model error.', 'R² describes the proportion of target variation explained by the fitted relationship.'];
  document.querySelectorAll('.lr-metric-card').forEach((card, i) => card.addEventListener('click', () => {
    card.classList.toggle('open');
    const detail = card.querySelector('em');
    if (detail) detail.textContent = card.classList.contains('open') ? explanations[i] : 'Equation + use';
  }));
}
