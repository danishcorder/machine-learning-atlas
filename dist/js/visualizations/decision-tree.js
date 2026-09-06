/* ML ATLAS — Decision Tree interactive lab.
 * A real greedy tree is grown from a small 2-feature dataset using entropy /
 * information gain, then revealed one level at a time. The scatter shows each
 * point coloured by the leaf it falls into. Simplified educational viz.
 */
export function initDecisionTree(rootId = 'dt-lab') {
  const host = typeof rootId === 'string' ? document.getElementById(rootId) : rootId;
  if (!host) return;
  const svg = host.querySelector('svg');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';

  /* dataset: (age, income) → loan approved? */
  const data = [
    {x1:22,x2:18,y:0},{x1:25,x2:32,y:0},{x1:28,x2:60,y:1},{x1:30,x2:25,y:0},
    {x1:32,x2:48,y:1},{x1:35,x2:80,y:1},{x1:38,x2:30,y:0},{x1:40,x2:55,y:1},
    {x1:45,x2:90,y:1},{x1:23,x2:75,y:1},{x1:26,x2:40,y:0},{x1:48,x2:20,y:0},
    {x1:50,x2:65,y:1},{x1:33,x2:35,y:0},
  ];

  const ent = (ys) => {
    if (!ys.length) return 0;
    const p = ys.filter(v=>v===1).length / ys.length;
    if (p===0 || p===1) return 0;
    return -(p*Math.log2(p) + (1-p)*Math.log2(1-p));
  };

  /* greedy split search: best (feature, threshold) by information gain */
  function bestSplit(rows) {
    let best = null, bestGain = -Infinity;
    const base = ent(rows.map(r=>r.y));
    for (const f of ['x1','x2']) {
      const vals = [...new Set(rows.map(r=>r[f]))].sort((a,b)=>a-b);
      for (let i=0;i<vals.length-1;i++) {
        const t = (vals[i]+vals[i+1])/2;
        const L = rows.filter(r=>r[f]<=t), R = rows.filter(r=>r[f]>t);
        if (L.length<2 || R.length<2) continue;
        const gain = base - (L.length/rows.length)*ent(L.map(r=>r.y)) - (R.length/rows.length)*ent(R.map(r=>r.y));
        if (gain > bestGain) { bestGain = gain; best = { f, t, L, R, gain }; }
      }
    }
    return best;
  }

  function grow(rows, depth) {
    const node = { rows, n: rows.length, p: rows.filter(r=>r.y===1).length/rows.length, children: null };
    if (depth > 0 && rows.length >= 4) {
      const s = bestSplit(rows);
      if (s && s.gain > 0.05) {
        node.split = s;
        node.children = [grow(s.L, depth-1), grow(s.R, depth-1)];
      }
    }
    return node;
  }

  const tree = grow(data, 3);
  let maxLevel = 1; /* levels currently revealed */

  const el = (tag, attrs, text) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  };

  function countLevel(node, lvl) {
    if (!node.children) return 0;
    if (lvl === 1) return node.children.length;
    return node.children.reduce((s,c)=>s+countLevel(c,lvl-1), 0);
  }

  function leafClass(node) { return node.p >= 0.5 ? 1 : 0; }

  function predict(pt, node = tree) {
    while (node.children) {
      node = pt[node.split.f] <= node.split.t ? node.children[0] : node.children[1];
    }
    return leafClass(node);
  }

  function render() {
    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 760 340');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Decision tree grown from the dataset, expanded level by level');

    /* position nodes: leaves spread evenly at their depth */
    const W = 760, LH = 88, TOP = 30;
    const pos = (node, depth, lo, hi) => {
      if (!node.children || depth >= maxLevel) {
        node._x = (lo+hi)/2; node._y = TOP + depth*LH; node._leaf = !node.children || depth >= maxLevel;
        return;
      }
      const mid = (lo+hi)/2;
      const half = (hi-lo)/2;
      pos(node.children[0], depth+1, lo, lo+half);
      pos(node.children[1], depth+1, lo+half, hi);
      node._x = mid; node._y = TOP + depth*LH; node._leaf = false;
    };
    pos(tree, 0, 30, W-30);

    const g = el('g', {});
    const edge = (a, b) => g.appendChild(el('line', {
      x1:a._x, y1:a._y+22, x2:b._x, y2:b._y-22,
      stroke:'var(--border)', 'stroke-width':'1.5'
    }));
    (function walk(node, depth){
      if (node.children && depth < maxLevel) {
        edge(node, node.children[0]);
        edge(node, node.children[1]);
        node.children.forEach(c=>walk(c, depth+1));
      }
    })(tree, 0);
    svg.appendChild(g);

    (function drawNode(node, depth){
      const pure = node.p===0 || node.p===1;
      const col = node.p>=0.5 ? 'var(--accent-primary)' : 'var(--accent-secondary)';
      const grp = el('g', { transform:`translate(${node._x},${node._y})`, style:'cursor:default' });
      const w = 118, h = 44;
      grp.appendChild(el('rect', {
        x:-w/2, y:-h/2, width:w, height:h, rx:9,
        fill:'var(--bg-card)', stroke: col, 'stroke-width': node===tree?'2.2':'1.4',
        opacity: node._leaf && !( !node.children) ? '1' : '1'
      }));
      const label = node.children && depth < maxLevel
        ? (node.split.f === 'x1' ? 'age' : 'income') + ' ≤ ' + node.split.t.toFixed(1)
        : (node.children ? '… collapsed' : (leafClass(node) ? 'APPROVE' : 'REJECT'));
      grp.appendChild(el('text', { x:0, y:-2, 'text-anchor':'middle', fill:'var(--text-primary)', 'font-size':'12', 'font-family':'var(--font-mono)' }, label));
      const sub = node.children && depth < maxLevel
        ? `gain ${node.split.gain.toFixed(2)}`
        : `${Math.round(node.p*node.n)}/${node.n} approve`;
      grp.appendChild(el('text', { x:0, y:14, 'text-anchor':'middle', fill:'var(--text-muted)', 'font-size':'10', 'font-family':'var(--font-mono)' }, sub));
      svg.appendChild(grp);
      if (node.children && depth < maxLevel) node.children.forEach(c=>drawNode(c, depth+1));
    })(tree, 0);

    const info = document.getElementById('dt-info');
    if (info) {
      const correct = data.filter(d=>predict(d)===d.y).length;
      info.innerHTML = `
        <div class="viz-stats">
          <div><span class="stat-label">Levels shown</span><span class="stat-value">${maxLevel}</span></div>
          <div><span class="stat-label">Leaves</span><span class="stat-value">${countLeaves(tree,0)}</span></div>
          <div><span class="stat-label">Train accuracy</span><span class="stat-value">${(100*correct/data.length).toFixed(0)}%</span></div>
          <div><span class="stat-label">Criterion</span><span class="stat-value">entropy</span></div>
        </div>`;
    }
    drawScatter();
  }

  function countLeaves(node, depth) {
    if (!node.children || depth >= maxLevel) return 1;
    return node.children.reduce((s,c)=>s+countLeaves(c,depth+1),0);
  }

  /* small scatter of the dataset coloured by leaf prediction */
  function drawScatter() {
    const sc = host.querySelector('canvas');
    if (!sc) return;
    const ctx = sc.getContext('2d');
    const r = sc.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
    sc.width = Math.round(r.width*dpr); sc.height = Math.round(r.height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const M2 = 34, X1 = 55, X2 = 100; /* axis ranges: age 20–55, income 10–100 */
    const pxa = (v) => M2 + (v-20)/(X1-20)*(r.width-2*M2);
    const pya = (v) => r.height-M2 - (v-10)/(X2-10)*(r.height-2*M2);
    ctx.clearRect(0,0,r.width,r.height);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#334';
    ctx.lineWidth = 0.5;
    for (let a=20;a<=X1;a+=5){ ctx.beginPath(); ctx.moveTo(pxa(a),M2); ctx.lineTo(pxa(a),r.height-M2); ctx.stroke(); }
    for (let b=10;b<=X2;b+=15){ ctx.beginPath(); ctx.moveTo(M2,pya(b)); ctx.lineTo(r.width-M2,pya(b)); ctx.stroke(); }
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#888';
    ctx.font = '10px monospace';
    ctx.fillText('age →', r.width-M2-36, r.height-M2+14);
    ctx.fillText('income ↑', M2-6, M2-8);
    data.forEach(d=>{
      const pred = predict(d);
      const col = pred===1 ? getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() || '#4f9' : getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim() || '#f85';
      ctx.fillStyle = col;
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#fff';
      ctx.lineWidth = d.y===1 ? 2 : 0.8;
      ctx.beginPath();
      ctx.arc(pxa(d.x1), pya(d.x2), 5, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();
    });
  }

  const more = host.querySelector('[data-dt-expand]');
  const less = host.querySelector('[data-dt-collapse]');
  more?.addEventListener('click', () => { maxLevel = Math.min(3, maxLevel+1); render(); });
  less?.addEventListener('click', () => { maxLevel = Math.max(1, maxLevel-1); render(); });

  render();
  new ResizeObserver(() => drawScatter()).observe(host);
}

export default initDecisionTree;
