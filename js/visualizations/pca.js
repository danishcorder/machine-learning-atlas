/* ML ATLAS — PCA interactive lab.
 * Correlated 2-D dataset. The covariance matrix is eigendecomposed (closed form
 * for 2×2) to find the principal directions; the projection onto PC1 is shown
 * together with the explained-variance ratio. Simplified educational viz.
 */
export function initPCA(canvasId = 'pca-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 48, MAX = 10;
  let W = 0, H = 0;
  let showProj = true, showPC2 = false;

  /* correlated Gaussian-ish cloud */
  let pts = [];
  function seed() {
    pts = [];
    for (let i=0;i<60;i++){
      const t = (Math.random()-0.5)*7;
      const x = 5 + t + (Math.random()-0.5)*1.6;
      const y = 5 + 0.72*t + (Math.random()-0.5)*1.6;
      pts.push({x: Math.max(0.5,Math.min(9.5,x)), y: Math.max(0.5,Math.min(9.5,y))});
    }
  }
  seed();

  const px = (v) => M + (v/MAX)*(W-2*M);
  const py = (v) => H-M - (v/MAX)*(H-2*M);

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    W = r.width; H = r.height;
    const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  /* covariance matrix of centred data */
  function cov() {
    const mx = pts.reduce((s,p)=>s+p.x,0)/pts.length;
    const my = pts.reduce((s,p)=>s+p.y,0)/pts.length;
    let c11=0,c12=0,c22=0;
    pts.forEach(p=>{ c11+=(p.x-mx)**2; c12+=(p.x-mx)*(p.y-my); c22+=(p.y-my)**2; });
    const n = pts.length-1;
    return { c11:c11/n, c12:c12/n, c22:c22/n, mx, my };
  }

  /* analytic eigenvalues/eigenvectors of symmetric 2×2 [[a,b],[b,d]] */
  function eig(C) {
    const tr = C.c11 + C.c22;
    const det = C.c11*C.c22 - C.c12*C.c12;
    const disc = Math.max(0, (tr/2)**2 - det);
    const l1 = tr/2 + Math.sqrt(disc);
    const l2 = Math.max(0, tr/2 - Math.sqrt(disc));
    const vecFor = (l) => {
      /* (a−λ)v1 + b·v2 = 0 → v = (b, λ−a) or (λ−d, b), normalised */
      let v1, v2;
      if (Math.abs(C.c12) > 1e-9) { v1 = l - C.c22; v2 = C.c12; }
      else { v1 = 1; v2 = 0; }
      const n = Math.hypot(v1,v2) || 1;
      return { x: v1/n, y: v2/n };
    };
    return { l1, l2, v1: vecFor(l1), v2: vecFor(l2) };
  }

  function draw() {
    if (!W) return;
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle = css('--border') || '#334';
    ctx.lineWidth = 0.5;
    for (let i=0;i<=10;i++){
      ctx.beginPath(); ctx.moveTo(px(i),M); ctx.lineTo(px(i),H-M); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(M,py(i)); ctx.lineTo(W-M,py(i)); ctx.stroke();
    }
    ctx.strokeStyle = css('--text-secondary') || '#889';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(M,H-M); ctx.lineTo(W-M,H-M); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(M,M); ctx.lineTo(M,H-M); ctx.stroke();

    const C = cov();
    const E = eig(C);
    const scale = 2.6;

    /* PC2 (dashed) */
    if (showPC2) {
      ctx.strokeStyle = css('--text-muted') || '#777';
      ctx.setLineDash([5,5]);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(px(C.mx - E.v2.x*scale), py(C.my - E.v2.y*scale));
      ctx.lineTo(px(C.mx + E.v2.x*scale), py(C.my + E.v2.y*scale));
      ctx.stroke();
      ctx.setLineDash([]);
    }
    /* PC1 (solid, glowing) */
    ctx.strokeStyle = css('--accent-primary') || '#4f9';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(px(C.mx - E.v1.x*scale), py(C.my - E.v1.y*scale));
    ctx.lineTo(px(C.mx + E.v1.x*scale), py(C.my + E.v1.y*scale));
    ctx.stroke();
    /* arrow head */
    const ax = px(C.mx + E.v1.x*scale), ay = py(C.my + E.v1.y*scale);
    ctx.fillStyle = css('--accent-primary') || '#4f9';
    ctx.beginPath();
    ctx.arc(ax, ay, 4, 0, Math.PI*2);
    ctx.fill();
    ctx.font = '11px monospace';
    ctx.fillText('PC1', ax+6, ay-6);

    /* projection lines onto PC1 */
    if (showProj) {
      ctx.strokeStyle = 'rgba(255,210,66,0.5)';
      ctx.lineWidth = 1;
      pts.forEach(p=>{
        const t = (p.x-C.mx)*E.v1.x + (p.y-C.my)*E.v1.y; /* scalar projection */
        const q = { x: C.mx + E.v1.x*t, y: C.my + E.v1.y*t };
        ctx.beginPath();
        ctx.moveTo(px(p.x),py(p.y));
        ctx.lineTo(px(q.x),py(q.y));
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,210,66,0.75)';
        ctx.beginPath();
        ctx.arc(px(q.x),py(q.y),2,0,Math.PI*2);
        ctx.fill();
      });
    }
    /* data points */
    pts.forEach(p=>{
      ctx.fillStyle = css('--text-primary') || '#fff';
      ctx.strokeStyle = css('--accent-secondary') || '#f85';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px(p.x),py(p.y),4,0,Math.PI*2);
      ctx.fill(); ctx.stroke();
    });
    info(E);
  }

  function info(E) {
    const total = E.l1 + E.l2 || 1;
    const el = document.getElementById('pca-info');
    if (el) el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">λ₁</span><span class="stat-value">${E.l1.toFixed(2)}</span></div>
        <div><span class="stat-label">λ₂</span><span class="stat-value">${E.l2.toFixed(2)}</span></div>
        <div><span class="stat-label">Var. explained (PC1)</span><span class="stat-value">${(100*E.l1/total).toFixed(1)}%</span></div>
        <div><span class="stat-label">Dims kept</span><span class="stat-value">2 → 1</span></div>
      </div>`;
  }

  document.getElementById('pca-proj')?.addEventListener('change', (e)=>{ showProj = e.target.checked; draw(); });
  document.getElementById('pca-pc2')?.addEventListener('change', (e)=>{ showPC2 = e.target.checked; draw(); });
  document.getElementById('pca-reseed')?.addEventListener('click', ()=>{ seed(); draw(); });

  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initPCA;
