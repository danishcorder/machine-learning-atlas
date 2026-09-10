const CACHE_NAME = 'ml-atlas-v5-creator-nav';
const APP_SHELL = [
  './',
  './index.html',
  './404.html',
  './manifest.webmanifest',
  './css/main.css',
  './css/components.css',
  './css/comparison-enhanced.css',
  './css/linear-regression.css',
  './css/animations.css',
  './css/responsive.css',
  './js/main.js',
  './js/model-data.js',
  './js/model-page.js',
  './js/model-selector.js',
  './js/navigation.js',
  './js/progress.js',
  './js/search.js',
  './js/static-visuals.js',
  './js/storage.js',
  './js/theme.js',
  './js/comparison.js',
  './js/concepts.js',
  './js/glossary.js',
  './js/linear-regression-experience.js',
  './js/visualizations/linear-regression.js',
  './pages/about.html',
  './pages/comparison.html',
  './pages/glossary.html',
  './pages/mathematics.html',
  './pages/model-selector.html',
  './pages/resources.html',
  './pages/roadmap.html',
  './pages/linear-regression.html',
  './pages/multiple-linear-regression.html',
  './pages/polynomial-regression.html',
  './pages/ridge-regression.html',
  './pages/lasso-regression.html',
  './pages/logistic-regression.html',
  './pages/knn.html',
  './pages/naive-bayes.html',
  './pages/decision-tree.html',
  './pages/random-forest.html',
  './pages/svm.html',
  './pages/kmeans.html',
  './pages/hierarchical-clustering.html',
  './pages/dbscan.html',
  './pages/pca.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isNavigation = request.mode === 'navigate';
  const isMathJax = url.hostname === 'cdn.jsdelivr.net' && url.pathname.startsWith('/npm/mathjax@3/');

  if (url.origin !== self.location.origin && !isMathJax) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (!response || (response.status !== 200 && response.type !== 'opaque')) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      }).catch(() => {
        if (isNavigation) return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});
