/* Render the 5-question reveal cards for a model from questions.js. */
import { QUESTIONS } from './questions.js';

export function initQA(modelId) {
  const target = document.getElementById('qa-list');
  if (!target) return;

  const items = QUESTIONS[modelId];
  if (!items || !items.length) {
    target.innerHTML = '<p class="search-empty">Q&A coming soon for this model.</p>';
    return;
  }

  target.innerHTML = items.map((item, i) => `
    <div class="qa-card" role="button" tabindex="0" aria-expanded="false"
         aria-label="Question ${i + 1}: ${escapeHtml(item.question)}">
      <div class="qa-q">
        <span class="q-num">${String(i + 1).padStart(2, '0')}</span>
        <span>${escapeHtml(item.question)}</span>
        <span class="q-cat">${escapeHtml(item.cat)}</span>
        <span class="q-chev" aria-hidden="true">›</span>
      </div>
      <div class="qa-a">
        <div class="qa-a-inner"><p>${escapeHtml(item.answer)}</p></div>
      </div>
    </div>`).join('');

  target.querySelectorAll('.qa-card').forEach((card) => {
    const toggle = () => {
      const open = card.classList.toggle('open');
      card.setAttribute('aria-expanded', open);
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}