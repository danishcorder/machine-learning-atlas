# ML ATLAS

**From Mathematical Foundations to Real-World Intelligence**

ML ATLAS is a complete, interactive, static-site machine-learning textbook. It takes a learner from the real-world problem a model solves, through the mathematics that powers it, to a laboratory where they run the algorithm themselves — then helps them compare models and pick the right one.

No backend. No database. No account. Just open `index.html` (or serve the folder over a static server so ES module imports work) in any modern browser.

---

## Features

- **15 models** across regression, classification, clustering and dimensionality reduction, each following a 21-section learning arc.
- **Interactive labs for every model** — Canvas + SVG + vanilla JS. Drag points, slide hyperparameters, press **Run**, and watch the algorithm act. No screenshots, no fake UI.
- **20-question Q&A per model** — cards that reveal model-specific, mathematically honest answers across Foundation / Mathematics / Algorithm / Practical.
- **Mathematical Foundations** — linear algebra, calculus, probability, statistics and optimization, each concept tied to the model that needs it (Definition → Intuition → Formula → ML Connection → Used by).
- **Model Compass** — filter by category and compare up to three models head-to-head on interpretability, complexity, speed, strengths and weaknesses.
- **Model Decision Engine** — a step-by-step wizard that scores every model against your answers and gives a reasoned recommendation with alternatives and trade-offs.
- **Global search** — searches model names, descriptions, applications, mathematical concepts and equations (e.g. searching *gradient descent* returns Linear Regression, Logistic Regression, SVM and the Mathematics → Gradient descent concept).
- **Progress tracker** — `Mark as Learned` buttons and a live progress bar persisting in `localStorage`. No login required.
- **Dark / light themes** — cinematic dark default, professional light mode, persisted in `localStorage`.
- **Responsive design** — hamburger navigation, collapsible model sidebar, horizontally-scrolling tables, resizable labs for desktop, tablet and mobile.
- **Progressive reveal animations** and a grid/maths-friendly design language.
- **Accessibility** — semantic landmarks, skip link, focus states, ARIA labels, keyboard navigation, reduced-motion support, accessible color contrast.

---

## Models covered

| # | Model | Category |
|---|-------|----------|
| 1 | Linear Regression | Regression |
| 2 | Multiple Linear Regression | Regression |
| 3 | Polynomial Regression | Regression |
| 4 | Ridge Regression | Regression |
| 5 | Lasso Regression | Regression |
| 6 | Logistic Regression | Classification |
| 7 | K-Nearest Neighbors | Classification |
| 8 | Naive Bayes | Classification |
| 9 | Decision Tree | Classification |
| 10 | Random Forest | Classification |
| 11 | Support Vector Machine | Classification |
| 12 | K-Means Clustering | Clustering |
| 13 | Hierarchical Clustering | Clustering |
| 14 | DBSCAN | Clustering |
| 15 | Principal Component Analysis | Dimensionality Reduction |

Each model page follows the same 21-section architecture:

01 Overview → 02 The Problem → 03 Why It Matters → 04 Intuition → 05 Mathematical Foundation → 06 The Equation → 07 How It Learns → 08 Algorithm → 09 Interactive Lab → 10 Worked Example → 11 Data & Features → 12 Evaluation → 13 Strengths → 14 Limitations → 15 When to Use → 16 When Not to Use → 17 Real-World Applications → 18 Questions & Answers → 19 Related Models → 20 60-Second Recap → 21 Continue Learning.

---

## Mathematical topics

**Linear Algebra** · Scalars, vectors, matrices, dot product, matrix multiplication, norms, eigenvalues, eigenvectors
**Calculus** · Derivatives, partial derivatives, gradients, chain rule, gradient descent
**Probability** · Probability, conditional probability, Bayes theorem, random variables, distributions
**Statistics** · Mean, variance, standard deviation, covariance, correlation
**Optimization** · Objective / loss / cost functions, gradient descent, local vs global minima, regularization (L1 / L2)

---

## Technology stack

- **HTML5** (semantic, with ES module scripts)
- **CSS3** custom properties (cinematic dark + light tokens), Grid, Flexbox
- **Vanilla JavaScript (ES modules)** — no frameworks, no build step
- **Canvas & SVG** for interactive visualizations
- **MathJax 3** (CDN) for mathematical rendering
- **localStorage** for theme + progress persistence
- **PowerShell** generator script (`gen-pages.ps1`) to assemble model pages from shared chrome + per-model narrative fragments

---

Project structure

```
ml-atlas/
├── index.html                       # Landing page (hero, landscape, explorer, learning path)
├── gen-pages.ps1                    # Assembles model pages from chrome + _mid fragments
├── css/
│   ├── main.css                     # Theme tokens, layout, cinematic background
│   ├── components.css               # Reusable components (cards, DNA, badges, tables)
│   ├── responsive.css               # Breakpoints, hamburger, collapsible sidebar
│   └── animations.css               # Reveal, hover, reduced-motion guards
├── js/
│   ├── main.js                      # Entry point — orchestrates all modules
│   ├── model-data.js                # Single source of truth (15 models, full schema)
│   ├── model-page.js                # Fills data-driven narrative sections
│   ├── questions.js                 # 5 model-specific Q&A per model (20 total planned)
│   ├── concepts.js                  # Searchable math/concept index
│   ├── navigation.js                # Navbar, hamburger, sidebar, prev/next, TOC, DNA, reveal
│   ├── search.js                    # Global search across models + concepts
│   ├── quiz.js                      # Reveal-card Q&A renderer
│   ├── progress.js                  # Mark-as-learned + progress bar
│   ├── theme.js                     # Dark/light toggle, persisted
│   ├── comparison.js                # Model Compass (filters + multi-select compare)
│   ├── model-selector.js            # Model Decision Engine (wizard + scoring)
│   └── visualizations/              # 15 real, runnable lab engines
│       ├── linear-regression.js
│       ├── multiple-linear-regression.js
│       ├── polynomial-regression.js
│       ├── ridge-regression.js
│       ├── lasso-regression.js
│       ├── logistic-regression.js
│       ├── knn.js
│       ├── naive-bayes.js
│       ├── decision-tree.js
│       ├── random-forest.js
│       ├── svm.js
│       ├── kmeans.js
│       ├── hierarchical-clustering.js
│       ├── dbscan.js
│       └── pca.js
├── pages/
│   ├── _chrome_top.html             # Shared page <head> + hero + first section
│   ├── _chrome_bottom.html          # Shared closing sections + footer + script
│   ├── _mid_*.html                  # Per-model narrative (02-10), 15 files
│   ├── *.html                       # 15 assembled model pages + 5 static pages
│   └── (mathematics, comparison, model-selector, about)
├── README.md
└── LICENSE
```

---

## How to run

1. **Serve the folder** (ES module imports need a server, not `file://`):
   - Python: `python -m http.server 8000` then open `http://localhost:8000`
   - Node (if available): `npx serve .` or `npx http-server`
   - Or any static-file server.
2. **Or open directly** — most labs still work from `file://` (only dynamic `import()` visualizations may need a server depending on browser).
3. **No build step. No install. No configuration.**

> MathJax loads from the jsDelivr CDN, so an internet connection is needed for the first load of mathematical content.

---

## How to add a new model (the data-driven way)

Because every model page is assembled from shared chrome + a narrative fragment, and all narrative content is data-driven, adding Model #16 is a handful of small, local edits — no page rewrite:

1. **Add the model** to the `MODELS` array in `js/model-data.js` (set `id, name, category, visualization, pagePath,` etc.). Add its `id` to `MODEL_ORDER` and the right `MODEL_GROUPS` entry.
2. **Add 5 questions** to `questions.js` under its `id` key.
3. **Add a concept cross-reference** to `concepts.js` if the model introduces a new math concept.
4. **Write one narrative fragment** `pages/_mid-<id>.html` (sections 02–10).
5. **Add a visualizer** `js/visualizations/<id>.js` exporting `initX(canvasId='X-canvas')` (or a container id).
6. **Run `powershell -File gen-pages.ps1`** to assemble `pages/<id>.html` from the chrome + fragment.
7. **Add a card** to the home page's landscape / explorer if desired (the explorer grid is data-driven and auto-includes the new model).

That's it — navigation, search, comparison, the Decision Engine, Q&A, and progress all pick it up automatically.

---

## Visualization architecture

- Each lab is a self-contained ES module with a default-exported `initX(...)` that locates its own container (a `<canvas>` or an `<svg>` host) by id.
- `main.js` dynamically `import()`s the correct lab for the page using `MODEL_MAP[id].visualization`, so only the lab for the current page loads.
- Every interactive control (sliders, buttons, threshold) is wired to a real redraw, and every `[RUN]` / `[Fit]` / `[Expand]` button performs the actual simplified computation — no decorative fake UI.
- Labs are explicitly labelled "Simplified visualization" where they are pedagogical approximations rather than full production implementations (e.g. exact closed-form vs. iterative optimisation is shown, but on small synthetic data).

---

## Accessibility

- Semantic HTML5 (`<main>`, `<nav>`, `<aside>`, `<section>`, `<header>`, `<footer>`).
- `<a class="skip-link">` to skip to main content.
- Keyboard navigation on all buttons and reveal cards (Enter / Space).
- ARIA labels, `aria-expanded`, `aria-current="page"`, `role="progressbar"`, `aria-live`.
- Focus styles on all interactive elements.
- `prefers-reduced-motion` disables reveal/scroll animations.
- Color tokens chosen for readable contrast in both themes; meaning is never conveyed by color alone.

---

## Browser compatibility

Modern evergreen browsers (Chrome, Edge, Firefox, Safari) on desktop and mobile. Requires ES modules, `IntersectionObserver`, `ResizeObserver`, and Canvas/SVG support. No transpilation.

---

## Future improvements

- Expand the Q&A bank from 5 to 20 questions per model (the infrastructure and category schema are already in place).
- Add t-SNE / UMAP to the dimensionality-reduction family.
- Add gradient-boosted trees (XGBoost / LightGBM) as an ensemble entry.
- Add a small synthetic-dataset editor so learners can draw their own points into every lab.
- Offline support via a service worker + cached MathJax bundle.

---

## License

MIT — see [LICENSE](LICENSE).

---

## ML Atlas 2.0 — Build, Audit & Publish

This project is intentionally **static and frontend-only**. The Node.js tooling is used only at build time to assemble HTML fragments and generate deployment files; the published site is plain HTML/CSS/JavaScript.

### Local quality check

```bash
npm run check
npm run build
npm run audit
```

The production site is written to `dist/`.

### Canonical site URL

The default production URL is configured in `site.config.json` as:

```text
https://danishcorder.github.io/ml-atlas/
```

If the GitHub repository name or domain changes, build with:

```bash
SITE_URL="https://your-domain.example/" npm run build
```

### GitHub Pages

A ready-to-use workflow exists at `.github/workflows/pages.yml`. Push the repository to `main`, then enable **GitHub Pages → GitHub Actions** in the repository settings. The workflow validates/builds the static site and publishes `dist/`.

### SEO included

- Unique title + meta description per page
- Absolute canonical URLs
- Open Graph and Twitter Card metadata
- `TechArticle`, `DefinedTerm`, `LearningResource`, and `DefinedTermSet` JSON-LD where appropriate
- Generated `sitemap.xml` and `robots.txt`
- Semantic headings, descriptive internal links and accessible interaction patterns
- 1200×630 Open Graph image
- Search-focused topic clusters across Algorithms, Roadmap, Math, Compare, Model Selector, Glossary and Resources

See `SEO_STRATEGY.md` for the target search-intent map.
