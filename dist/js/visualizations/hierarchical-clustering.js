/* ML ATLAS — Hierarchical (agglomerative) clustering lab.
 * Eight points, single-linkage merging. The [STEP] button performs the next
 * merge; the dendrogram grows with each step and the scatter recolours to the
 * current clusters. Simplified educational viz.
 */
export function initHierarchicalClustering(canvasId = 'hc-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const M = 48, MAX = 10;
  let W = 0, H = 0;
  const COL = ['#4f9dff','#ff5f6a','#51cf66','#ffd43b','#7950f2','#f06292','#4db6ac','#ff9800'];

  let pts = [
    {x:1.6,y:2.0},{x:2.4,y:2.8},{x:1.9,y:3.6},{x:7.6,y:2.2},
    {x:8.4,y:3.0},{x:2.6,y:7.8},{x:3.4,y:8.6},{x:7.9,y:8.1},
  ];
  /* cluster state: array of { members:[idx], id } */
  let clusters = [];
  let merges = [];   /* recorded dendrogram merges: {a,b,dist,id} */
  let stepIdx = 0;

  function reset() {
    clusters = pts.map((_,i)=>({ members:[i], id:i }));
    merges = [];
    stepIdx = 0;
    /* precompute full agglomerative schedule with single linkage */
    let work = clusters.map(c=>({ ...c, members:[...c.members] }));
    let nextId = pts.length;
    while (work.length > 1) {
      let best = null;
      for (let i=0;i<work.length;i++) for (let j=i+1;j<work.length;j++) {
        const d = singleLink(work[i], work[j]);
        if (!best || d < best.d) best = { i, j, d };
      }
      const merged = { members: [...work[best.i].members, ...work[best.j].members], id: nextId++ };
      merges.push({ a: work[best.i].id, b: work[best.j].id, d: best.d, id: merged.id, size: merged.members.length });
      work = work.filter((_,k)=>k!==best.i && k!==best.j);
      work.push(merged);
    }
  }

  const d2 = (p,q)=>Math.hypot(p.x-q.x,p.y-q.y);
  function singleLink(A,B) {
    let m = Infinity;
    A.members.forEach(i=>B.members.forEach(j=>{ m = Math.min(m, d2(pts[i],pts[j])); }));
    return m;
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

  /* clusters after stepIdx merges */
  function currentClusters() {
    /* replay merges on ids */
    const live = new Map(pts.map((_,i)=>[i,{members:[i],id:i}]));
    for (let s=0;s<stepIdx;s++) {
      const m = merges[s];
      const A = [...live.values()].find(c=>c.id===m.a);
      const B = [...live.values()].find(c=>c.id===m.b);
      if (!A || !B) break;
      const merged = { members:[...A.members,...B.members], id:m.id };
      live.delete(A.id); live.delete(B.id);
      live.set(merged.id, merged);
    }
    return [...live.values()];
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

    const cls = currentClusters();
    /* point→colour map */
    const colorOf = new Array(pts.length);
    cls.forEach((c,ci)=>c.members.forEach(i=>colorOf[i]=COL[ci%COL.length]));
    /* convex hull-ish links inside each cluster (light lines) */
    cls.forEach(c=>{
      if (c.members.length<2) return;
      ctx.strokeStyle = colorOf[c.members[0]];
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      for (let i=0;i<c.members.length;i++) for (let j=i+1;j<c.members.length;j++) {
        ctx.beginPath();
        ctx.moveTo(px(pts[c.members[i]].x),py(pts[c.members[i]].y));
        ctx.lineTo(px(pts[c.members[j]].x),py(pts[c.members[j]].y));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    });
    pts.forEach((p,i)=>{
      ctx.fillStyle = colorOf[i] || css('--text-primary') || '#fff';
      ctx.strokeStyle = css('--text-primary') || '#fff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(px(p.x),py(p.y),6,0,Math.PI*2);
      ctx.fill(); ctx.stroke();
    });
    drawDendrogram();
    info(cls.length);
  }

  /* dendrogram panel on the right half */
  function drawDendrogram() {
    const panelX = W*0.52;
    if (panelX < 150) return;
    const top = M, bot = H-M;
    const n = pts.length;
    const slot = (bot-top)/n;
    /* leaf y positions by point index */
    const leafY = {};
    pts.forEach((_,i)=>leafY[i] = top + i*slot + slot/2);
    /* positions of merged nodes */
    const nodeY = {}; /* id → {y, x} */
    pts.forEach((_,i)=>nodeY[i] = { y: leafY[i], x: panelX });
    const drawn = stepIdx;
    for (let s=0;s<drawn;s++) {
      const m = merges[s];
      const A = nodeY[m.a], B = nodeY[m.b];
      if (!A || !B) continue;
      const x = panelX + (m.d/10)*(W-M-panelX);
      ctx.strokeStyle = css('--accent-primary') || '#4f9';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y); ctx.lineTo(x, A.y); ctx.lineTo(x, B.y); ctx.lineTo(B.x, B.y);
      ctx.stroke();
      nodeY[m.id] = { y: (A.y+B.y)/2, x };
    }
    ctx.fillStyle = css('--text-muted') || '#888';
    ctx.font = '10px monospace';
    ctx.fillText('dendrogram → distance', panelX, H-8);
  }

  function info(k) {
    const el = document.getElementById('hc-info');
    if (el) el.innerHTML = `
      <div class="viz-stats">
        <div><span class="stat-label">Merges done</span><span class="stat-value">${stepIdx}/${pts.length-1}</span></div>
        <div><span class="stat-label">Clusters now</span><span class="stat-value">${k}</span></div>
        <div><span class="stat-label">Linkage</span><span class="stat-value">single</span></div>
        <div><span class="stat-label">Last merge at d</span><span class="stat-value">${stepIdx>0?merges[stepIdx-1].d.toFixed(2):'—'}</span></div>
      </div>`;
  }

  const px = (v) => M + (v/MAX)*(W*0.5-2*M);
  const py = (v) => H-M - (v/MAX)*(H-2*M);

  document.getElementById('hc-step')?.addEventListener('click', ()=>{
    if (stepIdx < pts.length-1) { stepIdx++; draw(); }
  });
  document.getElementById('hc-back')?.addEventListener('click', ()=>{
    if (stepIdx > 0) { stepIdx--; draw(); }
  });
  document.getElementById('hc-reset')?.addEventListener('click', ()=>{ reset(); draw(); });

  reset();
  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

export default initHierarchicalClustering;
