/* ML Atlas — static, explainable model-selection wizard. */
import { MODELS } from './model-data.js';
const PRE = location.pathname.includes('/pages/') ? '../' : '';
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function initModelSelector(){
  const root=document.getElementById('selector-root'); if(!root) return;
  let step=0; const answers={};
  const STEPS=[
    {key:'goal',title:'STEP 01',question:'What do you want the model to do?',options:[
      ['regression','Predict a number','Price, demand, score, temperature'],['classification','Predict a category','Spam/ham, approve/reject, disease class'],['clustering','Discover groups','Segments or structure without labels'],['dimred','Reduce dimensions','Compress or visualize many features']]},
    {key:'size',title:'STEP 02',question:'Roughly how much data do you have?',options:[['small','Small','Under ~1,000 rows'],['medium','Medium','~1K–100K rows'],['large','Large','Over ~100K rows']]},
    {key:'interpret',title:'STEP 03',question:'Must the result be easy to explain?',options:[['yes','Yes, strongly','Coefficients or rules should be readable'],['medium','Somewhat','A trade-off is acceptable'],['no','Not the priority','Predictive flexibility matters more']]},
    {key:'shape',title:'STEP 04',question:'What relationship do you expect?',options:[['linear','Mostly linear / additive','A line or weighted sum is plausible'],['nonlinear','Non-linear / threshold-like','Curves, interactions or local patterns'],['unknown','I do not know','Prefer a robust baseline']]}
  ];
  const render=()=> step<STEPS.length?renderStep():renderResults();
  function renderStep(){
    const s=STEPS[step]; root.innerHTML=`<div class="selector-step reveal visible"><div class="step-header"><span class="step-num">${s.title}</span><span class="step-progress">${step+1} / ${STEPS.length}</span></div><h2 class="step-question">${esc(s.question)}</h2><div class="step-options">${s.options.map(o=>`<button class="step-btn" data-val="${o[0]}"><strong>${esc(o[1])}</strong><span class="step-hint">${esc(o[2])}</span></button>`).join('')}</div>${step?'<button class="step-btn step-back" data-back>← Back</button>':''}</div>`;
    root.querySelectorAll('[data-val]').forEach(btn=>btn.addEventListener('click',()=>{answers[s.key]=btn.dataset.val;step++;render();}));
    root.querySelector('[data-back]')?.addEventListener('click',()=>{step=Math.max(0,step-1);render();});
  }
  function score(m){
    let v=0; const goal=answers.goal;
    if(goal==='regression' && m.problemType.includes('Regression')) v+=45;
    if(goal==='classification' && m.problemType.includes('Classification')) v+=45;
    if(goal==='clustering' && m.category==='Clustering') v+=50;
    if(goal==='dimred' && m.id==='pca') v+=60;
    if(answers.size==='large' && m.trainingComplexity==='Low') v+=12;
    if(answers.size==='small' && ['High','Medium'].includes(m.trainingComplexity)) v+=8;
    if(answers.size==='medium' && ['Low','Medium'].includes(m.trainingComplexity)) v+=10;
    if(answers.interpret==='yes' && m.interpretability==='High') v+=18;
    if(answers.interpret==='medium' && ['High','Medium'].includes(m.interpretability)) v+=10;
    if(answers.interpret==='no' && m.interpretability!=='High') v+=8;
    const linear=['linear-regression','multiple-linear-regression','ridge-regression','lasso-regression','logistic-regression','naive-bayes'];
    const nonlinear=['polynomial-regression','knn','decision-tree','random-forest','svm','kmeans','hierarchical-clustering','dbscan'];
    if(answers.shape==='linear' && linear.includes(m.id)) v+=18;
    if(answers.shape==='nonlinear' && nonlinear.includes(m.id)) v+=16;
    if(answers.shape==='unknown' && ['linear-regression','logistic-regression','decision-tree','random-forest','kmeans','pca'].includes(m.id)) v+=8;
    return v;
  }
  function reason(m){
    const bits=[]; if(m.interpretability==='High') bits.push('easy to interpret'); if(m.trainingComplexity==='Low') bits.push('fast to train');
    if(m.category==='Clustering') bits.push('works without labels'); if(m.id==='pca') bits.push('purpose-built for dimensionality reduction');
    if(['decision-tree','random-forest','svm','knn','polynomial-regression'].includes(m.id)) bits.push('handles non-linear structure');
    return bits.slice(0,3).join(', ') || m.strengths[0];
  }
  function renderResults(){
    const ranked=MODELS.map(model=>({model,score:score(model)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score); const primary=ranked[0], alts=ranked.slice(1,4);
    if(!primary){root.innerHTML='<p class="search-empty">No strong match. Start again and choose the closest description.</p>';return;}
    root.innerHTML=`<div class="selector-results reveal visible"><div class="step-header"><span class="step-num">RESULT</span><span class="step-progress">Explainable recommendation</span></div><h2 class="step-question">Start with ${esc(primary.model.name)}</h2><div class="selector-primary card"><span class="primary-badge">PRIMARY RECOMMENDATION</span><h3>${esc(primary.model.name)}</h3><p>${esc(primary.model.description)}</p><p class="section-subtitle"><strong>Why it fits:</strong> ${esc(reason(primary.model))}.</p><div class="hero-badges">${primary.model.hyperparameters?.slice(0,3).map(([k])=>`<span class="badge">${esc(k)}</span>`).join('')||''}</div><a href="${PRE}${primary.model.pagePath}" class="btn btn-primary">Learn ${esc(primary.model.name)} →</a></div><div class="selector-alts"><h3>Strong alternatives</h3>${alts.map(a=>`<article class="card"><div class="flex-between"><h4>${esc(a.model.name)}</h4><span class="badge">${a.score} fit pts</span></div><p>${esc(a.model.description)}</p><a class="explore-link" href="${PRE}${a.model.pagePath}">See trade-offs →</a></article>`).join('')}</div><div class="selector-tradeoffs card"><h4>Use this as a shortlist, not an automatic answer</h4><p>Real model selection still depends on validation data, feature quality, class balance, latency, cost and the error type that matters most.</p></div><button class="btn btn-ghost" data-restart>← Start over</button></div>`;
    root.querySelector('[data-restart]')?.addEventListener('click',()=>{step=0;Object.keys(answers).forEach(k=>delete answers[k]);render();});
  }
  render();
}
export default initModelSelector;
