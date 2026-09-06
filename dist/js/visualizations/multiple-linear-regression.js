/* ML ATLAS — Multiple Linear Regression interactive lab.
 * A two-feature model ŷ = β₀ + β₁x₁ + β₂x₂. Drag the sliders to move the
 * query point (x₁, x₂); the plane's height (predicted y) updates live and the
 * heatmap shows how the prediction varies across the feature space.
 * Fitted on a small synthetic dataset via the normal equations.
 * Simplified educational viz.
 */
export function initMultipleLinearRegression(canvasId = 'mlr-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 48, MAX = 10;
  let W = 0, H = 0;
  let q = { x1: 5, x2: 5 };
  let beta = [0, 0, 0]; /* [β₀, β₁, β₂] */

  /* data with true β = [2, 1.2, −0.8] + noise */
  const N = 30;
  let data = [];
  function seed() {
    data = [];
    for (let i=0;i<N;i++) {
      const x1 = Math.random()*10, x2 = Math.random()*10;
      const y = 2 + 1.2*x1 - 0.8*x2 + (Math.random()-0.5)*2.5;
      data.push({x1, x2, y});
    }
    fitOLS();
  }

  function fitOLS() {
    /* 3×3 normal equations for [1, x1, x2] */
    const M3 = [
      [data.length, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    data.forEach(d=>{
      const f = [1, d.x1, d.x2];
      for (let i=0;i<3;i++) for (let j=0;j<3;j++) M3[i][j] += f[i]*f[j];
      for (let i=0;i<3;i++) M3[i][3] += f[i]*d.y;
    });
    /* Gaussian elimination */
    for (let col=0;col<3;col++){
      let piv = col;
      for (let r=col+1;r<3;r++) if (Math.abs(M3[r][col])>Math.abs(M3[piv][col])) piv=r;
      [M3[col],M3[piv]]=[M3[piv],M3[col]];
      for (let r=col+1;r<3;r++){
        const f = M3[r][col]/M3[col][col];
        for (let c=col;c<=3;c++) M3[r][c]-=f*M3[col][c];
      }
    }
    for (let i=2;i>=0;i--){
      let s = M3[i][3];
      for (let j=i+1;j<3;j++) s -= M3[i][j]*beta[j];
      beta[i] = s/M3[i][i];
    }
  }

  const predict = (x1,x2) => beta[0] + beta[1]*x1 + beta[2]*x2;

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
    /* heatmap of prediction across (x1, x2), red = low, blue = high */
    const N2 = 44;
    const cellW = (W-2*M)/N2, cellH = (H-2*M)/N2;
    let lo = Infinity, hi = -Infinity;
    const grid = [];
    for (let i=0;i<N2;i++){
      grid[i] = [];
      for (let j=0;j<N2;j++){
        const v = predict((i/N2)*MAX, ((N2-1-j)/N2)*MAX);
        grid[i][j] = v;
        if (v<lo) lo=v; if (v>hi) hi=v;
      }
    }
    for (let i=0;i<N2;i++) for (let j=0;j<N2;j++){
      const t = (grid[i][j]-lo)/((hi-lo)||1);
      const r = Math.round(248-140*t), g = Math.round(95+40*t), b = Math.round(106+150*t);
      ctx.fillStyle = `rgba(${r},${g},${b},0.28)`;
      ctx.fillRect(M+i*cellW, M+j*cellH, cellW+1, cellH+1);
    }
    /* grid + axes */
    ctx.strokeStyle = css('--border') || '#334';
    ctx.lineWidth = 0.5;
    for (let i=0;i<=10;i++){
      ctx.beginPath(); ctx.moveTo(M+i*(W-2*M)/10, M); ctx.lineTo(M+i*(W-2*M)/10, H-M); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(M, M+i*(H-2*M)/10); ctx.lineTo(W-M, M+i*(H-2*M)/10); ctx.stroke();
    }
    ctx.strokeStyle = css('--text-secondary') || '#889';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(M,H-M); ctx.lineTo(W-M,H-M); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(M,M); ctx.lineTo(M,H-M); ctx.stroke();
    ctx.fillStyle = css('--text-secondary') || '#889';
    ctx.font = '11px monospace';
    ctx.fillText('feature x₁ →', W-M-76, H-M+16);
    ctx.fillText('feature x₂ ↑', M+4, M-6);
    /* training points */
    data.forEach(d=>{
      ctx.fillStyle = css('--text-primary') || '#fff';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(M+(d.x1/MAX)*(W-2*M), H-M-(d.x2/MAX)*(H-2*M), 3, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    /* query crosshair */
    const qx = M+(q.x1/MAX)*(W-2*M), qy = H-M-(q.x2/MAX)*(H-2*M);
    ctx.strokeStyle = '#ff922b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(qx-10,qy); ctx.lineTo(qx+10,qy);
    ctx.moveTo(qx,qy-10); ctx.lineTo(qx,qy+10);
    ctx.stroke();
    info();
  }

  function info() {
    const el = document.getElementById('mlr-info');
    if (el) {
      const yhat = predict(q.x1, q.x2);
      const mse = data.reduce((s,d)=>s+(d.y-predict(d.x1,d.x2))**2,0)/data.length;
      el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">ŷ = β₀+β₁x₁+β₂x₂</span><span class="stat-value">${yhat.toFixed(2)}</span></div>
        <div><span class="stat-label">β₁ (x₁ effect)</span><span class="stat-value">${beta[1].toFixed(2)}</span></div>
        <div><span class="stat-label">β₂ (x₂ effect)</span><span class="stat-value">${beta[2].toFixed(2)}</span></div>
        <div><span class="stat-label">Train MSE</span><span class="stat-value">${mse.toFixed(2)}</span></div>
      </div>`;
    }
  }

  document.getElementById('mlr-x1')?.addEventListener('input',(e)=>{ q.x1 = parseFloat(e.target.value); draw(); });
  document.getElementById('mlr-x2')?.addEventListener('input',(e)=>{ q.x2 = parseFloat(e.target.value); draw(); });

  canvas.addEventListener('pointerdown',(e)=>{
    const r = canvas.getBoundingClientRect();
    q = {
      x1: Math.max(0, Math.min(MAX, (e.clientX-r.left-M)/(W-2*M)*MAX)),
      x2: Math.max(0, Math.min(MAX, MAX-(e.clientY-r.top-M)/(H-2*M)*MAX)),
    };
    const s1 = document.getElementById('mlr-x1'), s2 = document.getElementById('mlr-x2');
    if (s1) s1.value = q.x1; if (s2) s2.value = q.x2;
    draw();
  });

  seed();
  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initMultipleLinearRegression;
