/* ML ATLAS — Polynomial Regression interactive lab.
 * Noisy sine data fitted by ordinary least squares on the Vandermonde
 * expansion [1, x, x², …, xⁿ]. Degree slider shows underfit → good fit →
 * overfitting. Simplified educational viz.
 */
export function initPolynomialRegression(canvasId = 'pr-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 48, MAX = 10;
  let W = 0, H = 0, degree = 1;

  /* data: y = sin(x)·3 + 5 + noise, clipped into view */
  let pts = [];
  function seed() {
    pts = [];
    for (let i=0;i<16;i++){
      const x = 0.4 + (i/15)*9.2;
      const y = 5 + 3*Math.sin(x*0.9) + (Math.random()-0.5)*1.6;
      pts.push({ x, y: Math.max(0.3, Math.min(9.7, y)) });
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

  /* solve normal equations with Gaussian elimination on the (degree+1) system */
  function fitPoly(n) {
    const m = n+1;
    const A = Array.from({length:m},()=>new Array(m+1).fill(0));
    for (let i=0;i<m;i++){
      for (let j=0;j<m;j++){
        A[i][j] = pts.reduce((s,p)=>s+Math.pow(p.x,i+j),0);
      }
      A[i][m] = pts.reduce((s,p)=>s+p.y*Math.pow(p.x,i),0);
    }
    for (let col=0; col<m; col++){
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

  const evalPoly = (beta, x) => beta.reduce((s,b,i)=>s+b*Math.pow(x,i),0);

  function mse(beta) {
    return pts.reduce((s,p)=>s+(p.y-evalPoly(beta,p.x))**2,0)/pts.length;
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

    const beta = fitPoly(degree);
    if (beta) {
      /* fitted curve */
      ctx.strokeStyle = css('--accent-primary') || '#4f9';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      let started = false, clipped = false;
      for (let i=0;i<=300;i++){
        const x = (i/300)*MAX;
        const y = evalPoly(beta, x);
        if (y < -6 || y > 16) { clipped = true; started = false; continue; }
        if (!started) { ctx.moveTo(px(x),py(Math.max(-1,Math.min(11,y)))); started = true; }
        else ctx.lineTo(px(x),py(Math.max(-1,Math.min(11,y))));
      }
      ctx.stroke();
    }
    pts.forEach(p=>{
      ctx.fillStyle = css('--text-primary') || '#fff';
      ctx.strokeStyle = css('--accent-secondary') || '#f85';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(px(p.x),py(p.y),4.5,0,Math.PI*2);
      ctx.fill(); ctx.stroke();
    });
    info(beta);
  }

  function info(beta) {
    const el = document.getElementById('pr-info');
    if (el) {
      const m = beta ? beta.length : 0;
      el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">Degree n</span><span class="stat-value">${degree}</span></div>
        <div><span class="stat-label">Parameters</span><span class="stat-value">${m}</span></div>
        <div><span class="stat-label">Train MSE</span><span class="stat-value">${beta?mse(beta).toFixed(3):'—'}</span></div>
        <div><span class="stat-label">Warning</span><span class="stat-value">${degree>=8?'overfitting!':degree<=1?'underfitting':'balanced'}</span></div>
      </div>`;
    }
  }

  document.getElementById('pr-degree')?.addEventListener('input',(e)=>{
    degree = parseInt(e.target.value);
    const lbl = document.getElementById('pr-degree-label');
    if (lbl) lbl.textContent = 'degree n = ' + degree;
    draw();
  });
  document.getElementById('pr-reseed')?.addEventListener('click',()=>{ seed(); draw(); });

  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initPolynomialRegression;
