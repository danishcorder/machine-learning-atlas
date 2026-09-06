/* ML ATLAS — Ridge Regression interactive lab.
 * Coefficient shrinkage paths: β(λ) = (XᵀX + λI)⁻¹Xᵀy solved exactly for a
 * grid of λ values. Bars show every coefficient shrinking smoothly toward
 * zero (L2 never makes them exactly zero). Simplified educational viz.
 */
export function initRidgeRegression(canvasId = 'ri-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 46;
  let W = 0, H = 0, lambda = 0;

  /* correlated 4-feature design matrix, n=24 */
  const N = 24, P = 4;
  let X = [], y = [];
  function seed() {
    X = []; y = [];
    for (let i=0;i<N;i++){
      const a = Math.random()*10, b = a*0.8 + (Math.random()-0.5)*3, c = Math.random()*10;
      const d = b*0.7 + (Math.random()-0.5)*3;
      X.push([1, a, b, c, d]); /* column 0 = intercept */
      y.push(2 + 1.5*a + 0.5*b - 0.8*c + 0.3*d + (Math.random()-0.5)*2);
    }
  }
  seed();

  /* normal equations with ridge: (XᵀX + λI) β = Xᵀy */
  function solveRidge(l) {
    const m = P+1;
    const A = Array.from({length:m},()=>new Array(m+1).fill(0));
    for (let i=0;i<m;i++){
      for (let j=0;j<m;j++){
        let s = 0;
        for (let r=0;r<N;r++) s += X[r][i]*X[r][j];
        A[i][j] = s + (i===j && i>0 ? l : 0); /* do not penalise intercept */
      }
      let sy = 0;
      for (let r=0;r<N;r++) sy += X[r][i]*y[r];
      A[i][m] = sy;
    }
    for (let col=0;col<m;col++){
      let piv = col;
      for (let r=col+1;r<m;r++) if (Math.abs(A[r][col])>Math.abs(A[piv][col])) piv=r;
      [A[col],A[piv]]=[A[piv],A[col]];
      if (Math.abs(A[col][col])<1e-12) return null;
      for (let r=col+1;r<m;r++){
        const f = A[r][col]/A[col][col];
        for (let c=col;c<=m;c++) A[r][c]-=f*A[col][c];
      }
    }
    const beta = new Array(m).fill(0);
    for (let i=m-1;i>=0;i--){
      let s = A[i][m];
      for (let j=i+1;j<m;j++) s -= A[i][j]*beta[j];
      beta[i] = s/A[i][i];
    }
    return beta;
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    W = r.width; H = r.height;
    const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    if (!W) return;
    ctx.clearRect(0,0,W,H);
    const beta = solveRidge(lambda);
    if (!beta) return;
    const coefs = beta.slice(1); /* exclude intercept */
    const maxAbs = Math.max(1.2, ...coefs.map(Math.abs), 2.2);
    const n = coefs.length;
    const slot = (W-2*M)/n;
    const zeroY = H/2;
    const unit = (H/2 - M) / maxAbs;
    /* zero line */
    ctx.strokeStyle = css('--text-secondary') || '#889';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(M, zeroY); ctx.lineTo(W-M, zeroY); ctx.stroke();
    ctx.fillStyle = css('--text-muted') || '#888';
    ctx.font = '10px monospace';
    ctx.fillText('β = 0', M, zeroY-5);
    coefs.forEach((c,i)=>{
      const x = M + i*slot + slot*0.18;
      const w = slot*0.64;
      const h = Math.abs(c)*unit;
      ctx.fillStyle = c>=0 ? css('--accent-primary')||'#4f9' : css('--accent-secondary')||'#f85';
      ctx.fillRect(x, c>=0 ? zeroY-h : zeroY, w, h);
      ctx.strokeStyle = css('--text-primary') || '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, c>=0 ? zeroY-h : zeroY, w, h);
      ctx.fillStyle = css('--text-secondary') || '#889';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('x'+(i+1), x+w/2, H-M+14);
      ctx.fillStyle = css('--text-primary') || '#fff';
      ctx.fillText(c.toFixed(2), x+w/2, (c>=0 ? zeroY-h-6 : zeroY+h+13));
      ctx.textAlign = 'left';
    });
    info(beta[0], coefs);
  }

  function info(intercept, coefs) {
    const el = document.getElementById('ri-info');
    if (el) {
      const l2 = Math.sqrt(coefs.reduce((s,c)=>s+c*c,0));
      el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">λ</span><span class="stat-value">${lambda.toFixed(1)}</span></div>
        <div><span class="stat-label">‖β‖₂</span><span class="stat-value">${l2.toFixed(2)}</span></div>
        <div><span class="stat-label">Intercept</span><span class="stat-value">${intercept.toFixed(2)}</span></div>
        <div><span class="stat-label">Exact zeros</span><span class="stat-value">0 (never for L2)</span></div>
      </div>`;
    }
  }

  document.getElementById('ri-lambda')?.addEventListener('input',(e)=>{
    lambda = parseFloat(e.target.value);
    const lbl = document.getElementById('ri-lambda-label');
    if (lbl) lbl.textContent = 'λ = ' + lambda.toFixed(1);
    draw();
  });
  document.getElementById('ri-reseed')?.addEventListener('click',()=>{ seed(); draw(); });

  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initRidgeRegression;
