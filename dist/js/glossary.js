import { CONCEPTS } from './concepts.js';
const root=document.getElementById('glossary-root'); const input=document.getElementById('glossary-query'); const count=document.getElementById('glossary-count');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const descriptions={
  'Gradient Descent':'An iterative optimization method that updates parameters in the direction opposite the loss gradient.',
  'Entropy':'A measure of class impurity or uncertainty, commonly used to choose Decision Tree splits.',
  'Information Gain':'The reduction in entropy achieved by a candidate split in a Decision Tree.',
  'Bayes Theorem':'A rule for updating the probability of a hypothesis after observing evidence.',
  'Regularization':'A penalty added to the learning objective to discourage overly complex parameter values and reduce overfitting.',
  'Margin':'The distance between an SVM decision boundary and the closest training points.',
  'Support Vector':'A training observation close enough to the SVM boundary to influence the optimal margin.',
  'Kernel Trick':'A way to compute similarity as if data had been mapped into a higher-dimensional feature space.',
  'Inertia / WCSS':'The sum of squared distances from each point to its assigned K-Means centroid.',
  'Dendrogram':'A tree diagram showing the sequence and distance of cluster merges in hierarchical clustering.',
  'Covariance':'A measure of how two variables vary together.',
  'Eigenvector':'A direction preserved by a linear transformation; PCA uses covariance eigenvectors as principal directions.',
  'Bias-Variance Tradeoff':'The tension between models that are too simple to capture signal and models that are too flexible to generalize.',
  'Overfitting':'Learning training-specific noise or detail that does not generalize to unseen data.'
};
function render(){const q=(input?.value||'').toLowerCase().trim(); const hits=CONCEPTS.filter(c=>!q||[c.term,c.kind,...c.models].join(' ').toLowerCase().includes(q)); if(count)count.textContent=`${hits.length} terms`; if(!root)return; root.innerHTML=hits.map(c=>`<article class="term-card"><h2>${esc(c.term)}</h2><p>${esc(descriptions[c.term]||`A ${c.kind} concept used when learning or applying ${c.models.join(', ')}.`)}</p><small>USED BY · ${esc(c.models.join(' · '))}</small><a class="explore-link" href="${esc(c.url.replace(/^pages\//,''))}">Learn in context →</a></article>`).join('')||'<p class="search-empty">No glossary terms matched that search.</p>';}
input?.addEventListener('input',render); render();
