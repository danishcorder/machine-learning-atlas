import { MODEL_MAP } from './model-data.js';

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const palette = { ink: 'var(--visual-ink)', grid: 'var(--visual-grid)', accent: 'var(--accent-primary)', secondary: 'var(--accent-secondary)', tertiary: 'var(--accent-tertiary)', muted: 'var(--text-muted)' };

export function renderStaticVisual(modelId) {
  const root = document.querySelector('[data-static-visual]');
  const model = MODEL_MAP[modelId];
  if (!root || !model) return;
  const visual = model.category === 'Regression' ? regressionVisual(model)
    : model.category === 'Classification' || model.category === 'Ensemble' ? classificationVisual(model)
      : model.id === 'pca' ? pcaVisual(model) : clusteringVisual(model);
  root.innerHTML = `${visual.svg}<div class="visual-caption"><span class="visual-label">READ THE SHAPE</span><p>${esc(visual.caption)}</p></div>`;
  root.closest('.visual-card')?.classList.add('visible');
}

function frame(content, label) {
  return `<svg class="static-chart" viewBox="0 0 760 320" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="visual-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="${palette.grid}" stroke-width="1"/></pattern></defs><rect width="760" height="320" rx="18" fill="${palette.ink}"/><rect x="18" y="18" width="724" height="284" rx="13" fill="url(#visual-grid)" opacity=".7"/>${content}</svg>`;
}
function axes(labels = ['feature', 'target']) { return `<path d="M76 258 H700 M76 258 V52" stroke="${palette.muted}" stroke-width="1.5" opacity=".8"/><text x="702" y="278" fill="${palette.muted}" font-size="12">${labels[0]}</text><text x="42" y="54" fill="${palette.muted}" font-size="12" transform="rotate(-90 42 54)">${labels[1]}</text>`; }
function dots(items, fill, offset = 0) { return items.map(([x, y], i) => `<circle class="chart-dot" cx="${x}" cy="${y}" r="6" fill="${fill}" style="--delay:${offset + i * 45}ms"/>`).join(''); }

function regressionVisual(model) {
  const points = [[115,223],[170,201],[225,211],[280,165],[335,178],[390,137],[445,151],[500,112],[555,125],[610,82],[665,94]];
  const curve = model.id === 'polynomial-regression' ? '<path d="M96 230 C180 238 210 155 300 180 S420 110 485 145 S590 72 688 96" fill="none" stroke="var(--accent-primary)" stroke-width="4" stroke-linecap="round"/>' : '<path d="M96 232 L688 76" fill="none" stroke="var(--accent-primary)" stroke-width="4" stroke-linecap="round"/>';
  return { svg: frame(`${axes()}${curve}${dots(points, palette.secondary)}<text x="98" y="42" fill="${palette.accent}" font-size="13" font-weight="700">${model.id === 'polynomial-regression' ? 'CURVED FIT' : 'BEST-FIT RELATIONSHIP'}</text><g transform="translate(540 215)"><rect width="136" height="45" rx="10" fill="${palette.ink}" stroke="${palette.grid}"/><text x="14" y="19" fill="${palette.muted}" font-size="11">ERROR TREND</text><text x="14" y="36" fill="${palette.secondary}" font-size="15" font-weight="700">minimized</text></g>`, `${model.name} fit chart`), caption: `${model.name} learns a relationship that explains the pattern while keeping prediction error under control.` };
}

function classificationVisual(model) {
  const a = [[138,210],[180,188],[215,230],[254,174],[290,201],[325,153],[365,181]];
  const b = [[440,116],[478,85],[520,135],[558,76],[594,110],[633,64],[675,91]];
  const boundary = model.id === 'decision-tree' || model.id === 'random-forest' ? '<path d="M382 54 V257 M382 156 H690" fill="none" stroke="var(--accent-primary)" stroke-width="3" stroke-dasharray="7 7"/>' : '<path d="M95 270 L680 55" fill="none" stroke="var(--accent-primary)" stroke-width="3" stroke-dasharray="7 7"/>';
  return { svg: frame(`${axes(['feature 1','class score'])}${boundary}${dots(a, palette.secondary)}${dots(b, palette.tertiary, 320)}<text x="100" y="42" fill="${palette.secondary}" font-size="13" font-weight="700">CLASS A</text><text x="620" y="42" fill="${palette.tertiary}" font-size="13" font-weight="700">CLASS B</text><text x="510" y="286" fill="${palette.accent}" font-size="12">decision boundary</text>`, `${model.name} class separation chart`), caption: `${model.name} separates observations into groups, then uses the learned rule to assign a class to new data.` };
}

function clusteringVisual(model) {
  const clusters = [[[135,100],[170,124],[205,93],[185,160],[230,143]],[[400,210],[435,238],[470,205],[510,244],[492,177]],[[560,95],[600,128],[638,84],[665,145],[615,164]]];
  const colors = [palette.secondary, palette.accent, palette.tertiary];
  const centers = [[187,124],[462,215],[616,123]].map(([x,y], i) => `<path d="M${x-10} ${y}h20M${x} ${y-10}v20" stroke="${colors[i]}" stroke-width="4" stroke-linecap="round"/>`).join('');
  return { svg: frame(`${axes(['feature 1','feature 2'])}${clusters.map((cluster, i) => dots(cluster, colors[i], i * 300)).join('')}${centers}<text x="100" y="42" fill="${palette.accent}" font-size="13" font-weight="700">${model.id === 'dbscan' ? 'DENSITY REGIONS' : 'GROUPS BY SIMILARITY'}</text>`, `${model.name} grouping chart`), caption: `${model.name} reveals structure in unlabeled data by making nearby or densely connected points visually belong together.` };
}

function pcaVisual(model) {
  const points = [[180,200],[220,184],[260,171],[300,157],[340,141],[380,128],[420,111],[460,98],[500,83]];
  return { svg: frame(`${axes(['principal component 1','principal component 2'])}<path d="M145 227 L548 70" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/><path d="M548 70 l-18 4 10 12" fill="none" stroke="${palette.accent}" stroke-width="3"/>${dots(points, palette.secondary)}<g transform="translate(585 72)"><rect width="112" height="112" rx="12" fill="${palette.ink}" stroke="${palette.grid}"/><text x="14" y="25" fill="${palette.muted}" font-size="11">VARIANCE</text><rect x="14" y="39" width="80" height="10" rx="5" fill="${palette.accent}"/><rect x="14" y="61" width="52" height="10" rx="5" fill="${palette.secondary}"/><text x="14" y="96" fill="${palette.secondary}" font-size="12" font-weight="700">PC1 leads</text></g><text x="100" y="42" fill="${palette.accent}" font-size="13" font-weight="700">MAXIMUM INFORMATION AXIS</text>`, `${model.name} principal component chart`), caption: 'PCA rotates the coordinate system toward the direction that preserves the most variation, making a complex cloud easier to summarize.' };
}

export default renderStaticVisual;
