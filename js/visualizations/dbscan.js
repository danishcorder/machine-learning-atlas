/* ML ATLAS — DBSCAN interactive lab.
 * Adjust ε (neighbourhood radius) and MinPts; [RUN DBSCAN] expands clusters
 * through density-connected core points and labels the rest as noise.
 * Simplified educational viz.
 */
export function initDBSCAN(canvasId = 'db-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 48, MAX = 10;
  let W = 0, H = 0;
  const COL = ['#4f9dff','#ff5f6a','#51cf66','#ffd43b','#7950f2','#f06292'];
  let eps = 1.4, minPts = 4;
  let labels = [];   /* -1 unvisited/noise, else cluster id */
  let done = false;

  /* two dense blobs + one sparse arc + noise */
  let pts = [];
  function seed() {
    pts = [];
    for (let i=0;i<16;i++) pts.push({ x: 2.5+(Math.random()-0.5)*1.8, y: 3+(Math.random()-0.5)*1.8 });
    for (let i=0;i<14;i++) { const a = Math.random()*Math.PI*1.2; pts.push({ x: 7+Math.cos(a)*1.4, y: 7+Math.sin(a)*1.4 }); }
    for (let i=0;i<6;i++) pts.push({ x: 5+(Math.random()-0.5)*5, y: 0.8+(Math.random()-0.4)*0.8 });
    labels = new Array(pts.length).fill(-1);
    done = false;
  }
  seed();

  const px = (v) => M + (v/MAX)*(W-2*M);
  const py = (v) => H-M - (v/MAX)*(H-2*M);
  const d = (i,j) => Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y);

  function neighbours(i) {
    const out = [];
    for (let j=0;j<pts.length;j++) if (j!==i && d(i,j) <= eps) out.push(j);
    return out;
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

  function classify() {
    const nb = pts.map((_,i)=>neighbours(i));
    const core = pts.map((_,i)=>nb[i].length+1 >= minPts);
    return { nb, core };
  }

  function run() {
    labels = new Array(pts.length).fill(-1);
    const { nb, core } = classify();
    let cid = 0;
    const queue = [];
    for (let i=0;i<pts.length;i++) {
      if (labels[i] !== -1 || !core[i]) continue;
      labels[i] = cid;
      queue.push(i);
      while (queue.length) {
        const q = queue.shift();
        if (!core[q]) continue; /* border point: don't expand through it */
        nb[q].forEach(j=>{
          if (labels[j] === -1) { labels[j] = cid; queue.push(j); }
        });
      }
      cid++;
    }
    /* remaining -1 are noise */
    done = true;
    draw();
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

    const { core } = classify();
    const clusters = [...new Set(labels.filter(l=>l>=0))];
    const colorOf = (i) => {
      if (labels[i] >= 0) return COL[labels[i]%COL.length];
      return css('--text-muted') || '#666';
    };
    /* epsilon circles around core points */
    pts.forEach((p,i)=>{
      if (!core[i]) return;
      ctx.strokeStyle = 'rgba(79,157,255,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px(p.x),py(p.y), eps/MAX*(W-2*M), 0, Math.PI*2);
      ctx.stroke();
    });
    pts.forEach((p,i)=>{
      const noise = done && labels[i]===-1;
      ctx.fillStyle = colorOf(i);
      ctx.strokeStyle = css('--text-primary') || '#fff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      if (noise) {
        /* noise drawn as small x */
        const cx2 = px(p.x), cy2 = py(p.y);
        ctx.moveTo(cx2-4,cy2-4); ctx.lineTo(cx2+4,cy2+4);
        ctx.moveTo(cx2+4,cy2-4); ctx.lineTo(cx2-4,cy2+4);
        ctx.stroke();
      } else {
        ctx.arc(px(p.x),py(p.y), core[i]?6:4.5, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
      }
    });
    info(clusters.length, core);
  }

  function info(nClusters, core) {
    const noise = done ? labels.filter(l=>l===-1).length : '—';
    const el = document.getElementById('db-info');
    if (el) el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">ε</span><span class="stat-value">${eps.toFixed(1)}</span></div>
        <div><span class="stat-label">MinPts</span><span class="stat-value">${minPts}</span></div>
        <div><span class="stat-label">Clusters</span><span class="stat-value">${done?nClusters:'—'}</span></div>
        <div><span class="stat-label">Noise pts</span><span class="stat-value">${noise}</span></div>
      </div>`;
  }

  canvas.addEventListener('pointerdown', (e)=>{
    const r = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(MAX, (e.clientX-r.left-M)/(W-2*M)*MAX));
    const y = Math.max(0, Math.min(MAX, MAX-(e.clientY-r.top-M)/(H-2*M)*MAX));
    pts.push({x,y});
    labels.push(-1);
    done = false;
    draw();
  });

  document.getElementById('db-eps')?.addEventListener('input',(e)=>{ eps = parseFloat(e.target.value); done=false; draw(); });
  document.getElementById('db-min')?.addEventListener('input',(e)=>{ minPts = parseInt(e.target.value); done=false; draw(); });
  document.getElementById('db-run')?.addEventListener('click', run);
  document.getElementById('db-reseed')?.addEventListener('click', ()=>{ seed(); draw(); });

  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initDBSCAN;
