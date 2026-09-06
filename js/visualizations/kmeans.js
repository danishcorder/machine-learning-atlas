/* ML ATLAS — K-Means interactive lab.
 * Three seeded clusters, k slider, [RUN K-MEANS] animating Lloyd's algorithm:
 * assign → move centroids → repeat until assignments stabilise. Simplified viz.
 */
export function initKMeans(canvasId = 'km-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 48, MAX = 10;
  let W = 0, H = 0, k = 3, running = false, iter = 0;
  const COL = ['#4f9dff','#ff5f6a','#51cf66','#ffd43b','#7950f2','#f06292','#4db6ac','#ff9800'];
  let pts = [];
  let cents = [], assign = [];

  function seed() {
    pts = [];
    const centers = [[2,2],[7.5,2.5],[5,8],[2.5,7.5],[8,8]];
    for (let c = 0; c < Math.max(3, k); c++) {
      const [cx, cy] = centers[c % centers.length];
      for (let i = 0; i < 12; i++) {
        pts.push({ x: cx + (Math.random()-0.5)*2.4, y: cy + (Math.random()-0.5)*2.4 });
      }
    }
    initC();
  }
  function initC() {
    cents = [];
    const shuffled = [...pts].sort(() => Math.random()-0.5);
    for (let i = 0; i < k; i++) cents.push({ x: shuffled[i].x, y: shuffled[i].y });
    assign = new Array(pts.length).fill(-1);
    iter = 0;
  }

  const px = (v) => M + (v / MAX) * (W - 2 * M);
  const py = (v) => H - M - (v / MAX) * (H - 2 * M);
  const d = (a,b) => Math.hypot(a.x-b.x, a.y-b.y);

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    W = r.width; H = r.height;
    const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function inertia() {
    return pts.reduce((s,p,i)=> s + (assign[i]>=0 ? d(p,cents[assign[i]])**2 : 0), 0);
  }

  function step() {
    let changed = 0;
    pts.forEach((p,i)=>{
      let best = 0, bd = Infinity;
      for (let j=0;j<k;j++){ const dd = d(p,cents[j]); if (dd<bd){bd=dd;best=j;} }
      if (assign[i]!==best){ changed++; assign[i]=best; }
    });
    for (let j=0;j<k;j++){
      const mem = pts.filter((_,i)=>assign[i]===j);
      if (mem.length){
        cents[j] = { x: mem.reduce((s,p)=>s+p.x,0)/mem.length, y: mem.reduce((s,p)=>s+p.y,0)/mem.length };
      }
    }
    iter++;
    return changed;
  }

  function run() {
    if (!running) return;
    const changed = step();
    draw();
    if (changed > 0) setTimeout(run, 550);
    else {
      running = false;
      const btn = document.getElementById('km-run');
      if (btn) btn.textContent = '↻ Run Again';
    }
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
    /* faint cluster regions */
    const N = 40;
    for (let gi=0; gi<N; gi++) for (let gj=0; gj<N; gj++) {
      const gx = (gi/N)*MAX, gy = (gj/N)*MAX;
      let best=0, bd=Infinity;
      for (let j=0;j<k;j++){ const dd=d({x:gx,y:gy},cents[j]); if(dd<bd){bd=dd;best=j;} }
      ctx.fillStyle = COL[best%COL.length];
      ctx.globalAlpha = 0.05;
      ctx.fillRect(px(gx), py(gy), (W-2*M)/N+1, (H-2*M)/N+1);
      ctx.globalAlpha = 1;
    }
    /* points */
    pts.forEach((p,i)=>{
      ctx.fillStyle = assign[i]>=0 ? COL[assign[i]%COL.length] : css('--text-primary')||'#fff';
      ctx.strokeStyle = css('--text-primary') || '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px(p.x),py(p.y),4,0,Math.PI*2);
      ctx.fill(); ctx.stroke();
    });
    /* centroids */
    cents.forEach((c,j)=>{
      ctx.fillStyle = COL[j%COL.length];
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px(c.x),py(c.y),8,0,Math.PI*2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#0b0e14';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(j+1), px(c.x), py(c.y));
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    });
    info();
  }

  function info() {
    const el = document.getElementById('km-info');
    if (el) el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">k</span><span class="stat-value">${k}</span></div>
        <div><span class="stat-label">Iteration</span><span class="stat-value">${iter}</span></div>
        <div><span class="stat-label">Inertia J</span><span class="stat-value">${inertia().toFixed(1)}</span></div>
        <div><span class="stat-label">Status</span><span class="stat-value">${running?'running':'converged'}</span></div>
      </div>`;
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (running) return;
    const r = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(MAX, (e.clientX-r.left-M)/(W-2*M)*MAX));
    const y = Math.max(0, Math.min(MAX, MAX-(e.clientY-r.top-M)/(H-2*M)*MAX));
    pts.push({x, y});
    assign.push(-1);
    draw();
  });

  document.getElementById('km-k')?.addEventListener('input', (e) => {
    k = Math.max(1, Math.min(6, parseInt(e.target.value)));
    const lbl = document.getElementById('km-k-label');
    if (lbl) lbl.textContent = 'k = ' + k;
    if (!running) { initC(); draw(); }
  });
  document.getElementById('km-run')?.addEventListener('click', () => {
    if (running) { running = false; return; }
    initC();
    running = true;
    const btn = document.getElementById('km-run');
    if (btn) btn.textContent = '■ Stop';
    run();
  });
  document.getElementById('km-reseed')?.addEventListener('click', () => {
    running = false;
    seed();
    draw();
  });

  seed();
  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initKMeans;
