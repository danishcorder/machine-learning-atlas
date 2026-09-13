import { safeStorage } from './storage.js';
import { MODEL_MAP } from './model-data.js';

const mobile = matchMedia('(max-width: 768px)');
const names = ['Understand', 'Visualize', 'Mathematics', 'Learn', 'Practice', 'Apply'];
const keys = ['understand', 'visualize', 'mathematics', 'learn', 'practice', 'apply'];

function savedLesson() {
  try { return JSON.parse(safeStorage.get('atlas_last_lesson', 'null')); } catch { return null; }
}

export function initLearning(modelId) {
  const stages = [...document.querySelectorAll('.lesson-stage')];
  if (stages.length === 6) initLesson(modelId, stages);
  if (location.pathname.endsWith('/mathematics.html')) initMathModules();
  const home = document.getElementById('home-progress');
  const saved = savedLesson();
  if (home && MODEL_MAP[saved?.model] && Number.isInteger(saved.stage) && saved.stage >= 0 && saved.stage < 6) {
    const model = MODEL_MAP[saved.model];
    const link = document.createElement('a');
    link.className = 'continue-lesson btn btn-primary';
    link.href = `${model.pagePath}#stage-${keys[saved.stage]}`;
    link.textContent = `Continue ${model.name}: Stage ${saved.stage + 1}/6 - ${names[saved.stage]}`;
    home.prepend(link);
  }
  exposeAnchor();
  addEventListener('hashchange', exposeAnchor);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link) requestAnimationFrame(exposeAnchor);
  });
  makeTablesScrollable();
}

function exposeAnchor() {
  let target;
  try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
  if (!target) return;
  let parent = target.parentElement;
  while (parent) { if (parent.tagName === 'DETAILS') parent.open = true; parent = parent.parentElement; }
  if (location.hash) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
}

function initLesson(modelId, stages) {
  const toc = document.getElementById('model-toc');
  let current = 0;
  const saved = savedLesson();
  if (saved?.model === modelId && Number.isInteger(saved.stage)) current = Math.max(0, Math.min(5, saved.stage));
  const contents = document.createElement('details');
  contents.className = 'lesson-contents';
  contents.innerHTML = '<summary>Lesson contents <span class="contents-stage"></span></summary><div class="stage-links"></div>';
  stages.forEach((stage, i) => {
    const group = document.createElement('details');
    group.innerHTML = `<summary>${i + 1}. ${names[i]}</summary><a href="#${stage.id}">Start ${names[i]}</a>`;
    stage.querySelectorAll('section[id]').forEach(section => {
      const link = document.createElement('a');
      link.href = '#' + section.id;
      link.textContent = section.querySelector('h3')?.textContent || section.id;
      group.append(link);
    });
    contents.querySelector('.stage-links').append(group);
  });
  toc.replaceWith(contents);
  const nav = document.createElement('nav');
  nav.className = 'lesson-navigator';
  nav.setAttribute('aria-label', 'Lesson stages');
  nav.innerHTML = '<div class="stage-status" aria-live="polite"></div><progress max="6" value="1" aria-label="Position in lesson"></progress><div class="stage-controls"><button class="btn" data-step="-1">Previous</button><span class="stage-count"></span><button class="btn btn-primary" data-step="1">Next</button></div>';
  stages[0].before(nav);
  const status = nav.querySelector('.stage-status');
  const count = nav.querySelector('.stage-count');
  const prev = nav.querySelector('[data-step="-1"]');
  const next = nav.querySelector('[data-step="1"]');
  function show(index, focus = false, persist = true) {
    current = index;
    stages.forEach((stage, i) => { stage.hidden = mobile.matches && i !== current; });
    status.textContent = `Stage ${current + 1} of 6 - ${names[current]}`;
    count.textContent = `${current + 1} / 6`;
    contents.querySelector('.contents-stage').textContent = `${current + 1}/6`;
    nav.querySelector('progress').value = current + 1;
    prev.disabled = current === 0;
    next.disabled = current === 5;
    next.textContent = current < 5 ? `Next: ${names[current + 1]}` : 'Final stage';
    contents.querySelectorAll('.stage-links > details').forEach((group, i) => {
      group.querySelector('summary').setAttribute('aria-current', i === current ? 'step' : 'false');
    });
    if (persist) {
      safeStorage.set('atlas_last_lesson', JSON.stringify({ model: modelId, stage: current }));
      safeStorage.set(`atlas_stage_${modelId}`, String(current));
    }
    if (focus) {
      contents.open = false;
      stages[current].querySelector('h2').focus({ preventScroll: true });
      stages[current].scrollIntoView({ block: 'start' });
    }
  }
  nav.addEventListener('click', event => {
    const button = event.target.closest('[data-step]');
    if (!button || button.disabled) return;
    const index = Math.max(0, Math.min(5, current + Number(button.dataset.step)));
    location.hash = stages[index].id;
    show(index, true);
  });
  function fromHash() {
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    const stage = target?.closest('.lesson-stage');
    if (stage) show(stages.indexOf(stage));
  }
  function responsive() {
    contents.open = !mobile.matches;
    document.querySelectorAll('.lesson-detail').forEach(detail => { detail.open = !mobile.matches; });
    show(current, false, false);
    fromHash();
  }
  responsive();
  show(current);
  mobile.addEventListener('change', responsive);
  addEventListener('hashchange', fromHash);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (mobile.matches) return;
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) show(stages.indexOf(visible.target));
    }, { rootMargin: '-20% 0px -65% 0px' });
    stages.forEach(stage => observer.observe(stage));
  }
}

function initMathModules() {
  const descriptions = ['How supervised and unsupervised learning differ.', 'The language of data, vectors and transformations.', 'How derivatives explain learning and change.', 'Reason about uncertainty and evidence.', 'Measure patterns, spread and relationships.', 'Find parameters that minimize prediction error.'];
  const sections = [...document.querySelectorAll('#main-content > section')];
  sections.forEach((section, i) => {
    const heading = section.querySelector('h2');
    const detail = document.createElement('details');
    detail.className = 'math-module';
    detail.innerHTML = `<summary><span class="math-module-title">${i === 0 ? 'Foundations' : heading.textContent.replace(/^\d+\s*/, '')}</span><span>${descriptions[i]}</span><small>${section.querySelectorAll('.card').length} concepts - tap to explore</small></summary>`;
    section.before(detail);
    detail.append(section);
    detail.open = !mobile.matches;
    mobile.addEventListener('change', () => { detail.open = !mobile.matches; exposeAnchor(); });
  });
}

function makeTablesScrollable() {
  document.querySelectorAll('table').forEach(table => {
    if (table.closest('.table-scroll, .compare-table-wrap, .comparison-table-wrapper')) return;
    const wrap = document.createElement('div');
    wrap.className = 'table-scroll';
    wrap.tabIndex = 0;
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Data table; scroll horizontally for more columns');
    table.before(wrap);
    wrap.append(table);
  });
}
