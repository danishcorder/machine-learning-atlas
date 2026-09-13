import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { sharedPage, lessonPage } from './page-layout.mjs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PAGES = path.join(ROOT, 'pages');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const BASE_URL = (process.env.SITE_URL || CONFIG.defaultUrl).replace(/\/+$/, '') + '/';
const CHECK_ONLY = process.argv.includes('--check');

const models = [
  ['linear-regression','Linear Regression','MACHINE LEARNING / REGRESSION','LINEAR <em>REGRESSION</em>','Finding the straight-line relationship hidden inside data — the line that best explains a continuous target.','Supervised|Regression|Linear','Learn Linear Regression visually with best-fit lines, slope, intercept, residuals, MSE and gradient descent.'],
  ['multiple-linear-regression','Multiple Linear Regression','MACHINE LEARNING / REGRESSION','MULTIPLE LINEAR <em>REGRESSION</em>','One target, many drivers — a hyperplane that weighs every feature to predict a scalar.','Supervised|Regression|Linear','Models y as a weighted linear combination of p predictors, solved jointly via normal equations.'],
  ['polynomial-regression','Polynomial Regression','MACHINE LEARNING / REGRESSION','POLYNOMIAL <em>REGRESSION</em>','When a straight line cannot bend enough — fit curves while keeping the least-squares optimality.','Supervised|Regression|Non-linear','Models non-linear relationships by fitting polynomials of degree n still solved as linear least-squares.'],
  ['ridge-regression','Ridge Regression','MACHINE LEARNING / REGRESSION','RIDGE <em>REGRESSION</em>','Least squares with an L2 safety net — shrink coefficients to gain stability under multicollinearity.','Supervised|Regression|Regularized','Adds an L2 penalty λ‖β‖² to reduce variance and handle feature multicollinearity gracefully.'],
  ['lasso-regression','Lasso Regression','MACHINE LEARNING / REGRESSION','LASSO <em>REGRESSION</em>','The feature selector — an L1 penalty that can drive coefficients exactly to zero.','Supervised|Regression|Regularized','Adds an L1 penalty λ‖β‖₁ which drives coefficients to zero for automatic feature selection.'],
  ['logistic-regression','Logistic Regression','MACHINE LEARNING / CLASSIFICATION','LOGISTIC <em>REGRESSION</em>','A linear model that speaks in probabilities — the sigmoid turns scores into class predictions.','Supervised|Classification|Linear','Applies a sigmoid link to a linear score, outputs probabilities, learns via maximum likelihood.'],
  ['knn','K-Nearest Neighbors','MACHINE LEARNING / CLASSIFICATION','K-NEAREST <em>NEIGHBORS</em>','No training equation — classify a point by asking its nearest neighbours to vote.','Supervised|Classification|Instance-based','Instance-based learner that classifies by majority vote of k nearest stored training examples.'],
  ['naive-bayes','Naive Bayes','MACHINE LEARNING / CLASSIFICATION','NAIVE <em>BAYES</em>','Bayes theorem at full speed — powered by a deliberately strong conditional-independence assumption.','Supervised|Classification|Probabilistic','Applies Bayes theorem with naive conditional-independence between features for fast classification.'],
  ['decision-tree','Decision Tree','MACHINE LEARNING / CLASSIFICATION','DECISION <em>TREE</em>','A flowchart grown from data — ask the questions that separate classes fastest.','Supervised|Classification|Tree-based','Learns hierarchical if/else splits on features, maximizing class purity (Gini or entropy) at each node.'],
  ['random-forest','Random Forest','MACHINE LEARNING / ENSEMBLE','RANDOM <em>FOREST</em>','Many diverse decision trees vote together to reduce variance and improve robustness.','Supervised|Ensemble|Tree-based','Bagging ensemble of trees trained on bootstrap samples with random feature subsets.'],
  ['svm','Support Vector Machine','MACHINE LEARNING / CLASSIFICATION','SUPPORT VECTOR <em>MACHINE</em>','Find the widest possible margin between classes and let support vectors define the boundary.','Supervised|Classification|Kernel-based','Finds maximum-margin separating hyperplane; uses support vectors and kernels for non-linear boundaries.'],
  ['kmeans','K-Means Clustering','MACHINE LEARNING / CLUSTERING','K-MEANS <em>CLUSTERING</em>','Group unlabeled points around K moving centroids until assignments stop changing.','Unsupervised|Clustering|Centroid-based','Partitions n points into k clusters by alternating assignment and centroid-update steps (Lloyd).'],
  ['hierarchical-clustering','Hierarchical Clustering','MACHINE LEARNING / CLUSTERING','HIERARCHICAL <em>CLUSTERING</em>','Build a family tree of data by repeatedly merging the closest clusters.','Unsupervised|Clustering|Hierarchical','Builds nested cluster hierarchy via agglomerative merging, visualized as a dendrogram.'],
  ['dbscan','DBSCAN','MACHINE LEARNING / CLUSTERING','DBSCAN','Discover arbitrarily shaped clusters from local density while labeling isolated points as noise.','Unsupervised|Clustering|Density-based','Density-based clustering that grows clusters from dense regions, treats sparse points as noise.'],
  ['pca','Principal Component Analysis','MACHINE LEARNING / DIMENSIONALITY REDUCTION','PRINCIPAL COMPONENT <em>ANALYSIS</em>','Rotate the coordinate system toward directions that preserve the most variance.','Unsupervised|Dimensionality Reduction|Linear','Linear transformation projecting data onto directions of maximal variance for compression and visualization.']
].map(([id,title,cat,name,sub,badges,desc]) => ({id,title,cat,name,sub,badges,desc}));

const top = fs.readFileSync(path.join(PAGES, '_chrome_top.html'), 'utf8');
const bottom = fs.readFileSync(path.join(PAGES, '_chrome_bottom.html'), 'utf8');

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const canonical = rel => new URL(rel.replace(/^\/+/, ''), BASE_URL).href;
const badgeHtml = s => s.split('|').map(x => `<span class="badge">${esc(x)}</span>`).join('');

function modelPage(m) {
  const midPath = path.join(PAGES, `_mid_${m.id}.html`);
  if (!fs.existsSync(midPath)) throw new Error(`Missing fragment: ${path.basename(midPath)}`);
  const url = canonical(`pages/${m.id}.html`);
  const title = `${m.title} Tutorial: Math, Intuition & Interactive Visualization | ${CONFIG.shortName}`;
  const schema = JSON.stringify({
    '@context':'https://schema.org','@type':'TechArticle',headline:`${m.title} Machine Learning Tutorial`,
    description:m.desc,author:{'@type':'Person',name:CONFIG.author},publisher:{'@type':'Organization',name:CONFIG.name},
    mainEntityOfPage:url,about:{'@type':'DefinedTerm',name:m.title,inDefinedTermSet:'Machine Learning Algorithms'},
    educationalLevel:'Beginner to Intermediate',learningResourceType:'Interactive tutorial',isAccessibleForFree:true,
    keywords:`machine learning tutorial, machine learning algorithms, ${m.title}, interactive machine learning, ${m.id.replaceAll('-',' ')}`
  }).replace(/</g,'\\u003c');
  const repl = {
    '@@ID@@':m.id,'@@TITLE@@':title,'@@PAGE_TITLE@@':m.title,'@@CAT@@':m.cat,'@@NAME@@':m.name,'@@SUB@@':m.sub,
    '@@BADGES@@':badgeHtml(m.badges),'@@DESC@@':m.desc,'@@CANONICAL@@':url,'@@OG_IMAGE@@':canonical('assets/og-image.png'),'@@SCHEMA@@':schema,
    '@@EXTRA_HEAD@@': m.id === 'linear-regression' ? '<link rel="stylesheet" href="../css/linear-regression.css">' : ''
  };
  let html = top + '\n' + fs.readFileSync(midPath,'utf8') + '\n' + bottom;
  for (const [k,v] of Object.entries(repl)) html = html.split(k).join(v);
  html = html.replace(/\n  \n  <script>/g, '\n  <script>');
  return sharedPage(lessonPage(html));
}

function copyTree(src, dest, filter=()=>true) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest,{recursive:true});
  for (const ent of fs.readdirSync(src,{withFileTypes:true})) {
    if (!filter(ent.name)) continue;
    const a=path.join(src,ent.name), b=path.join(dest,ent.name);
    ent.isDirectory()?copyTree(a,b,filter):fs.copyFileSync(a,b);
  }
}

function validate(html, name) {
  const errors=[];
  if ((html.match(/<!DOCTYPE html>/gi)||[]).length!==1) errors.push('DOCTYPE count');
  if ((html.match(/<html\b/gi)||[]).length!==1 || (html.match(/<\/html>/gi)||[]).length!==1) errors.push('html symmetry');
  if ((html.match(/<head\b/gi)||[]).length!==1 || (html.match(/<\/head>/gi)||[]).length!==1) errors.push('head symmetry');
  if ((html.match(/<body\b/gi)||[]).length!==1 || (html.match(/<\/body>/gi)||[]).length!==1) errors.push('body symmetry');
  if (/@@[A-Z_]+@@/.test(html)) errors.push('unresolved placeholder');
  if (!/<link rel="canonical"/.test(html)) errors.push('missing canonical');
  if (!/application\/ld\+json/.test(html)) errors.push('missing JSON-LD');
  if (errors.length) throw new Error(`${name}: ${errors.join(', ')}`);
}

try {
  console.log('\n🔨 Building ML ATLAS...\n');

  if (!CHECK_ONLY) {
    console.log('  Cleaning dist/ directory...');
    fs.rmSync(DIST,{recursive:true,force:true});
    fs.mkdirSync(DIST,{recursive:true});
    
    console.log('  Copying static assets...');
    for (const d of ['css','js','assets']) copyTree(path.join(ROOT,d),path.join(DIST,d));
    
    console.log('  Copying static pages...');
    fs.mkdirSync(path.join(DIST,'pages'),{recursive:true});
    for (const f of fs.readdirSync(PAGES)) {
      if (!f.endsWith('.html') || f.startsWith('_') || models.some(m=>`${m.id}.html`===f)) continue;
      fs.writeFileSync(path.join(DIST,'pages',f), sharedPage(fs.readFileSync(path.join(PAGES,f), 'utf8')));
    }
    
    console.log('  Copying root files...');
    for (const f of ['index.html','robots.txt','sitemap.xml','manifest.webmanifest','404.html','sw.js']) {
      const p=path.join(ROOT,f); if (fs.existsSync(p)) {
        if (f === 'index.html') fs.writeFileSync(path.join(DIST,f), sharedPage(fs.readFileSync(p,'utf8'), false));
        else fs.copyFileSync(p,path.join(DIST,f));
      }
    }
  }

  console.log(`  Building ${models.length} model pages...`);
  for (const m of models) {
    const html=modelPage(m); 
    validate(html, m.id);
    if (!CHECK_ONLY) fs.writeFileSync(path.join(DIST,'pages',`${m.id}.html`),html);
    console.log(`    ✓ ${m.id}`);
  }

  if (!CHECK_ONLY) {
    console.log('  Generating sitemap and robots.txt...');
    const urls=['', 'pages/mathematics.html','pages/comparison.html','pages/model-selector.html','pages/roadmap.html','pages/glossary.html','pages/resources.html','pages/about.html',...models.map(m=>`pages/${m.id}.html`)];
    const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${canonical(u||'')}</loc><changefreq>${u?'monthly':'weekly'}</changefreq><priority>${u?'0.8':'1.0'}</priority></url>`).join('\n')}\n</urlset>`;
    fs.writeFileSync(path.join(DIST,'sitemap.xml'),sitemap);
    fs.writeFileSync(path.join(DIST,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${canonical('sitemap.xml')}\n`);
  }

  if (!CHECK_ONLY) {
    console.log(`\n✅ Build complete!\n`);
    console.log(`📦 Output: ${DIST}`);
    console.log(`🌐 Base URL: ${BASE_URL}`);
    console.log(`📄 Pages: ${models.length} models + 8 static pages\n`);
  } else {
    console.log(`\n✅ Validation complete!\n`);
    console.log(`📄 Fragments validated: ${models.length} models\n`);
  }
} catch (err) {
  console.error(`\n❌ Build failed:\n  ${err.message}\n`);
  process.exit(1);
}
