/* ML ATLAS — Per-model Q&A bank: 5 questions + answers per model.
 * Categories: Foundation / Mathematics / Algorithm / Practical.
 * Answers are model-specific. Each key is a model id (see model-data.js).
 */
const q = (cat, question, answer) => ({ cat, question, answer });

export const QUESTIONS = {
  'linear-regression': [
    q('Foundation', 'What problem does this model solve, and why is that problem important?',
      'It predicts a continuous numeric outcome from one or more inputs. That is the most common real-world question — how much, how many, when — so a fast, interpretable answer has enormous practical value.'),
    q('Mathematics', 'What does the equation y = β₀ + β₁x actually mean?',
      'β₀ is the intercept (the value predicted when x = 0) and β₁ is the slope (the change in y for a one-unit increase in x). The model assumes a straight-line relationship plus random error.'),
    q('Mathematics', 'How does it find the best slope and intercept?',
      'It minimises the mean squared error between predictions and actual values. The optimum is found in closed form by differentiating the loss, setting it to zero, and solving the normal equations — no iterative search needed.'),
    q('Algorithm', 'How does it make a prediction on new data?',
      'It substitutes the new feature value into the learned equation ŷ = β₀ + β₁x (or the hyperplane in multi-feature form). Because the model is one line, prediction is essentially instantaneous.'),
    q('Practical', 'When should you choose it, and when must you avoid it?',
      'Choose it for approximately linear relationships when you need interpretability and there are no severe outliers or multicollinearity. Avoid it for strongly non-linear data, or when you need probabilities.')
  ],

  'multiple-linear-regression': [
    q('Foundation', 'What problem does it solve that simple Linear Regression cannot?',
      'It handles many features at once — y = β₀ + β₁x₁ + … + βₚxₚ — so predictions can depend on several drivers simultaneously, which is the real situation in practice.'),
    q('Mathematics', 'What is the design matrix, and why does it matter?',
      'The design matrix X stacks each example as a row and each feature as a column. Writing the problem as y = Xβ turns fitting into a matrix equation solved by the normal equations β = (XᵀX)⁻¹Xᵀy.'),
    q('Mathematics', 'What does each coefficient βⱼ tell you?',
      'It is the expected change in y for a one-unit increase in feature j, holding all other features fixed — the marginal effect of that feature.'),
    q('Algorithm', 'What happens during training, and what can go wrong?',
      'It computes the closed-form least-squares solution over all features jointly. It fails when features are strongly collinear, since XᵀX becomes near-singular and coefficient variance explodes.'),
    q('Practical', 'When is this model the wrong tool?',
      'For non-linear relationships, when you have far more features than samples (p ≫ n), or when outliers would drag the least-squares fit off course.')
  ],

  'polynomial-regression': [
    q('Foundation', 'What problem does this model solve?',
      'It models curved, non-linear relationships between a feature and a continuous target by fitting y = β₀ + βx + β₂x² + … + βₙxⁿ.'),
    q('Mathematics', 'Why is it called "linear" despite drawing a curve?',
      'It is linear in the parameters β; the powers [x, x², …, xⁿ] are treated as new columns, so all the closed-form regression machinery still applies.'),
    q('Mathematics', 'What does the degree n control?',
      'Flexibility. A low degree underfits; a very high degree overfits and extrapolates wildly. n is the key bias–variance dial.'),
    q('Algorithm', 'How does it learn?',
      'It builds a design matrix of power-transformed features, then solves least squares exactly — only the "features" are engineered by exponentiation.'),
    q('Practical', 'When should you avoid it?',
      'For extrapolation beyond the observed range — polynomials diverge. Also avoid high degrees on noisy, small datasets, which overfit badly.')
  ],
'ridge-regression': [
    q('Foundation', 'What problem does Ridge solve?',
      'It prevents overfitting and stabilises coefficients when features are many or highly correlated, by adding an L2 penalty that shrinks all coefficients toward zero.'),
    q('Mathematics', 'What does the penalty λ‖β‖²² mean?',
      'It appends the squared magnitude of the coefficient vector, scaled by λ, to the squared-error loss. Larger λ shrinks coefficients more; this is the squared L2 (Euclidean) norm.'),
    q('Mathematics', 'Why does shrinkage reduce variance?',
      'It trades a little bias (coefficients pulled from their true values) for a larger drop in variance (coefficients no longer explode under collinearity) — the bias–variance trade-off made explicit.'),
    q('Algorithm', 'How does Ridge fit, and why is it different from OLS?',
      'The optimum stays closed form: β = (XᵀX + λI)⁻¹Xᵀy. Adding λI to XᵀX guarantees invertibility — exactly why it survives multicollinearity.'),
    q('Practical', 'When should you prefer Ridge over plain Linear Regression?',
      'When features are highly correlated, when p is large relative to n, or when you must keep all features but want stability. Use Lasso instead when you want features zeroed out.')
  ],

  'lasso-regression': [
    q('Foundation', 'What problem does Lasso solve that Ridge cannot?',
      'It performs automatic feature selection: an L1 penalty drives some coefficients exactly to zero, producing a sparse model that keeps only the most relevant features.'),
    q('Mathematics', 'Why does L1 produce exact zeros when L2 does not?',
      'The L1 penalty λ‖β‖₁ is not differentiable at zero and its constraint region is a diamond with corners; minimising tends to land on those corners where coefficients equal exactly zero.'),
    q('Mathematics', 'What does λ control?',
      'As λ grows, more coefficients are forced to zero — simpler but more biased models; as λ → 0 it approaches ordinary least squares. λ balances sparsity against fit quality.'),
    q('Algorithm', 'How does Lasso learn, given there is no closed form?',
      'Coordinate descent: update one coefficient at a time, applying the soft-thresholding operator that shrinks coefficients and snaps small ones to zero.'),
    q('Practical', 'When should you avoid Lasso?',
      'When features are strongly correlated, it picks one arbitrarily and drops the rest, losing information. Avoid it too when you need a stable full set of coefficients.')
  ],
'logistic-regression': [
    q('Foundation', 'What problem does this model solve?',
      'It is a classifier that predicts the probability a sample belongs to a category — most often binary (spam, default, disease) — outputting a probability in (0, 1) rather than a bare label.'),
    q('Mathematics', 'What does the sigmoid σ(z) = 1/(1+e^−z) do?',
      'It squashes the linear score z = β₀ + β₁x₁ + … into (0, 1). The output is the probability of the positive class, P(Y = 1 | x).'),
    q('Mathematics', 'Why is it fit by maximum likelihood rather than least squares?',
      'Because the target is a probability, squared error is unsuitable; it maximises the likelihood of the observed labels — equivalently minimises the convex log-loss (cross-entropy).'),
    q('Algorithm', 'How are its parameters learned?',
      'Gradient descent (or Newton\'s method) on the log-loss: repeatedly compute the gradient of cross-entropy with respect to β and step against it until the loss converges.'),
    q('Practical', 'When should you choose it, and when avoid it?',
      'Choose it for calibrated probabilities, interpretable log-odds coefficients, or a fast linear baseline. Avoid it when the decision boundary is strongly non-linear — use a kernel or tree model.')
  ],

  'knn': [
    q('Foundation', 'What problem does this model solve?',
      'It predicts a label (or value) by majority vote (or averaging) of the k most similar training examples — a pure instance-based approach with no assumed model form.'),
    q('Mathematics', 'What is the core distance idea?',
      'It uses a distance metric, typically Euclidean d(p,q) = √(Σ(pᵢ−qᵢ)²), to define similarity; the k smallest distances choose the voting neighbours.'),
    q('Mathematics', 'What role does k play, and how does the "curse of dimensionality" hurt?',
      'Small k is lost in noise; large k over-smooths. In high dimensions distances between all points converge and become uninformative, so k-selection is unreliable.'),
    q('Algorithm', 'Why is KNN said to have no training phase?',
      'Training is just storing the dataset — there is no learned equation. Every prediction scans all points, computes distances, and votes, which slows prediction as data grows.'),
    q('Practical', 'When should you use and avoid KNN?',
      'Use it for small-to-medium datasets with low dimension and meaningful distances. Avoid it for huge datasets, high-dimensional data, or unscaled features where distances become meaningless.')
  ],
'naive-bayes': [
    q('Foundation', 'What problem does this model solve, and why is it fast on text?',
      'It classifies by computing P(class | features) with Bayes\' theorem. On sparse high-dimensional data like word counts it is exceptionally fast and often a strong baseline.'),
    q('Mathematics', 'What is the Bayes theorem it relies on?',
      'P(C|x) = P(x|C)·P(C) / P(x): the posterior (probability of class given features) equals the likelihood times the prior, normalised.'),
    q('Mathematics', 'What exactly is the "naive" assumption?',
      'That every feature is conditionally independent of every other given the class, so the joint likelihood factorises into a product of per-feature likelihoods. Usually false, yet the model is robust in practice.'),
    q('Algorithm', 'How does it learn and predict?',
      'It counts feature occurrences per class to estimate likelihoods, applies Laplace smoothing to avoid zeros, then multiplies all feature likelihoods by the class prior and picks the highest posterior.'),
    q('Practical', 'When should you avoid Naive Bayes?',
      'When features are strongly dependent — e.g. highly correlated numeric sensors — the independence assumption distorts probabilities; it also gives poor calibration even when labels are decent.')
  ],

  'decision-tree': [
    q('Foundation', 'What problem does this model solve?',
      'It learns a sequence of if/else questions on features that separates the target classes (or minimises variance for regression), producing a transparent, human-readable flowchart.'),
    q('Mathematics', 'What is Gini impurity, and what does it measure?',
      'Gini = 1 − Σ pᵢ², with pᵢ the class fraction in a node: 0 means pure (all one class), higher means more mixed. The tree picks splits that reduce it most.'),
    q('Mathematics', 'How does information gain relate to entropy?',
      'Entropy H = −Σ pᵢ log pᵢ measures impurity in bits. Information gain is the drop in entropy after a split; the tree greedily chooses the split maximising that drop.'),
    q('Algorithm', 'How does the tree grow during training?',
      'Recursively: it evaluates every possible split on every feature, picks the one maximising purity gain, splits, and repeats on each child until leaves are pure, data runs out, or depth limits stop it.'),
    q('Practical', 'When should you avoid a single Decision Tree?',
      'On noisy data — small changes can flip the whole tree and it overfits easily. For stable accuracy prefer Random Forest or boosting; use a single tree mainly for interpretability.')
  ],
'random-forest': [
    q('Foundation', 'What problem does this model solve?',
      'It improves a single decision tree by training many trees on bootstrapped data (with random feature subsets) and averaging or voting their outputs, reducing variance and overfitting.'),
    q('Mathematics', 'How does bagging reduce variance?',
      'Averaging many slightly-different trees cancels their individual errors: the averaged prediction\'s variance is roughly σ²/B even though each tree is noisy — provided the trees are decorrelated.'),
    q('Mathematics', 'Why the extra randomness of feature subsets?',
      'If every tree used every feature, they would be highly correlated and averaging would barely help. Random feature sampling decorrelates the trees, making the variance reduction effective.'),
    q('Algorithm', 'How does it learn and predict?',
      'Training builds B bootstrap trees, each on a resampled dataset. Prediction runs a sample down every tree and returns the majority vote (classification) or the mean (regression).'),
    q('Practical', 'When should you avoid Random Forest?',
      'When you need a simple, auditable rule chain — a forest is a black-box ensemble. Also avoid it when you need very fast training on huge data; it is heavier than boosting alternatives.')
  ],

  'svm': [
    q('Foundation', 'What problem does this model solve?',
      'It finds a decision boundary (hyperplane) between classes as far as possible from the closest training points, giving a robust classifier with strong theoretical guarantees.'),
    q('Mathematics', 'What is the "maximum margin" and the objective?',
      'The margin is the distance between the hyperplane and the nearest points. The objective min ½‖w‖² (subject to correct classification) maximises that margin.'),
    q('Mathematics', 'What are support vectors, and why do they matter?',
      'They are the training points sitting on the margin edge; the optimal hyperplane depends only on them, so all other points can be discarded.'),
    q('Mathematics', 'How do kernels let SVM handle non-linear data?',
      'A kernel computes a dot product in a high-dimensional feature space implicitly (e.g. the RBF kernel), letting the linear margin machinery separate data that needed a non-linear mapping.'),
    q('Practical', 'When should you avoid SVM?',
      'On very large datasets — training scales ~O(n²)–O(n³). Also avoid it if you need probabilities directly, since it outputs a signed distance unless calibrated.')
  ],
'kmeans': [
    q('Foundation', 'What problem does this model solve?',
      'It partitions data into k groups so each point is closest to its group\'s centroid — a primary tool for customer and behavioural segmentation.'),
    q('Mathematics', 'What objective does it optimise?',
      'It minimises the within-cluster sum of squares J = Σᵢ‖xᵢ − μₖ‖², the total squared distance of each point to its assigned centroid (inertia). Smaller J means tighter clusters.'),
    q('Mathematics', 'Why can it get stuck, and what is the elbow method?',
      'The objective is non-convex, so it can converge to a local optimum depending on the initial centroids. The elbow method plots inertia vs k and picks the k where the curve flattens.'),
    q('Algorithm', 'How does Lloyd\'s algorithm run?',
      'Repeat two steps: assign every point to its nearest centroid; then move each centroid to the mean of its assigned points. Stop when assignments no longer change.'),
    q('Practical', 'When should you avoid K-Means?',
      'For elongated, overlapping, or differently-sized clusters — it assumes roughly spherical, equal-variance clusters. It is also sensitive to outliers and needs k chosen in advance.')
  ],

  'hierarchical-clustering': [
    q('Foundation', 'What problem does this model solve?',
      'It builds a full hierarchy of nested clusters — from each point as its own cluster up to one big cluster — without needing to choose k in advance, revealing structure at every granularity.'),
    q('Mathematics', 'What is a dendrogram, and how do you read it?',
      'A dendrogram is a tree whose vertical heights show the distance at which clusters merge. Cutting horizontally at any height selects that granularity\'s clustering.'),
    q('Mathematics', 'What are the linkage rules, and how do they differ?',
      'Single linkage merges the closest pair of points; complete linkage the farthest pair; Ward\'s method minimises the increase in within-cluster variance. Each yields different cluster shapes.'),
    q('Algorithm', 'How does agglomerative clustering run?',
      'Start with each point as its own cluster; repeatedly merge the two closest clusters by the chosen linkage, recording the merge height, until one cluster remains; the recorded merges form the dendrogram.'),
    q('Practical', 'When should you avoid hierarchical clustering?',
      'On large datasets — it needs O(n²) distance storage and cannot scale — or when clusters are not nested or noise is heavy, since early bad merges can never be undone.')
  ],

  'dbscan': [
    q('Foundation', 'What problem does this model solve?',
      'It finds clusters of arbitrary shape by density and labels sparse points as noise — ideal for anomaly detection and hotspots, with no need to pre-specify k.'),
    q('Mathematics', 'What are core points, border points, and noise?',
      'A core point has ≥ MinPts neighbours within radius ε. Neighbours of a core point are border points; unreachable sparse points become noise. Clusters grow by chaining core points.'),
    q('Mathematics', 'What do ε and MinPts control?',
      'ε is the neighbourhood radius defining density; MinPts is the threshold to be a core point. Together they set what counts as dense enough to be a cluster rather than noise.'),
    q('Algorithm', 'How does DBSCAN grow a cluster?',
      'Pick an unvisited point; if it is a core point, start a cluster and expand it by visiting every point reachable through the core-chain of neighbours. Points never reached remain noise.'),
    q('Practical', 'When should you avoid DBSCAN?',
      'When cluster densities vary widely — one ε cannot fit both scales, so dense clusters swallow sparse ones. It is also O(n²) naive on large data without a spatial index.')
  ],

  'pca': [
    q('Foundation', 'What problem does this model solve?',
      'It reduces dimensionality by projecting data onto the few orthogonal directions of maximal variance — for visualisation, denoising, and speeding up downstream models.'),
    q('Mathematics', 'What is the central equation, and what does it mean?',
      'The eigendecomposition Cov(X)·v = λv: eigenvectors v of the covariance matrix are the principal directions, and each eigenvalue λ is the variance captured along that direction.'),
    q('Mathematics', 'Why "maximal variance", and why are components orthogonal?',
      'The first component is the direction of greatest spread; each next one is the greatest spread perpendicular to the previous, so components carry structure without redundancy.'),
    q('Algorithm', 'How does PCA compute its components?',
      'Standardise features, build the covariance matrix, compute its eigenvectors and eigenvalues, sort by eigenvalue (variance), then project the data onto the top-k eigenvectors.'),
    q('Practical', 'When should you avoid PCA?',
      'When you need interpretable original features — components are opaque linear combinations. Also when the interesting structure is low-variance, since PCA discards low-variance directions.')
  ]
};

export default QUESTIONS;