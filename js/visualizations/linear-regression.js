/* ML ATLAS — Linear Regression interactive lab.
 * Data points (click to add, drag to move), regression line with slope/intercept,
 * residuals, MSE readout, and a gradient-descent animation. Simplified educational viz.
 */
export function initLinearRegression(canvasId = 'lr-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 48, XMAX = 10, YMAX = 10;
  let W = 0, H = 0;
  let pts = [{x:1.2,y:2.1},{x:2.8,y:3.9},{x:4.5,y:5.2},{x:6.1,y:6.8},{x:7.6,y:8.0}];
  let b0 = 0, b1 = 1, gdTrail = [], anim = false, dragIdx = -1;

  const px = (x) => M + (x / XMAX) * (W - 2 * M);
  const py = (y) => H - M - (y / YMAX) * (H - 2 * M);

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    W = r.width; H = r.height;
    const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function mse() {
    return pts.length ? pts.reduce((s,p)=>s+(p.y-(b0+b1*p.x))**2,0)/pts.length : 0;
  }

  function fitOLS() {
    if (pts.length < 2) return;
    const n = pts.length;
    const sx = pts.reduce((a,p)=>a+p.x,0), sy = pts.reduce((a,p)=>a+p.y,0);
    const sxx = pts.reduce((a,p)=>a+p.x*p.x,0), sxy = pts.reduce((a,p)=>a+p.x*p.y,0);
    const den = n*sxx - sx*sx;
    if (!den) return;
    b1 = (n*sxy - sx*sy)/den;
    b0 = (sy - b1*sx)/n;
    syncSliders();
  }

  function draw() {
    if (!W) return;
    ctx.clearRect(0,0,W,H);
    // grid
    ctx.strokeStyle = css('--border') || '#334';
    ctx.lineWidth = 0.5;
    for (let i=0;i<=10;i++){
      ctx.beginPath(); ctx.moveTo(px(i),M); ctx.lineTo(px(i),H-M); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(M,py(i)); ctx.lineTo(W-M,py(i)); ctx.stroke();
    }
    // axes
    ctx.strokeStyle = css('--text-secondary') || '#889';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(M,H-M); ctx.lineTo(W-M,H-M); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(M,M); ctx.lineTo(M,H-M); ctx.stroke();
    ctx.fillStyle = css('--text-secondary') || '#889';
    ctx.font = '12px monospace';
    ctx.fillText('x →', W-M-24, H-M+16);
    ctx.fillText('y ↑', M-26, M+2);

    // residual lines
    if (document.getElementById('lr-residuals')?.checked) {
      ctx.strokeStyle = css('--accent-secondary') || '#f85';
      ctx.lineWidth = 1;
      pts.forEach(p=>{
        ctx.beginPath();
        ctx.moveTo(px(p.x),py(p.y));
        ctx.lineTo(px(p.x),py(b0+b1*p.x));
        ctx.stroke();
      });
    }
    // gradient-descent trail (translucent past fits)
    gdTrail.forEach((h,i)=>{
      ctx.globalAlpha = 0.08 + 0.3*(i/gdTrail.length);
      ctx.strokeStyle = css('--accent-secondary') || '#f85';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px(0),py(h.b0));
      ctx.lineTo(px(XMAX),py(h.b0+h.b1*XMAX));
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    // current fit line
    ctx.strokeStyle = css('--accent-primary') || '#4f9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px(0),py(b0));
    ctx.lineTo(px(XMAX),py(b0+b1*XMAX));
    ctx.stroke();
    // points
    pts.forEach(p=>{
      ctx.fillStyle = css('--text-primary') || '#fff';
      ctx.strokeStyle = css('--accent-primary') || '#4f9';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px(p.x),py(p.y),5,0,Math.PI*2);
      ctx.fill(); ctx.stroke();
    });
    info();
  }

  function info() {
    const el = document.getElementById('lr-info');
    if (el) el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">Slope β₁</span><span class="stat-value">${b1.toFixed(3)}</span></div>
        <div><span class="stat-label">Intercept β₀</span><span class="stat-value">${b0.toFixed(3)}</span></div>
        <div><span class="stat-label">MSE</span><span class="stat-value">${mse().toFixed(4)}</span></div>
        <div><span class="stat-label">Points</span><span class="stat-value">${pts.length}</span></div>
      </div>`;
    const sl = document.getElementById('lr-slope'), ic = document.getElementById('lr-intercept');
    if (sl && document.activeElement !== sl) sl.value = b1.toFixed(2);
    if (ic && document.activeElement !== ic) ic.value = b0.toFixed(2);
  }

  function syncSliders() {
    const sl = document.getElementById('lr-slope'), ic = document.getElementById('lr-intercept');
    if (sl) sl.value = b1.toFixed(2);
    if (ic) ic.value = b0.toFixed(2);
  }

  /* Gradient descent on MSE: β ← β − η∇J.
   * ∂J/∂b0 = −(2/n)Σ(y−ŷ); ∂J/∂b1 = −(2/n)Σ(y−ŷ)x */
  function runGD() {
    if (anim || pts.length < 2) return;
    anim = true;
    gdTrail = [];
    const lr = parseFloat(document.getElementById('lr-lr')?.value || '0.01');
    const iters = Math.min(parseInt(document.getElementById('lr-iters')?.value || '50'), 200);
    let t0 = 0, t1 = 0;
    const btn = document.getElementById('lr-gd-run');
    if (btn) btn.disabled = true;
    let i = 0;
    (function step() {
      if (i >= iters) { anim = false; if (btn) btn.disabled = false; draw(); return; }
      let g0 = 0, g1 = 0;
      pts.forEach(p => { const e = p.y - (t0 + t1*p.x); g0 -= 2*e; g1 -= 2*e*p.x; });
      g0 /= pts.length; g1 /= pts.length;
      t0 -= lr*g0; t1 -= lr*g1;
      b0 = t0; b1 = t1;
      gdTrail.push({b0:t0, b1:t1});
      if (gdTrail.length > 12) gdTrail.shift();
      i++;
      draw();
      setTimeout(step, 60);
    })();
  }

  const toX = (e) => { const r = canvas.getBoundingClientRect(); return Math.max(0, Math.min(XMAX, (e.clientX-r.left-M)/(W-2*M)*XMAX)); };
  const toY = (e) => { const r = canvas.getBoundingClientRect(); return Math.max(0, Math.min(YMAX, YMAX-(e.clientY-r.top-M)/(H-2*M)*YMAX)); };
  const toPx = (e) => { const r = canvas.getBoundingClientRect(); return {px: e.clientX-r.left, py: e.clientY-r.top}; };

  canvas.addEventListener('pointerdown', (e) => {
    const {px:mx, py:my} = toPx(e);
    dragIdx = pts.findIndex(p => Math.hypot(px(p.x)-mx, py(p.y)-my) < 12);
    if (dragIdx === -1) { pts.push({x:toX(e), y:toY(e)}); fitOLS(); }
    draw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (dragIdx === -1) return;
    pts[dragIdx] = {x:toX(e), y:toY(e)};
    fitOLS(); draw();
  });
  ['pointerup','pointercancel','pointerleave'].forEach(ev => canvas.addEventListener(ev, () => { dragIdx = -1; }));

  document.getElementById('lr-fit')?.addEventListener('click', () => { fitOLS(); draw(); });
  document.getElementById('lr-gd-run')?.addEventListener('click', runGD);
  document.getElementById('lr-slope')?.addEventListener('input', (e) => { b1 = parseFloat(e.target.value); draw(); });
  document.getElementById('lr-intercept')?.addEventListener('input', (e) => { b0 = parseFloat(e.target.value); draw(); });
  document.getElementById('lr-residuals')?.addEventListener('change', draw);

  new ResizeObserver(resize).observe(canvas);
  resize();
  fitOLS();
  draw();
}

export default initLinearRegression;
