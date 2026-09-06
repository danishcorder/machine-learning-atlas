/* ML ATLAS — SVM interactive lab.
 * Hard-margin style training via gradient descent on the hinge-loss objective
 *   J(w,b) = ½‖w‖² + C·Σ max(0, 1 − yᵢ(w·xᵢ+b)),  yᵢ ∈ {−1, +1}.
 * Draws the hyperplane w·x+b=0, the margin band w·x+b=±1 and highlights the
 * support vectors (points with functional margin ≤ ~1.1). Simplified educational viz.
 */
export function initSVM(canvasId = 'svm-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 48, MAX = 10;
  let W = 0, H = 0, running = false, epoch = 0;
  let pts = [
    {x:2.0,y:2.2,c:-1},{x:3.0,y:1.8,c:-1},{x:2.2,y:3.4,c:-1},{x:3.4,y:3.0,c:-1},{x:1.6,y:2.8,c:-1},
    {x:7.0,y:7.4,c:1},{x:8.0,y:6.6,c:1},{x:7.4,y:8.4,c:1},{x:8.6,y:7.6,c:1},{x:6.6,y:6.8,c:1},
  ];
  let w = { x: 0.1, y: -0.1 }, b = 0, trail = [];

  const px = (v) => M + (v / MAX) * (W - 2 * M);
  const py = (v) => H - M - (v / MAX) * (H - 2 * M);
  const fn = (p) => w.x*p.x + w.y*p.y + b;

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    W = r.width; H = r.height;
    const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function trainStep(C) {
    const lr = 0.01;
    let gw = { x: w.x, y: w.y }, gb = 0;
    pts.forEach(p => {
      const margin = p.c * fn(p);
      if (margin < 1) { /* hinge active: point violates or sits inside margin */
        gw.x -= C * p.c * p.x; gw.y -= C * p.c * p.y; gb -= C * p.c;
      }
    });
    w.x -= lr * gw.x; w.y -= lr * gw.y; b -= lr * gb;
    const norm = Math.hypot(w.x, w.y) || 1e-9;
    if (norm > 4) { w.x *= 4/norm; w.y *= 4/norm; } /* keep drawing sane */
    trail.push({ w: { ...w }, b });
    if (trail.length > 10) trail.shift();
    epoch++;
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

    const norm = Math.hypot(w.x, w.y);
    /* margin band ±1 (in functional-margin units) drawn as translucent strip */
    if (norm > 1e-6 && Math.abs(w.y) > 1e-6) {
      const lineY = (x, off) => (-w.x*x - b + off) / w.y;
      ctx.fillStyle = 'rgba(79,157,255,0.06)';
      ctx.beginPath();
      ctx.moveTo(px(0), py(Math.max(-2,Math.min(12,lineY(0, 1)))));
      ctx.lineTo(px(MAX), py(Math.max(-2,Math.min(12,lineY(MAX, 1)))));
      ctx.lineTo(px(MAX), py(Math.max(-2,Math.min(12,lineY(MAX, -1)))));
      ctx.lineTo(px(0), py(Math.max(-2,Math.min(12,lineY(0, -1)))));
      ctx.closePath(); ctx.fill();
    }
    /* hyperplane w·x+b = 0 and dashed margins ±1 */
    if (Math.abs(w.y) > 1e-6) {
      const y0 = (-w.x*0 - b)/w.y, y1 = (-w.x*MAX - b)/w.y;
      ctx.strokeStyle = css('--accent-primary') || '#4f9';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px(0),py(y0)); ctx.lineTo(px(MAX),py(y1)); ctx.stroke();
      ctx.setLineDash([5,4]);
      ctx.lineWidth = 1.2;
      [1,-1].forEach(off=>{
        const a0 = (-w.x*0 - b + off)/w.y, a1 = (-w.x*MAX - b + off)/w.y;
        ctx.beginPath(); ctx.moveTo(px(0),py(a0)); ctx.lineTo(px(MAX),py(a1)); ctx.stroke();
      });
      ctx.setLineDash([]);
    }
    /* support vectors get a ring */
    const sv = new Set(supportVectors());
    pts.forEach(p=>{
      ctx.fillStyle = p.c===1 ? (css('--accent-primary')||'#4f9') : (css('--accent-secondary')||'#f85');
      ctx.strokeStyle = css('--text-primary') || '#fff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px(p.x),py(p.y),sv.has(p)?8:6,0,Math.PI*2);
      ctx.fill(); ctx.stroke();
      if (sv.has(p)) {
        ctx.strokeStyle = '#ffd43b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px(p.x),py(p.y),12,0,Math.PI*2);
        ctx.stroke();
      }
    });
    info(norm, sv.size);
  }


  function info(norm, nSV) {
    const el = document.getElementById('svm-info');
    if (el) el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">Epoch</span><span class="stat-value">${epoch}</span></div>
        <div><span class="stat-label">‖w‖ (margin⁻¹)</span><span class="stat-value">${norm.toFixed(2)}</span></div>
        <div><span class="stat-label">Margin 2/‖w‖</span><span class="stat-value">${norm>1e-6?(2/norm).toFixed(2):'—'}</span></div>
        <div><span class="stat-label">Support vectors</span><span class="stat-value">${nSV}</span></div>
      </div>`;
  }

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('pointerdown', (e) => {
    if (running) return;
    const r = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(MAX, (e.clientX-r.left-M)/(W-2*M)*MAX));
    const y = Math.max(0, Math.min(MAX, MAX-(e.clientY-r.top-M)/(H-2*M)*MAX));
    const c = (e.button===2 || e.shiftKey) ? 1 : -1;
    pts.push({x, y, c});
    draw();
  });

  function animate() {
    if (!running) return;
    const C = parseFloat(document.getElementById('svm-c')?.value || '5');
    trainStep(C);
    draw();
    if (epoch < 120) setTimeout(animate, 60);
    else { running = false; const btn = document.getElementById('svm-run'); if (btn) btn.textContent = '↻ Retrain'; }
  }

  document.getElementById('svm-run')?.addEventListener('click', () => {
    if (running) { running = false; return; }
    w = { x: 0.1, y: -0.1 }; b = 0; epoch = 0; trail = [];
    running = true;
    const btn = document.getElementById('svm-run');
    if (btn) btn.textContent = '■ Stop';
    animate();
  });
  document.getElementById('svm-reset')?.addEventListener('click', () => {
    running = false;
    w = { x: 0.1, y: -0.1 }; b = 0; epoch = 0; trail = [];
    draw();
  });

  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initSVM;

  function loss(C) {
    return 0.5*(w.x**2 + w.y**2) + C*pts.reduce((s,p)=>s+Math.max(0,1-p.c*fn(p)),0);
  }

  function supportVectors() {
    return pts.filter(p => Math.abs(p.c*fn(p)) <= 1.1);
  }
