const stageDefinitions = [
  ['understand', 'Understand', ['understand', 'problem', 'intuition', 'overview', 'why', 'data']],
  ['visualize', 'Visualize', ['visualize', 'visuals']],
  ['mathematics', 'Mathematics', ['equation', 'math']],
  ['learn', 'Learn', ['training', 'learns', 'algorithm']],
  ['practice', 'Practice', ['practice', 'example']],
  ['apply', 'Apply', ['apply', 'evaluation', 'strengths', 'limitations', 'when', 'not', 'apps', 'related', 'recap', 'continue']]
];

export function sharedPage(html, inPages = true) {
  const root = inPages ? '../' : '';
  const pages = inPages ? '' : 'pages/';
  const links = [['Home', root + 'index.html'], ['Learn', pages + 'roadmap.html'], ['Algorithms', root + 'index.html#model-explorer'], ['Math', pages + 'mathematics.html'], ['Compare', pages + 'comparison.html'], ['Choose Model', pages + 'model-selector.html'], ['Glossary', pages + 'glossary.html'], ['Resources', pages + 'resources.html'], ['About', pages + 'about.html']];
  const nav = `<nav class="navbar" aria-label="Main navigation">
    <a class="nav-brand" href="${root}index.html" aria-label="ML Atlas home"><span class="brand-mark">ML</span><span>ATLAS</span></a>
    <ul class="nav-links" id="nav-links"><li class="mobile-nav-header"><span class="mobile-nav-title">ATLAS</span><button type="button" class="mobile-nav-close" aria-label="Close navigation">&#215;</button></li>${links.map(([label, href], i) => `<li${i > 6 ? ' class="nav-secondary"' : ''}><a class="nav-link" href="${href}">${label}</a></li>`).join('')}</ul>
    <div class="nav-actions"><button id="search-btn" class="icon-btn" aria-label="Open search" title="Search"><span class="control-icon" aria-hidden="true">&#9906;</span><span class="control-label">Search</span></button><button id="theme-toggle" class="icon-btn" aria-label="Switch theme" title="Switch theme"><span class="control-icon" aria-hidden="true">&#9789;</span><span class="control-label">Theme</span></button><a class="creator-link icon-btn" href="${pages}about.html#creator" aria-label="Meet the creator, Muhammad Danish" title="Meet the creator"><span class="creator-avatar" aria-hidden="true">MD</span></a></div>
    <button id="hamburger" class="hamburger" aria-label="Open navigation" aria-expanded="false" aria-controls="nav-links"><span aria-hidden="true">&#9776;</span></button>
  </nav>`;
  html = html.replace(/<nav class="navbar"[\s\S]*?<\/nav>/, nav)
    .replaceAll('https://danishcorder.github.io/ml-atlas/', 'https://danishcorder.github.io/machine-learning-atlas/');

  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || 'Machine Learning Atlas';
  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] || 'Learn machine learning visually with mathematics, algorithms, visualizations and practical examples.';
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  const image = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1] || 'https://danishcorder.github.io/machine-learning-atlas/assets/og-image.png';
  const seo = [
    html.includes('name="author"') ? '' : '<meta name="author" content="Muhammad Danish">',
    html.includes('property="og:site_name"') ? '' : '<meta property="og:site_name" content="Machine Learning Atlas">',
    html.includes('property="og:locale"') ? '' : '<meta property="og:locale" content="en_US">',
    canonical && html.includes('name="twitter:title"') ? '' : `<meta name="twitter:title" content="${title.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">`,
    canonical && html.includes('name="twitter:description"') ? '' : `<meta name="twitter:description" content="${description.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">`,
    canonical && html.includes('name="twitter:image"') ? '' : `<meta name="twitter:image" content="${image}">`,
    canonical && html.includes('name="twitter:url"') ? '' : `<meta name="twitter:url" content="${canonical || 'https://danishcorder.github.io/machine-learning-atlas/'}">`,
    html.includes('name="theme-color"') ? '' : '<meta name="theme-color" content="#0b1220">'
  ].filter(Boolean).join('\n');
  return html.replace('</head>', `${seo}\n<link rel="stylesheet" href="${root}css/learning.css">\n</head>`);
}

export function lessonPage(html) {
  const sections = new Map();
  html = html.replace(/<section\b([^>]*)\bid="([^"]+)"([^>]*)>[\s\S]*?<\/section>/g, (section, before, id) => {
    sections.set(id, section);
    return '';
  });
  let number = 0;
  const stages = stageDefinitions.map(([key, title, ids], stage) => {
    const content = ids.filter(id => sections.has(id)).map((id, index) => {
      let section = sections.get(id);
      sections.delete(id);
      const label = section.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1].replace(/<span class="section-number">.*?<\/span>/, '').replace(/<[^>]+>/g, '').trim() || title;
      section = section.replace(/(<span class="section-number">)\d+(<\/span>)/g, `$1${String(++number).padStart(2, '0')}$2`)
        .replace(/<div class="lr-kicker">.*?<\/div>/g, '')
        .replace(/<h2\b/g, '<h3').replace(/<\/h2>/g, '</h3>');
      if (index === 0 || (key === 'understand' && id === 'intuition')) return section;
      return `<details class="lesson-detail" open><summary>${label}</summary>${section}</details>`;
    }).join('\n');
    if (!content) throw new Error(`Empty learning stage: ${key}`);
    return `<section class="lesson-stage" id="stage-${key}" aria-labelledby="stage-title-${key}" data-stage="${stage}"><header class="stage-heading"><p class="section-kicker">STAGE ${stage + 1} OF 6</p><h2 id="stage-title-${key}" tabindex="-1">${title}</h2></header>${content}</section>`;
  }).join('\n');
  if (sections.size) throw new Error(`Unassigned lesson sections: ${[...sections.keys()]}`);
  return html.replace('<div id="prev-next"></div>', stages + '\n<div id="prev-next"></div>');
}
