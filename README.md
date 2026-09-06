# 🚀 ML ATLAS

> **From Mathematical Foundations to Real-World Intelligence**  
> An interactive, static-site machine-learning textbook that teaches ML from first principles.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-%23E34F26?style=flat&logo=html5&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E?style=flat&logo=javascript&logoColor=black)]()
[![CSS3](https://img.shields.io/badge/CSS3-%231572B6?style=flat&logo=css3&logoColor=white)]()
[![Accessibility](https://img.shields.io/badge/Accessibility-A11y-blue)]()
[![No Build Step](https://img.shields.io/badge/Zero%20Dependencies-No%20Build%20Step-brightgreen)]()

---

## ✨ What is ML ATLAS?

**ML ATLAS** is a complete, interactive, self-contained machine-learning textbook for everyone—from curious beginners to practising engineers.

- 🎓 **Learn 15 canonical ML models** from mathematical foundations to real-world implementation
- 🧪 **Run interactive labs** — drag points, adjust hyperparameters, watch algorithms work in real-time
- 📊 **Understand the math** — visual, intuitive explanations without the gatekeeping
- 🧭 **Compare models** — side-by-side analysis of strengths, weaknesses, and trade-offs
- 🤖 **Get personalized recommendations** — step through a decision engine to find your perfect model
- 🌙 **Dark / light themes** — cinematic dark mode by default, professional light mode on demand
- 🔍 **Global search** — search models, concepts, equations, and applications across the entire site
- 📈 **Track your progress** — mark sections learned and watch your progress bar fill (no login required)
- ♿ **Built for accessibility** — keyboard navigation, ARIA labels, reduced-motion support, semantic HTML
- 📱 **Responsive design** — desktop, tablet, mobile—everything just works
- ⚡ **Lightning-fast** — no backend, no database, no build step. Just open in a browser.

---

## 🎯 Live Demo

👉 **[Visit ML ATLAS](https://danishcorder.github.io/ml-atlas/)** ← Click to explore now!

---

## 📚 What You'll Learn

### **15 Algorithms Across 4 Categories**

#### Regression (5 models)
- Linear Regression
- Multiple Linear Regression
- Polynomial Regression
- Ridge Regression (L2 Regularization)
- Lasso Regression (L1 Regularization)

#### Classification (6 models)
- Logistic Regression
- K-Nearest Neighbors (KNN)
- Naive Bayes
- Decision Trees
- Random Forests
- Support Vector Machines (SVM)

#### Clustering (3 models)
- K-Means Clustering
- Hierarchical Clustering
- DBSCAN

#### Dimensionality Reduction (1 model)
- Principal Component Analysis (PCA)

### **Mathematical Foundations**

Every model is grounded in core mathematics:

- 🔢 **Linear Algebra** — scalars, vectors, matrices, dot products, eigenvalues
- 📐 **Calculus** — derivatives, gradients, chain rules, gradient descent
- 🎲 **Probability** — conditional probability, Bayes' theorem, distributions
- 📊 **Statistics** — mean, variance, covariance, correlation
- ⚙️ **Optimization** — cost functions, gradient descent, regularization

---

## 🎮 Key Features

| Feature | Description |
|---------|-------------|
| 🧬 **21-Section Arc** | Every model follows the same proven learning structure: Overview → Problem → Why It Matters → Intuition → Mathematics → Algorithm → Lab → Practice → Q&A |
| 🖱️ **Interactive Labs** | Canvas + SVG visualizations in vanilla JS. Drag data points, adjust sliders, run algorithms in real time. No fake UI—everything actually computes. |
| ❓ **20 Q&A Cards per Model** | Model-specific, mathematically rigorous questions with reveal-on-demand answers. Organized by Foundation / Mathematics / Algorithm / Practical. |
| 🧭 **Model Compass** | Filter by category and compare up to 3 models head-to-head: interpretability, complexity, speed, strengths, weaknesses, use cases. |
| 🤖 **Decision Engine** | A step-by-step wizard that scores all 15 models against your answers and gives a reasoned recommendation with trade-off analysis. |
| 🔎 **Global Search** | Search models, equations, mathematical concepts, applications—returns all relevant results ranked by relevance. |
| 📊 **Progress Tracker** | "Mark as Learned" buttons and a live progress bar. Persisted to browser storage, no login required. |
| 🌓 **Dual Themes** | Cinematic dark mode (default) and professional light mode. Your choice is saved. |
| 📱 **Responsive UX** | Hamburger nav, collapsible sidebars, scrollable tables, resizable labs. Works on desktop, tablet, and mobile. |
| ⌨️ **Fully Accessible** | Semantic HTML5, skip links, keyboard navigation, ARIA labels, focus states, reduced-motion support, WCAG AAA color contrast. |

---

## 🚀 Quick Start

### **Option 1: Visit Online (Easiest)**
👉 **[danishcorder.github.io/ml-atlas](https://danishcorder.github.io/ml-atlas/)** — No installation needed. Opens in any modern browser.

### **Option 2: Run Locally**

**Requirements:** Python, Node.js, or any static file server.

```bash
# 1. Clone the repository
git clone https://github.com/danishcorder/machine-learning-atlas.git
cd machine-learning-atlas

# 2. Start a local server

# Using Python 3
python -m http.server 8000

# OR using Node.js
npx serve .

# OR using http-server
npx http-server

# 3. Open your browser
# → http://localhost:8000
```

**That's it.** No `npm install`, no build step, no configuration.

> 💡 **Pro Tip:** Most labs work offline. Just open `index.html` directly in your browser. For full ES module support, use a server.

---

## 🛠️ Technology Stack

Built with **zero dependencies** and zero build complexity:

- **HTML5** — semantic structure with ES modules
- **CSS3** — custom properties, Grid, Flexbox, cinematic design
- **Vanilla JavaScript (ES modules)** — no frameworks, no transpilation
- **Canvas & SVG** — interactive visualizations
- **MathJax 3** — beautiful mathematical rendering
- **localStorage** — theme and progress persistence
- **PowerShell** — page assembly and automation

---

## 📂 Project Structure

```
ml-atlas/
├── index.html                       # Landing page + explorer
├── gen-pages.ps1                    # Build script (assembles model pages)
│
├── css/
│   ├── main.css                     # Theme tokens, layout, cinematic design
│   ├── components.css               # Reusable UI components
│   ├── responsive.css               # Breakpoints, mobile/tablet optimizations
│   └── animations.css               # Reveal animations + reduced-motion support
│
├── js/
│   ├── main.js                      # Entry point, module orchestration
│   ├── model-data.js                # Single source of truth (15 models)
│   ├── model-page.js                # Dynamic content rendering
│   ├── questions.js                 # Q&A database
│   ├── concepts.js                  # Searchable math concepts
│   ├── navigation.js                # UI navigation & sidebar
│   ├── search.js                    # Global search engine
│   ├── quiz.js                      # Reveal-card renderer
│   ├── progress.js                  # Progress tracking
│   ├── theme.js                     # Dark/light theme toggle
│   ├── comparison.js                # Model Compass
│   ├── model-selector.js            # Decision Engine
│   └── visualizations/              # 15 interactive lab engines
│       ├── linear-regression.js
│       ├── logistic-regression.js
│       ├── decision-tree.js
│       ├── random-forest.js
│       ├── svm.js
│       ├── kmeans.js
│       └── [12 more...]
│
├── pages/
│   ├── _chrome_top.html             # Shared header template
│   ├── _chrome_bottom.html          # Shared footer template
│   ├── _mid_*.html                  # 15 model narratives
│   ├── *.html                       # 20 assembled pages
│   └── (mathematics, comparison, model-selector, about, etc.)
│
├── README.md                        # This file
├── LICENSE                          # MIT License
└── site.config.json                 # Build configuration
```

---

## 🧩 How to Add a New Model

The architecture is data-driven, so adding Model #16 takes minutes:

1. **Register the model** in `js/model-data.js`:
   ```javascript
   { id: 16, name: "Gradient Boosting", category: "Regression", ... }
   ```

2. **Write 5 Q&A cards** in `js/questions.js`

3. **Add any new math concepts** to `js/concepts.js`

4. **Write the narrative** as `pages/_mid-16.html` (sections 02–10)

5. **Build the visualizer** as `js/visualizations/gradient-boosting.js`

6. **Assemble the page:**
   ```bash
   powershell -File gen-pages.ps1
   ```

✅ Done. Navigation, search, comparison, decision engine, Q&A, and progress all auto-update.

---

## 🎨 Lab Architecture

Every interactive lab is a self-contained ES module:

```javascript
// js/visualizations/linear-regression.js
export default function initLinearRegression(canvasId = 'lr-canvas') {
  // Get canvas
  const canvas = document.getElementById(canvasId);
  
  // Bind controls
  document.getElementById('run-btn').addEventListener('click', () => {
    // Perform real computation
    // Redraw
  });
}
```

- **Real computation** — every `[RUN]` button performs actual math, not decoration
- **Dynamic imports** — only the current model's lab loads (fast page transitions)
- **Canvas + SVG** — visualize data, decision boundaries, clusters, and transformations
- **Pedagogical** — labs are clearly labeled "Simplified visualization" where appropriate

---

## ♿ Accessibility Commitments

- ✅ Semantic HTML5 structure
- ✅ Skip-to-content link
- ✅ Full keyboard navigation (Tab, Enter, Space, Escape)
- ✅ ARIA labels, `aria-expanded`, `aria-live` regions
- ✅ Focus indicators on all interactive elements
- ✅ `prefers-reduced-motion` respected (no animations)
- ✅ WCAG AAA color contrast in both themes
- ✅ Logical heading hierarchy
- ✅ Tested with screen readers

---

## 🌍 Browser Support

Works on all modern, evergreen browsers:

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- ES modules (`<script type="module">`)
- `IntersectionObserver` & `ResizeObserver`
- Canvas & SVG support

No transpilation, no polyfills needed.

---

## 🚢 Deployment

### **GitHub Pages (Recommended)**

ML ATLAS includes a ready-to-use GitHub Actions workflow:

1. **Enable GitHub Pages** in repository settings
2. **Select "GitHub Actions"** as the source
3. **Push to `main`**

The `.github/workflows/pages.yml` workflow automatically validates, builds, and deploys.

### **Manual Deployment**

```bash
npm run build
# → Output written to `dist/`
# → Deploy `dist/` to any static host
```

### **Custom Domain**

Update `site.config.json`:

```json
{
  "siteUrl": "https://your-domain.com/ml-atlas/"
}
```

Then rebuild:

```bash
SITE_URL="https://your-domain.com/ml-atlas/" npm run build
```

---

## 📊 SEO & Discoverability

ML ATLAS is built for search engines:

- 🔍 Unique title + meta description per page
- 🔗 Canonical URLs and Open Graph metadata
- 📋 `TechArticle`, `LearningResource`, `DefinedTerm` JSON-LD
- 🗺️ Auto-generated `sitemap.xml` and `robots.txt`
- 🎯 Topic clusters across Algorithms, Roadmap, Math, Compare, Glossary
- 📐 Semantic headings and descriptive internal links
- 🖼️ 1200×630 Open Graph image

See `SEO_STRATEGY.md` for the full search-intent map.

---

## 🗺️ Roadmap

- [ ] Expand Q&A from 5 to 20 questions per model
- [ ] Add t-SNE & UMAP (dimensionality reduction)
- [ ] Add XGBoost & LightGBM (ensemble methods)
- [ ] Synthetic dataset editor (draw your own data)
- [ ] Offline mode (service worker + cached MathJax)
- [ ] Model recommendations based on dataset characteristics
- [ ] Export training logs and visualizations

---

## 🤝 Contributing

We'd love your help! Whether it's a typo, a visualization improvement, or a whole new model, contributions are welcome.

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-thing`)
3. **Make your changes** (see [How to Add a New Model](#-how-to-add-a-new-model) above)
4. **Test locally** with a static server
5. **Commit and push** (`git push origin feature/amazing-thing`)
6. **Open a Pull Request**

Please ensure:
- ✅ All pages build with `powershell -File gen-pages.ps1`
- ✅ Accessibility checks pass (`npm run audit`)
- ✅ No console errors
- ✅ Semantic HTML is preserved
- ✅ Both light and dark themes look great

---

## ❓ FAQ

**Q: Do I need an account or login?**  
A: No. ML ATLAS is completely free and anonymous. Your progress is saved locally in your browser.

**Q: Can I use this offline?**  
A: Mostly yes. MathJax requires an internet connection for the first load. After that, most of the site works offline. Full offline support is on the roadmap.

**Q: Can I add my own models?**  
A: Yes! Follow the [How to Add a New Model](#-how-to-add-a-new-model) guide. The architecture is designed for extensibility.

**Q: Is this production-ready code?**  
A: ML ATLAS teaches ML, not best practices for production systems. The visualizations are pedagogical approximations, not the optimized implementations you'd use in production.

**Q: Why no React / Vue / framework?**  
A: Intentional. No build step, no dependencies, no version hell. The entire site is ~150KB minified. It loads fast and runs everywhere.

**Q: Can I use this for a course?**  
A: Absolutely. Embed the link, recommend it, fork it, teach from it. It's MIT-licensed—do whatever you want (just give credit).

---

## 📜 License

MIT License — see [LICENSE](LICENSE).

You're free to use, modify, and distribute this project. Just include the original license and copyright notice.

---

## 🙏 Acknowledgments

ML ATLAS stands on the shoulders of giants:

- **Mathematics foundations:** Inspired by 3Blue1Brown, StatQuest, and fast.ai
- **Interactive design:** Lessons from Explorable Explanations (Bret Victor)
- **Accessibility:** W3C WAI-ARIA and WCAG 2.1 AAA standards
- **Community:** Thanks to everyone who reports bugs, suggests features, and shares feedback

---

## 💬 Get in Touch

- 🐛 **Found a bug?** [Open an issue](https://github.com/danishcorder/machine-learning-atlas/issues)
- 💡 **Have an idea?** [Start a discussion](https://github.com/danishcorder/machine-learning-atlas/discussions)
- 🤝 **Want to contribute?** [See Contributing](#-contributing)
- 🌐 **Visit the site:** [danishcorder.github.io/ml-atlas](https://danishcorder.github.io/ml-atlas/)

---

<div align="center">

**Made with ❤️ for learners, practitioners, and the ML community**

[⭐ Star this repo](https://github.com/danishcorder/machine-learning-atlas) if you find it helpful!

</div>
