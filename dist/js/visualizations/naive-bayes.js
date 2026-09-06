/* ML ATLAS — Naive Bayes interactive lab.
 * A tiny spam filter. Toggle which words appear in the email; the lab computes
 * P(spam | words) via Bayes' theorem with the naive conditional-independence
 * assumption (log-space to avoid underflow). Simplified educational viz.
 */
export function initNaiveBayes(canvasId = 'nb-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 46;
  let W = 0, H = 0, prior = 0.4;

  /* word → P(word | class) */
  const WORDS = [
    { w: 'free',   pSpam: 0.55, pHam: 0.04 },
    { w: 'winner', pSpam: 0.40, pHam: 0.02 },
    { w: 'meeting',pSpam: 0.02, pHam: 0.30 },
    { w: 'project',pSpam: 0.03, pHam: 0.35 },
    { w: 'click',  pSpam: 0.30, pHam: 0.05 },
    { w: 'invoice',pSpam: 0.15, pHam: 0.20 },
  ];
  let present = [true, true, false, false, false, false]; /* toggled in UI */

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    W = r.width; H = r.height;
    const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  /* naive posterior in log space:
     P(S|w) ∝ P(S)·∏ P(wᵢ|S);  P(H|w) ∝ (1−P(S))·∏ P(wᵢ|H) */
  function posterior() {
    let ls = Math.log(prior), lh = Math.log(1-prior);
    WORDS.forEach((word,i)=>{
      if (!present[i]) return;
      ls += Math.log(word.pSpam);
      lh += Math.log(word.pHam);
    });
    const m = Math.max(ls, lh);
    const s = Math.exp(ls-m), h = Math.exp(lh-m);
    return { spam: s/(s+h), ham: h/(s+h) };
  }

  function draw() {
    if (!W) return;
    ctx.clearRect(0,0,W,H);
    const post = posterior();
    /* two stacked bars: evidence accumulation toward spam vs ham */
    const barH = 44, barW = W-2*M;
    const rows = [
      { label: 'P(spam | words)', v: post.spam, col: css('--accent-secondary')||'#f85' },
      { label: 'P(ham | words)',  v: post.ham,  col: css('--accent-primary')||'#4f9' },
    ];
    rows.forEach((row,i)=>{
      const y = M + i*(barH+38);
      ctx.fillStyle = css('--text-secondary') || '#889';
      ctx.font = '12px monospace';
      ctx.fillText(row.label, M, y-6);
      ctx.strokeStyle = css('--border') || '#334';
      ctx.lineWidth = 1;
      ctx.strokeRect(M, y, barW, barH);
      ctx.fillStyle = row.col;
      ctx.fillRect(M, y, barW*row.v, barH);
      ctx.fillStyle = css('--text-primary') || '#fff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText((row.v*100).toFixed(1)+'%', M + barW*row.v + 8 < W-M-40 ? M + barW*row.v + 8 : M+8, y+barH/2+5);
    });
    /* verdict */
    const verdict = post.spam >= 0.5 ? 'SPAM' : 'HAM';
    const vy = M + 2*(barH+38) + 6;
    ctx.fillStyle = verdict==='SPAM' ? 'rgba(248,95,106,0.15)' : 'rgba(79,157,255,0.15)';
    ctx.strokeStyle = verdict==='SPAM' ? css('--accent-secondary')||'#f85' : css('--accent-primary')||'#4f9';
    ctx.lineWidth = 1.5;
    ctx.fillRect(M, vy, barW, 42);
    ctx.strokeRect(M, vy, barW, 42);
    ctx.fillStyle = verdict==='SPAM' ? css('--accent-secondary')||'#f85' : css('--accent-primary')||'#4f9';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`CLASSIFIED: ${verdict}  ·  prior P(spam)=${prior.toFixed(2)}`, M+12, vy+26);
    info(post);
  }

  function info(post) {
    const el = document.getElementById('nb-info');
    if (el) el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">Prior P(spam)</span><span class="stat-value">${prior.toFixed(2)}</span></div>
        <div><span class="stat-label">Words in email</span><span class="stat-value">${present.filter(Boolean).length}</span></div>
        <div><span class="stat-label">Odds spam:ham</span><span class="stat-value">${(post.spam/Math.max(1e-9,post.ham)).toFixed(1)} : 1</span></div>
        <div><span class="stat-label">Assumption</span><span class="stat-value">naive independence</span></div>
      </div>`;
  }

  /* checkboxes live in the page; prior slider too */
  WORDS.forEach((word,i)=>{
    const cb = document.getElementById(`nb-word-${i}`);
    cb?.addEventListener('change',(e)=>{ present[i] = e.target.checked; draw(); });
  });
  document.getElementById('nb-prior')?.addEventListener('input',(e)=>{
    prior = parseFloat(e.target.value);
    const lbl = document.getElementById('nb-prior-label');
    if (lbl) lbl.textContent = 'P(spam) = ' + prior.toFixed(2);
    draw();
  });

  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initNaiveBayes;
