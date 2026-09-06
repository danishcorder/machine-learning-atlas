/* ML ATLAS — K-Nearest Neighbors interactive lab.
 * Two classes, a draggable query point, distance lines to every point,
 * highlighted k nearest neighbours and the resulting majority vote. Simplified viz.
 */
export function initKNN(canvasId = 'knn-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 48, MAX = 10;
  let W = 0, H = 0, k = 3, dragQ = false;
  const COL = { A: '#4f9dff', B: '#ff5f6a' };
  let pts = [
    {x:1.5,y:2.0,c:'A'},{x:2.2,y:3.2,c:'A'},{x:3.0,y:2.4,c:'A'},{x:1.8,y:8.4,c:'B'},
    {x:2.6,y:7.6,c:'B'},{x:1.2,y:6.8,c:'B'},{x:8.4,y:2.2,c:'B'},{x:9.0,y:3.4,c:'B'},
    {x:7.6,y:1.6,c:'B'},{x:8.2,y:7.8,c:'A'},{x:7.4,y:8.6,c:'A'},{x:9.0,y:7.2,c:'A'},
    {x:5.0,y:5.0,c:'A'},{x:4.4,y:4.2,c:'B'},
  ];
  let query = { x: 5.6, y: 3.4 };

  const px = (v) => M + (v / MAX) * (W - 2 * M);
  const py = (v) => H - M - (v / MAX) * (H - 2 * M);
  const dist = (a,b) => Math.hypot(a.x-b.x, a.y-b.y);

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    W = r.width; H = r.height;
    const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function nearest() {
    return pts.map((p,i)=>({p,i,d:dist(p,query)})).sort((a,b)=>a.d-b.d).slice(0,k);
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

    const near = nearest();
    const nearSet = new Set(near.map(n=>n.i));
    /* distance lines — solid for chosen neighbours, faint otherwise */
    pts.forEach((p,i)=>{
      ctx.strokeStyle = nearSet.has(i)
        ? (css('--accent-primary') || '#4f9')
        : (css('--text-muted') || '#555');
      ctx.lineWidth = nearSet.has(i) ? 2 : 0.8;
      ctx.setLineDash(nearSet.has(i) ? [] : [2,3]);
      ctx.beginPath();
      ctx.moveTo(px(query.x),py(query.y));
      ctx.lineTo(px(p.x),py(p.y));
      ctx.stroke();
      if (nearSet.has(i)) {
        ctx.setLineDash([]);
        ctx.fillStyle = css('--text-secondary') || '#889';
        ctx.font = '10px monospace';
        const mx = (px(query.x)+px(p.x))/2, my = (py(query.y)+py(p.y))/2;
        ctx.fillText(near.find(n=>n.i===i).d.toFixed(2), mx+3, my-3);
      }
    });
    ctx.setLineDash([]);
    /* points */
    pts.forEach((p,i)=>{
      const isN = nearSet.has(i);
      ctx.fillStyle = COL[p.c];
      ctx.strokeStyle = css('--text-primary') || '#fff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px(p.x),py(p.y),isN?7:5,0,Math.PI*2);
      ctx.fill(); ctx.stroke();
      if (isN) {
        ctx.strokeStyle = css('--accent-primary') || '#4f9';
        ctx.setLineDash([3,3]);
        ctx.beginPath();
        ctx.arc(px(p.x),py(p.y),11,0,Math.PI*2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
    /* query point (diamond cross-hair) */
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#ff922b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px(query.x),py(query.y),8,0,Math.PI*2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px(query.x)-12,py(query.y)); ctx.lineTo(px(query.x)+12,py(query.y));
    ctx.moveTo(px(query.x),py(query.y)-12); ctx.lineTo(px(query.x),py(query.y)+12);
    ctx.stroke();
    info(near);
  }

  function info(near) {
    const vA = near.filter(n=>n.p.c==='A').length;
    const vB = near.filter(n=>n.p.c==='B').length;
    const res = vA>vB ? 'Class A' : vB>vA ? 'Class B' : 'Tie';
    const el = document.getElementById('knn-info');
    if (el) el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">k</span><span class="stat-value">${k}</span></div>
        <div><span class="stat-label">Votes A</span><span class="stat-value">${vA}</span></div>
        <div><span class="stat-label">Votes B</span><span class="stat-value">${vB}</span></div>
        <div><span class="stat-label">Prediction</span><span class="stat-value">${res}</span></div>
      </div>`;
  }

  const toQ = (e) => {
    const r = canvas.getBoundingClientRect();
    query = {
      x: Math.max(0, Math.min(MAX, (e.clientX-r.left-M)/(W-2*M)*MAX)),
      y: Math.max(0, Math.min(MAX, MAX-(e.clientY-r.top-M)/(H-2*M)*MAX)),
    };
  };

  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    if (Math.hypot(px(query.x)-(e.clientX-r.left), py(query.y)-(e.clientY-r.top)) < 16) {
      dragQ = true;
    } else {
      /* click empty space: drop a new point of the class chosen in the select */
      const cls = document.getElementById('knn-add-class')?.value || 'A';
      toQ(e);
      pts.push({x:query.x, y:query.y, c:cls});
    }
    draw();
  });
  canvas.addEventListener('pointermove', (e) => { if (dragQ) { toQ(e); draw(); } });
  ['pointerup','pointercancel','pointerleave'].forEach(ev => canvas.addEventListener(ev, () => { dragQ = false; }));

  document.getElementById('knn-k')?.addEventListener('input', (e) => {
    k = Math.max(1, Math.min(9, parseInt(e.target.value)));
    const lbl = document.getElementById('knn-k-label');
    if (lbl) lbl.textContent = 'k = ' + k;
    draw();
  });
  document.getElementById('knn-reset')?.addEventListener('click', () => {
    query = { x: 5.6, y: 3.4 };
    draw();
  });

  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initKNN;
