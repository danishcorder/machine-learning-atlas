/* ML ATLAS — Random Forest interactive lab.
 * Five depth-1 stumps are grown on bootstrap samples (with random feature
 * choice, as in bagging). Drag the query point to see each tree vote and the
 * forest's majority decision. Simplified educational viz.
 */
export function initRandomForest(canvasId = 'rf-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 44, MAX = 10;
  let W = 0, H = 0;
  let query = { x: 5.2, y: 4.4 }, dragQ = false;

  const raw = [
    {x:1.5,y:2.0,c:0},{x:2.4,y:3.1,c:0},{x:3.2,y:1.8,c:0},{x:1.9,y:4.4,c:0},
    {x:7.8,y:7.9,c:1},{x:8.6,y:6.8,c:1},{x:7.2,y:8.8,c:1},{x:8.9,y:8.2,c:1},
    {x:6.4,y:2.0,c:0},{x:2.2,y:8.2,c:1},{x:8.4,y:1.8,c:0},{x:3.0,y:7.4,c:1},
  ];

  /* depth-1 stump: choose feature (bootstrap noise via sampling rows),
     threshold = midpoint of the two class means on that feature */
  function buildStump() {
    const boot = [];
    for (let i=0;i<raw.length;i++) boot.push(raw[Math.floor(Math.random()*raw.length)]);
    const f = Math.random() < 0.5 ? 'x' : 'y';
    const m0 = boot.filter(r=>r.c===0).reduce((s,r)=>s+r[f],0)/Math.max(1,boot.filter(r=>r.c===0).length);
    const m1 = boot.filter(r=>r.c===1).reduce((s,r)=>s+r[f],0)/Math.max(1,boot.filter(r=>r.c===1).length);
    return { f, t: (m0+m1)/2, side: m1 > m0 ? 1 : -1, boot };
  }
  let forest = [];
  function buildForest() {
    forest = Array.from({length:5}, buildStump);
  }
  const stumpVote = (s, q) => (s.side===1 ? (q[s.f] > s.t ? 1 : 0) : (q[s.f] > s.t ? 0 : 1));

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
    /* left panel: scatter; right panel: vote boxes */
    const panelW = Math.min(W*0.55, W-220);
    const gap = 18;
    const votes = forest.map(s=>stumpVote(s,query));
    const ones = votes.filter(v=>v===1).length;
    const pred = ones >= 3 ? 1 : 0;

    /* scatter panel */
    const px = (v) => M + (v/MAX)*(panelW-M*2);
    const py = (v) => H-M - (v/MAX)*(H-M*2);
    ctx.strokeStyle = css('--border') || '#334';
    ctx.lineWidth = 0.5;
    for (let i=0;i<=10;i++){
      ctx.beginPath(); ctx.moveTo(px(i),M); ctx.lineTo(px(i),H-M); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(M,py(i)); ctx.lineTo(W-M,py(i)); ctx.stroke();
    }
    ctx.strokeStyle = css('--text-secondary') || '#889';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(M,H-M); ctx.lineTo(panelW-M,H-M); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(M,M); ctx.lineTo(M,H-M); ctx.stroke();
    ctx.fillStyle = css('--text-muted') || '#888';
    ctx.font = '10px monospace';
    ctx.fillText('feature x₁ →', panelW-M-64, H-M+14);
    ctx.fillText('x₂ ↑', M-24, M+4);
    /* stump split lines (dashed, in feature space) */
    forest.forEach((s,idx)=>{
      ctx.strokeStyle = 'rgba(255,210,66,0.35)';
      ctx.setLineDash([3,4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (s.f==='x'){ ctx.moveTo(px(s.t),M); ctx.lineTo(px(s.t),H-M); }
      else { ctx.moveTo(M,py(s.t)); ctx.lineTo(panelW-M,py(s.t)); }
      ctx.stroke();
      ctx.setLineDash([]);
    });
    raw.forEach(p=>{
      ctx.fillStyle = p.c===1 ? css('--accent-primary')||'#4f9' : css('--accent-secondary')||'#f85';
      ctx.strokeStyle = css('--text-primary') || '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(px(p.x),py(p.y),4.5,0,Math.PI*2); ctx.fill(); ctx.stroke();
    });
    /* query */
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#ff922b';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(px(query.x),py(query.y),7,0,Math.PI*2); ctx.fill(); ctx.stroke();

    /* vote panel: one row per tree */
    const bx = panelW + gap, bw = W - bx - M;
    if (bw > 120) {
      const rowH = (H - M*2) / 6;
      ctx.font = '11px monospace';
      forest.forEach((s,i)=>{
        const y = M + i*rowH;
        const v = votes[i];
        ctx.fillStyle = css('--text-secondary') || '#889';
        ctx.fillText(`tree ${i+1} · ${s.f==='x'?'x₁':'x₂'}>${s.t.toFixed(1)}`, bx, y+rowH/2-4);
        /* vote bar */
        const barY = y + rowH/2 + 2;
        ctx.fillStyle = v===1 ? css('--accent-primary')||'#4f9' : css('--accent-secondary')||'#f85';
        ctx.fillRect(bx, barY, bw*(2/3), 6);
        ctx.fillStyle = css('--text-muted') || '#888';
        ctx.fillText(v===1 ? 'APPROVE' : 'REJECT', bx + bw*(2/3) + 8, barY+6);
      });
      /* final decision box */
      const fy = M + 5*rowH;
      ctx.fillStyle = pred===1 ? 'rgba(79,157,255,0.15)' : 'rgba(248,95,106,0.15)';
      ctx.strokeStyle = pred===1 ? css('--accent-primary')||'#4f9' : css('--accent-secondary')||'#f85';
      ctx.lineWidth = 1.5;
      ctx.fillRect(bx, fy, bw, rowH-8);
      ctx.strokeRect(bx, fy, bw, rowH-8);
      ctx.fillStyle = pred===1 ? css('--accent-primary')||'#4f9' : css('--accent-secondary')||'#f85';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`MAJORITY ${ones}/5 → ${pred===1?'APPROVE':'REJECT'}`, bx+10, fy+rowH/2+1);
    }
    info(ones, pred);
  }

  function info(ones, pred) {
    const el = document.getElementById('rf-info');
    if (el) el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">Trees</span><span class="stat-value">5</span></div>
        <div><span class="stat-label">Votes → 1</span><span class="stat-value">${ones}/5</span></div>
        <div><span class="stat-label">Forest decision</span><span class="stat-value">${pred===1?'APPROVE':'REJECT'}</span></div>
        <div><span class="stat-label">Rebuilt samples</span><span class="stat-value">bootstrap</span></div>
      </div>`;
  }

  const toQ = (e) => {
    const r = canvas.getBoundingClientRect();
    const panelW = Math.min(r.width*0.55, r.width-220);
    query = {
      x: Math.max(0, Math.min(MAX, (e.clientX-r.left-M)/(panelW-M*2)*MAX)),
      y: Math.max(0, Math.min(MAX, MAX-(e.clientY-r.top-M)/(r.height-M*2)*MAX)),
    };
  };
  canvas.addEventListener('pointerdown', (e) => { dragQ = true; toQ(e); draw(); });
  canvas.addEventListener('pointermove', (e) => { if (dragQ) { toQ(e); draw(); } });
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>canvas.addEventListener(ev,()=>{dragQ=false;}));

  document.getElementById('rf-rebuild')?.addEventListener('click', () => { buildForest(); draw(); });

  buildForest();
  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initRandomForest;
