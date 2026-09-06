/* ML ATLAS — Logistic Regression interactive lab.
 * Two-class scatter, sigmoid probability curve ŷ = σ(β₀+β₁x), shaded class regions,
 * adjustable decision threshold, and parameter sliders. Simplified educational viz.
 */
export function initLogisticRegression(canvasId = 'lgr-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 50, XMAX = 10;
  let W = 0, H = 0;
  let b0 = -5.5, b1 = 1.1, thr = 0.5;
  let pts = [
    {x:1.2,y:0},{x:2.0,y:0},{x:2.8,y:0},{x:3.4,y:0},{x:4.0,y:0},{x:4.6,y:0},
    {x:5.4,y:1},{x:6.2,y:1},{x:7.0,y:1},{x:7.8,y:1},{x:8.6,y:1},{x:9.2,y:1},
  ];

  const px = (x) => M + (x / XMAX) * (W - 2 * M);
  const sig = (z) => 1 / (1 + Math.exp(-z));
  const prob = (x) => sig(b0 + b1 * x);
  /* invert σ to place the threshold marker on the x-axis: x = (logit(p) − β₀)/β₁ */
  const xAt = (p) => b1 === 0 ? XMAX/2 : (Math.log(p/(1-p)) - b0) / b1;

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    W = r.width; H = r.height;
    const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function accuracy() {
    const ok = pts.filter(p => (prob(p.x) >= thr ? 1 : 0) === p.y).length;
    return pts.length ? ok / pts.length : 0;
  }

  function draw() {
    if (!W) return;
    const midY = H / 2;
    ctx.clearRect(0,0,W,H);
    /* class regions: green where P≥thr, red where P<thr */
    const tx = px(Math.max(0, Math.min(XMAX, xAt(thr))));
    ctx.fillStyle = 'rgba(81,207,102,0.07)';
    ctx.fillRect(tx, M, W-M-tx, H-2*M);
    ctx.fillStyle = 'rgba(248,95,106,0.07)';
    ctx.fillRect(M, M, tx-M, H-2*M);
    /* grid */
    ctx.strokeStyle = css('--border') || '#334';
    ctx.lineWidth = 0.5;
    for (let i=0;i<=10;i++){
      ctx.beginPath(); ctx.moveTo(px(i),M); ctx.lineTo(px(i),H-M); ctx.stroke();
    }
    /* axes: x at probability 0.5 */
    ctx.strokeStyle = css('--text-secondary') || '#889';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(M,midY); ctx.lineTo(W-M,midY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(M,M); ctx.lineTo(M,H-M); ctx.stroke();
    ctx.fillStyle = css('--text-secondary') || '#889';
    ctx.font = '12px monospace';
    ctx.fillText('x →', W-M-24, midY+16);
    ctx.fillText('P(Y=1)', M-46, M-6);
    /* probability guides 0 / 1 */
    ctx.setLineDash([2,4]);
    ctx.beginPath(); ctx.moveTo(M,M+18); ctx.lineTo(W-M,M+18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(M,H-M-18); ctx.lineTo(W-M,H-M-18); ctx.stroke();
    ctx.setLineDash([]);
    /* sigmoid curve: p=0 at bottom, p=1 at top */
    ctx.strokeStyle = css('--accent-primary') || '#4f9';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i=0;i<=200;i++){
      const x = (i/200)*XMAX;
      const y = M+18 + (1-prob(x)) * (H-2*M-36);
      if (i===0) ctx.moveTo(px(x),y); else ctx.lineTo(px(x),y);
    }
    ctx.stroke();
    /* threshold: horizontal guide on curve + vertical drop to axis */
    const thY = M+18 + (1-thr)*(H-2*M-36);
    ctx.setLineDash([4,4]);
    ctx.strokeStyle = css('--accent-secondary') || '#f85';
    ctx.beginPath(); ctx.moveTo(M,thY); ctx.lineTo(W-M,thY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tx,thY); ctx.lineTo(tx,H-M); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = css('--accent-secondary') || '#f85';
    ctx.font = '11px monospace';
    ctx.fillText(`threshold ${thr.toFixed(2)} → x* = ${xAt(thr).toFixed(2)}`, M+8, thY-5);
    /* data points on the axis line */
    pts.forEach(p=>{
      ctx.fillStyle = css('--text-primary') || '#fff';
      ctx.strokeStyle = p.y===1 ? css('--accent-primary')||'#4f9' : css('--accent-secondary')||'#f85';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px(p.x), p.y===1 ? M+26 : H-M-26, 5, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();
    });
    info();
  }

  function info() {
    const el = document.getElementById('lgr-info');
    if (el) el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">β₀</span><span class="stat-value">${b0.toFixed(2)}</span></div>
        <div><span class="stat-label">β₁</span><span class="stat-value">${b1.toFixed(2)}</span></div>
        <div><span class="stat-label">P(x=5)</span><span class="stat-value">${prob(5).toFixed(3)}</span></div>
        <div><span class="stat-label">Accuracy</span><span class="stat-value">${(accuracy()*100).toFixed(0)}%</span></div>
      </div>`;
  }

  /* Left-click adds class 0, right-click (or shift-click) adds class 1. */
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(XMAX, (e.clientX-r.left-M)/(W-2*M)*XMAX));
    const cls = (e.button === 2 || e.shiftKey) ? 1 : 0;
    pts.push({x, y:cls});
    draw();
  });

  document.getElementById('lgr-b0')?.addEventListener('input', (e)=>{ b0 = parseFloat(e.target.value); draw(); });
  document.getElementById('lgr-b1')?.addEventListener('input', (e)=>{ b1 = parseFloat(e.target.value); draw(); });
  document.getElementById('lgr-thr')?.addEventListener('input', (e)=>{ thr = parseFloat(e.target.value); draw(); });
  document.getElementById('lgr-reset')?.addEventListener('click', ()=>{
    b0 = -5.5; b1 = 1.1; thr = 0.5;
    const a = document.getElementById('lgr-b0'), b = document.getElementById('lgr-b1'), t = document.getElementById('lgr-thr');
    if (a) a.value = b0; if (b) b.value = b1; if (t) t.value = thr;
    draw();
  });

  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initLogisticRegression;
