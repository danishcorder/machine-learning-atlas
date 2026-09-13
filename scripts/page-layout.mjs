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
    <ul class="nav-links" id="nav-links">${links.map(([label, href], i) => `<li${i > 6 ? ' class="nav-secondary"' : ''}><a class="nav-link" href="${href}">${label}</a></li>`).join('')}</ul>
    <div class="nav-actions"><button id="search-btn" class="icon-btn" aria-label="Open search" title="Search"><span class="control-icon" aria-hidden="true">&#9906;</span><span class="control-label">Search</span></button><button id="theme-toggle" class="icon-btn" aria-label="Switch theme" title="Switch theme"><span class="control-icon" aria-hidden="true">&#9789;</span><span class="control-label">Theme</span></button><a class="creator-link icon-btn" href="${pages}about.html#creator" aria-label="Meet the creator, Muhammad Danish" title="Meet the creator"><span class="creator-avatar" aria-hidden="true">MD</span></a></div>
    <button id="hamburger" class="hamburger" aria-label="Open navigation" aria-expanded="false" aria-controls="nav-links"><span aria-hidden="true">&#9776;</span></button>
  </nav>`;
  return html.replace(/<nav class="navbar"[\s\S]*?<\/nav>/, nav)
    .replaceAll('https://danishcorder.github.io/ml-atlas/', 'https://danishcorder.github.io/machine-learning-atlas/')
    .replace('</head>', `<link rel="stylesheet" href="${root}css/learning.css">\n</head>`);
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
