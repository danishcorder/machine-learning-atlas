/* ML ATLAS — Lasso Regression interactive lab.
 * L1 paths via ISTA (iterative soft-thresholding): β ← S(β + Xᵀ(y−Xβ)/n, t·λ).
 * Unlike L2, the soft-threshold operator S produces EXACT zeros — watch
 * coefficients snap to zero as λ grows. Simplified educational viz.
 */
export function initLassoRegression(canvasId = 'la-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 46;
  let W = 0, H = 0, lambda = 0;

  const N = 24, P = 4;
  let X = [], y = [];
  function seed() {
    X = []; y = [];
    for (let i=0;i<N;i++){
      const a = Math.random()*10, b = a*0.85 + (Math.random()-0.5)*2.5, c = Math.random()*10;
      const d = c*0.8 + (Math.random()-0.5)*3;
      X.push([1, a, b, c, d]);
      y.push(2 + 1.6*a - 0.9*c + (Math.random()-0.5)*2); /* b,d are redundant */
    }
  }
  seed();

  const S = (z, t) => Math.abs(z) <= t ? 0 : z - Math.sign(z)*t; /* soft-threshold */

  function solveLasso(l) {
    let beta = new Array(P+1).fill(0);
    const t = l / (N * 40); /* step scaled for stability on this toy data */
    for (let it=0; it<400; it++) {
      const grad = new Array(P+1).fill(0);
      for (let j=0;j<=P;j++){
        let s = 0;
        for (let r=0;r<N;r++){
          let pred = 0;
          for (let k=0;k<=P;k++) pred += X[r][k]*beta[k];
          s += X[r][j]*(pred - y[r]);
        }
        grad[j] = s/N;
      }
      for (let j=0;j<=P;j++) {
        beta[j] = j===0 ? beta[j] - t*grad[j] : S(beta[j] - t*grad[j], t*l);
      }
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
    const beta = solveLasso(lambda);
    const coefs = beta.slice(1);
    const maxAbs = Math.max(1.2, ...coefs.map(Math.abs), 2.2);
    const n = coefs.length;
    const slot = (W-2*M)/n;
    const zeroY = H/2;
    const unit = (H/2 - M)/maxAbs;
    ctx.strokeStyle = css('--text-secondary') || '#889';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(M, zeroY); ctx.lineTo(W-M, zeroY); ctx.stroke();
    ctx.fillStyle = css('--text-muted') || '#888';
    ctx.font = '10px monospace';
    ctx.fillText('β = 0', M, zeroY-5);
    coefs.forEach((c,i)=>{
      const x = M + i*slot + slot*0.18;
      const w = slot*0.64;
      const zero = Math.abs(c) < 1e-8;
      const h = Math.abs(c)*unit;
      if (!zero) {
        ctx.fillStyle = c>=0 ? css('--accent-primary')||'#4f9' : css('--accent-secondary')||'#f85';
        ctx.fillRect(x, c>=0 ? zeroY-h : zeroY, w, h);
        ctx.strokeStyle = css('--text-primary') || '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, c>=0 ? zeroY-h : zeroY, w, h);
      } else {
        /* exactly zero: hollow outline to celebrate sparsity */
        ctx.strokeStyle = css('--accent-secondary') || '#f85';
        ctx.setLineDash([3,3]);
        ctx.strokeRect(x, zeroY-10, w, 20);
        ctx.setLineDash([]);
      }
      ctx.fillStyle = css('--text-secondary') || '#889';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('x'+(i+1), x+w/2, H-M+14);
      ctx.fillStyle = css('--text-primary') || '#fff';
      ctx.fillText(zero ? '0.00' : c.toFixed(2), x+w/2, zero ? zeroY+34 : (c>=0 ? zeroY-h-6 : zeroY+h+13));
      ctx.textAlign = 'left';
    });
    info(beta[0], coefs);
  }

  function info(intercept, coefs) {
    const el = document.getElementById('la-info');
    if (el) {
      const zeros = coefs.filter(c=>Math.abs(c)<1e-8).length;
      const l1 = coefs.reduce((s,c)=>s+Math.abs(c),0);
      el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">λ</span><span class="stat-value">${lambda.toFixed(1)}</span></div>
        <div><span class="stat-label">‖β‖₁</span><span class="stat-value">${l1.toFixed(2)}</span></div>
        <div><span class="stat-label">Exact zeros</span><span class="stat-value">${zeros} / ${coefs.length}</span></div>
        <div><span class="stat-label">Features kept</span><span class="stat-value">${coefs.length - zeros}</span></div>
      </div>`;
    }
  }

  document.getElementById('la-lambda')?.addEventListener('input',(e)=>{
    lambda = parseFloat(e.target.value);
    const lbl = document.getElementById('la-lambda-label');
    if (lbl) lbl.textContent = 'λ = ' + lambda.toFixed(1);
    draw();
  });
  document.getElementById('la-reseed')?.addEventListener('click',()=>{ seed(); draw(); });

  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initLassoRegression;
