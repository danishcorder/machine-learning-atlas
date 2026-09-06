/* ML ATLAS — Master Model Data (15 models, full schema)
 * Single source of truth. Add model #16 here + its id to MODEL_ORDER/
 * MODEL_GROUPS + its 20 answers in questions.js + a viz module + an HTML page.
 */
export const MODEL_ORDER = [
  'linear-regression','multiple-linear-regression','polynomial-regression',
  'ridge-regression','lasso-regression','logistic-regression','knn','naive-bayes',
  'decision-tree','random-forest','svm','kmeans','hierarchical-clustering','dbscan','pca'
];
export const MODEL_GROUPS = [
  { name: 'Regression', models: ['linear-regression','multiple-linear-regression','polynomial-regression','ridge-regression','lasso-regression'] },
  { name: 'Classification', models: ['logistic-regression','knn','naive-bayes','decision-tree','random-forest','svm'] },
  { name: 'Clustering', models: ['kmeans','hierarchical-clustering','dbscan'] },
  { name: 'Dimensionality Reduction', models: ['pca'] }
];
const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);
export const MODELS = [
  {
    id: 'linear-regression', name: 'Linear Regression', category: 'Regression', learningType: 'Supervised',
    problemType: 'Regression', output: 'Continuous scalar', outputType: 'scalar',
    description: 'Fits the straight-line (or hyperplane) relationship that best explains a continuous target by minimising the sum of squared vertical errors.',
    difficulty: 1, difficultyStars: stars(1), interpretability: 'High', mathematicalDepth: '★☆☆☆☆',
    computationalComplexity: 'Low (closed form)', trainingComplexity: 'Low', predictionSpeed: 'Fast',
    typicalDatasetSize: 'Small → Large', prerequisites: ['Algebra', 'Basics of supervised learning'],
    overview: 'The eldest member of the ML family: it draws the straightest line (hyperplane) through data to predict a continuous number. It is the foundation of regression.',
    strengths: ['Highly interpretable — each coefficient has a direct meaning', 'Fast to train and predict', 'Closed-form solution exists', 'Strong theoretical guarantees when linear'],
    weaknesses: ['Assumes a linear relationship', 'Sensitive to outliers', 'Cannot model non-linear patterns without feature engineering'],
    assumptions: ['Linear relationship between features and target', 'Independent, homoscedastic errors', 'Normally distributed errors (for inference)', 'No severe multicollinearity'],
    applications: [
      { problem: 'House price prediction', data: 'Historical sales', features: 'size, location score, age, bedroom count', target: 'sale price', whyThisModel: 'Price grows roughly proportionally with size; interpretability matters to buyers and agents.', expectedOutput: 'A predicted dollar value for a new listing.' },
      { problem: 'Production estimation', data: 'Hours, machines, raw-material input', features: 'machine-hours, staff count, feedstock weight', target: 'units produced', whyThisModel: 'Output scales near-linearly with input; planning needs a quick, transparent forecast.', expectedOutput: 'Expected units produced for a planned input combination.' },
      { problem: 'Sales forecasting', data: 'Ad spend, seasonality, prior sales', features: 'advertising spend, month, lag-sales', target: 'next-month sales', whyThisModel: 'Marketing ROI links approximately linearly to spend; stakeholders want to read the coefficients.', expectedOutput: 'Projected revenue for the next period.' }
    ],
    relatedModels: ['Multiple Linear Regression', 'Polynomial Regression', 'Ridge Regression', 'Lasso Regression', 'Logistic Regression'],
    evaluationMetrics: ['Mean Squared Error (MSE)', 'Root Mean Squared Error (RMSE)', 'R² (coefficient of determination)', 'MAE'],
    visualization: 'linear-regression', pagePath: 'pages/linear-regression.html',
    keywords: ['slope', 'intercept', 'least squares', 'residuals', 'gradient descent', 'OLS', 'MSE']
  },
  {
    id: 'multiple-linear-regression', name: 'Multiple Linear Regression', category: 'Regression', learningType: 'Supervised',
    problemType: 'Regression', output: 'Continuous scalar', outputType: 'scalar',
    description: 'Models y as a weighted linear combination of p predictors: y = β₀ + β₁x₁ + … + βₚxₚ, learned jointly via the normal equations (XᵀX)β = Xᵀy.',
    difficulty: 2, difficultyStars: stars(2), interpretability: 'High', mathematicalDepth: '★★☆☆☆',
    computationalComplexity: 'Low (closed form)', trainingComplexity: 'Low', predictionSpeed: 'Fast',
    typicalDatasetSize: 'Small → Large', prerequisites: ['Linear Regression', 'Linear Algebra (matrices)'],
    overview: 'Where one feature is rarely enough, it fits a hyperplane using the normal equations to learn every coefficient jointly; each coefficient is the marginal effect of its feature.',
    strengths: ['Handles many predictors while staying interpretable', 'Closed-form via normal equations', 'Each coefficient = marginal effect of its feature'],
    weaknesses: ['Multicollinearity inflates coefficient variance', 'Suffers when the true boundary is non-linear', 'Sensitive to outliers'],
    assumptions: ['Linear relationship in the feature matrix', 'Independent errors with constant variance', 'No perfect multicollinearity', 'Errors normally distributed'],
    applications: [
      { problem: 'Medical cost prediction', data: 'Age, BMI, smoker, region, dependents', features: 'age, bmi, smoker, region, children', target: 'individual medical charges', whyThisModel: 'Charges rise roughly linearly with BMI and age; insurers value an interpretable per-factor contribution.', expectedOutput: 'Predicted annual medical cost.' },
      { problem: 'Energy demand forecasting', data: 'Temperature, humidity, weekday, prior demand', features: 'temp, humidity, weekday, lag-demand', target: 'electricity load (MWh)', whyThisModel: 'Demand depends on several near-linear drivers; grid operators need fast, transparent forecasts.', expectedOutput: 'Forecasted load for the next day.' },
      { problem: 'Crop yield estimation', data: 'Rainfall, temperature, soil NPK, acreage, fertilizer', features: 'precip, temp, nitrogen, phosphorus, potassium, hectares', target: 'yield (tons/hectare)', whyThisModel: 'Yield responds approximately linearly to inputs within agronomic ranges; agronomists need the coefficients.', expectedOutput: 'Expected yield for a parcel.' }
    ],
    relatedModels: ['Linear Regression', 'Polynomial Regression', 'Ridge Regression', 'Lasso Regression'],
    evaluationMetrics: ['MSE', 'RMSE', 'R²', 'Adjusted R²', 'MAE'],
    visualization: 'multiple-linear-regression', pagePath: 'pages/multiple-linear-regression.html',
    keywords: ['design matrix', 'normal equations', 'multicollinearity', 'coefficients', 'features']
  },
  {
    id: 'polynomial-regression', name: 'Polynomial Regression', category: 'Regression', learningType: 'Supervised',
    problemType: 'Regression', output: 'Continuous scalar', outputType: 'scalar',
    description: 'Models non-linear relationships by fitting a polynomial of degree n, still solved as linear least-squares on the transformed features [x, x², …, xⁿ].',
    difficulty: 2, difficultyStars: stars(2), interpretability: 'Medium', mathematicalDepth: '★★☆☆☆',
    computationalComplexity: 'Medium', trainingComplexity: 'Medium', predictionSpeed: 'Fast',
    typicalDatasetSize: 'Small → Medium', prerequisites: ['Linear Regression', 'Polynomials'],
    overview: 'When a straight line fails, it bends the line into a curve y = β₀ + β₁x + β₂x² + … + βₙxⁿ. Still linear in the coefficients β, so it reuses linear-regression machinery while describing richer shapes.',
    strengths: ['Captures curvature without leaving least squares', 'Still linear in parameters (closed form available)', 'Controlled by one degree hyperparameter'],
    weaknesses: ['High degrees overfit badly', 'Extrapolation is unstable and can explode', 'Coefficients become hard to interpret'],
    assumptions: ['The relationship can be approximated by a smooth polynomial', 'Independent, homoscedastic residuals'],
    applications: [
      { problem: 'Material stress–strain curve', data: 'Applied load vs measured deformation', features: 'applied load (and its powers)', target: 'deformation', whyThisModel: 'The physical law is smooth and curved; polynomials approximate the elastic region well.', expectedOutput: 'Predicted deformation under a new load.' },
      { problem: 'Drug-dose response', data: 'Dose administered vs biological response', features: 'dose (and its powers)', target: 'response level', whyThisModel: 'Response curves are curved in the mid-range; a polynomial captures the shape simply.', expectedOutput: 'Predicted response at a planned dose.' },
      { problem: 'Economic growth vs time', data: 'Quarterly GDP over decades', features: 'time (and its powers)', target: 'GDP value', whyThisModel: 'Long-run GDP is curved; polynomials fit the boom–bust waves of a single series.', expectedOutput: 'Projected GDP for a future quarter.' }
    ],
    relatedModels: ['Linear Regression', 'Ridge Regression'],
    evaluationMetrics: ['MSE', 'RMSE', 'R²', 'MAE'],
    visualization: 'polynomial-regression', pagePath: 'pages/polynomial-regression.html',
    keywords: ['polynomial', 'degree', 'overfitting', 'curve fitting', 'transformed features']
  },
  {
    id: 'ridge-regression', name: 'Ridge Regression', category: 'Regression', learningType: 'Supervised',
    problemType: 'Regression', output: 'Continuous scalar', outputType: 'scalar',
    description: 'Adds an L2 penalty λ‖β‖² to least squares, shrinking coefficients toward zero to reduce variance and handle multicollinearity.',
    difficulty: 2, difficultyStars: stars(2), interpretability: 'Medium', mathematicalDepth: '★★★☆☆',
    computationalComplexity: 'Medium', trainingComplexity: 'Medium', predictionSpeed: 'Fast',
    typicalDatasetSize: 'Small → Large', prerequisites: ['Linear Regression', 'Regularization'],
    overview: 'Ridge keeps every feature but gently pushes all coefficients toward zero via an L2 penalty. The shrinkage trades a little bias for a large reduction in variance — the bias-variance trade-off in a closed form.',
    strengths: ['Handles multicollinearity gracefully', 'Always has a closed-form solution', 'Reduces overfitting vs plain OLS'],
    weaknesses: ['Does not perform feature selection — all coefficients stay non-zero', 'Coefficients stay, just smaller', 'Requires feature scaling for a fair penalty'],
    assumptions: ['Linear relationship in features', 'Independent, homoscedastic residuals', 'Features standardised before penalising'],
    applications: [
      { problem: 'Genomics (gene-expression) prediction', data: 'Thousands of gene expressions, few samples, many correlated', features: 'gene expression levels', target: 'disease biomarker level', whyThisModel: 'p ≫ n and genes are highly correlated; Ridge stabilises the fit.', expectedOutput: 'Predicted biomarker concentration.' },
      { problem: 'Econometric forecasting', data: 'Many economic indicators, some collinear', features: 'GDP, inflation, unemployment, interest rate', target: 'next-quarter growth', whyThisModel: 'Indicators move together; Ridge tames the unstable coefficients.', expectedOutput: 'Forecasted economic growth.' },
      { problem: 'House-price regression with many features', data: 'Size, location, age, school, commute, amenities', features: 'lots of housing attributes', target: 'price', whyThisModel: 'Too many collinear features for plain OLS; Ridge keeps everything while stabilising.', expectedOutput: 'Predicted price.' }
    ],
    relatedModels: ['Linear Regression', 'Lasso Regression', 'Polynomial Regression'],
    evaluationMetrics: ['MSE', 'RMSE', 'R²', 'MAE'],
    visualization: 'ridge-regression', pagePath: 'pages/ridge-regression.html',
    keywords: ['L2', 'lambda', 'shrinkage', 'regularization', 'multicollinearity', 'bias-variance']
  },
  {
    id: 'lasso-regression', name: 'Lasso Regression', category: 'Regression', learningType: 'Supervised',
    problemType: 'Regression', output: 'Continuous scalar', outputType: 'scalar',
    description: 'Adds an L1 penalty λ‖β‖₁ which can drive coefficients exactly to zero, performing automatic feature selection alongside shrinkage.',
    difficulty: 3, difficultyStars: stars(3), interpretability: 'High', mathematicalDepth: '★★★☆☆',
    computationalComplexity: 'Medium', trainingComplexity: 'Medium', predictionSpeed: 'Fast',
    typicalDatasetSize: 'Small → Large', prerequisites: ['Linear Regression', 'Regularization', 'Convex Optimization'],
    overview: 'Lasso (Least Absolute Shrinkage and Selection Operator) adds an L1 penalty. Because the L1 ball has corners, some coefficients are pushed exactly to zero, yielding a sparse, interpretable model that simultaneously selects features.',
    strengths: ['Performs automatic feature selection', 'Sparse, interpretable models', 'Ideal when only a few features matter'],
    weaknesses: ['With correlated features it may pick one arbitrarily', 'No closed-form solution (coordinate descent)', 'Sensitive to scaling'],
    assumptions: ['Linear relationship in features', 'Independent, homoscedastic residuals', 'Features standardised before penalising'],
    applications: [
      { problem: 'DNA-microarray biomarker discovery', data: 'Tens of thousands of genes, few patients', features: 'gene expression', target: 'disease severity', whyThisModel: 'Only a handful of genes actually matter; Lasso zeroes the rest.', expectedOutput: 'A sparse model plus a severity prediction.' },
      { problem: 'Text sentiment regression (bag-of-words)', data: 'Thousands of word-count features', features: 'word counts / TF-IDF', target: 'sentiment score', whyThisModel: 'Most words are irrelevant; Lasso selects the discriminative ones.', expectedOutput: 'Predicted sentiment and the selected vocabulary.' },
      { problem: 'Medical risk-factor selection', data: 'Many potential risk factors, only some causal', features: 'age, bmi, cholesterol, lifestyle, genes', target: '10-year cardiovascular risk', whyThisModel: 'Clinicians want a small, defensible set of risk factors, not every variable.', expectedOutput: 'A lean risk model and a risk score.' }
    ],
    relatedModels: ['Linear Regression', 'Ridge Regression', 'Elastic Net'],
    evaluationMetrics: ['MSE', 'RMSE', 'R²', 'MAE'],
    visualization: 'lasso-regression', pagePath: 'pages/lasso-regression.html',
    keywords: ['L1', 'lambda', 'sparsity', 'feature selection', 'coordinate descent', 'absolute penalty']
  },
  {
    id: 'logistic-regression', name: 'Logistic Regression', category: 'Classification', learningType: 'Supervised',
    problemType: 'Classification (binary / multinomial)', output: 'Class probability in (0, 1)', outputType: 'probability',
    description: 'Applies a logistic (sigmoid) link to a linear score so the model outputs a probability and learns via maximum likelihood.',
    difficulty: 2, difficultyStars: stars(2), interpretability: 'High', mathematicalDepth: '★★★☆☆',
    computationalComplexity: 'Low', trainingComplexity: 'Low', predictionSpeed: 'Fast',
    typicalDatasetSize: 'Small → Large', prerequisites: ['Linear Regression', 'Probability', 'Maximum Likelihood', 'Gradients'],
    overview: 'Despite its name, Logistic Regression is a classifier. It takes a linear score z and squashes it through the sigmoid σ(z) = 1/(1+e^−z), turning any real-valued score into a probability between 0 and 1.',
    strengths: ['Outputs calibrated probabilities', 'Coefficients are interpretable log-odds', 'Fast, convex training'],
    weaknesses: ['Assumes a linear decision boundary in feature space', 'Needs the log-loss objective, not squared error', 'Multicollinearity can destabilise coefficients'],
    assumptions: ['Linear relationship between features and log-odds', 'Observations independent', 'No severe multicollinearity'],
    applications: [
      { problem: 'Email spam detection', data: 'Email body word counts and header features', features: 'word/TF-IDF counts, sender reputation, punctuation', target: 'spam (0/1)', whyThisModel: 'Spams differ linearly in log-odds of certain words; probabilities let you set a threshold per user.', expectedOutput: 'spam probability; classify above threshold as spam.' },
      { problem: 'Customer purchase prediction', data: 'Browsing history, demographics, past purchases', features: 'time on site, pages viewed, age, income, recency', target: 'purchased (0/1)', whyThisModel: 'Conversion rises roughly linearly in features on the log-odds scale; marketing wants both a label and a probability to bid with.', expectedOutput: 'Conversion probability for a targeted campaign.' },
      { problem: 'Medical diagnosis (disease present?)', data: 'Vital signs, lab values, age, sex', features: 'blood pressure, cholesterol, age, bmi', target: 'disease (0/1)', whyThisModel: 'Clinicians need interpretable risk factors and a probability to decide on follow-up.', expectedOutput: 'Probability of disease and the contributing risk factors.' }
    ],
    relatedModels: ['Linear Regression', 'Naive Bayes', 'SVM', 'Random Forest'],
    evaluationMetrics: ['Log-loss / Cross-entropy', 'Accuracy', 'Precision', 'Recall', 'F1', 'AUC-ROC'],
    visualization: 'logistic-regression', pagePath: 'pages/logistic-regression.html',
    keywords: ['sigmoid', 'log-odds', 'log-loss', 'cross-entropy', 'maximum likelihood', 'decision boundary']
  },
  {
    id: 'knn', name: 'K-Nearest Neighbors', category: 'Classification', learningType: 'Supervised',
    problemType: 'Classification / Regression', output: 'Class label (classification) or averaged value (regression)', outputType: 'label-or-scalar',
    description: 'Instance-based learner that classifies a point by majority vote of its k nearest stored examples in feature space.',
    difficulty: 1, difficultyStars: stars(1), interpretability: 'Medium', mathematicalDepth: '★★☆☆☆',
    computationalComplexity: 'Medium (training) / High (prediction)', trainingComplexity: 'None (lazy)', predictionSpeed: 'Slow (scales with dataset)',
    typicalDatasetSize: 'Small → Medium', prerequisites: ['Distance metrics', 'Vectors'],
    overview: 'KNN makes no model assumptions about how data was generated. It stores every training example and, at prediction time, looks at the k most similar (nearest) neighbours and lets them vote.',
    strengths: ['No training phase — pure memorization', 'Naturally handles non-linear boundaries', 'Easy to add new data — re-train by appending'],
    weaknesses: ['Prediction cost grows with data size', 'Performance hinges on distance metric and feature scaling', 'Curse of dimensionality degrades distance quality'],
    assumptions: ['Similar points have similar labels (continuity)', 'Features are on comparable scales', 'Relevant features are included'],
    applications: [
      { problem: 'Recommendation (find similar users)', data: 'User item-rating vectors', features: 'purchase/rating vectors', target: 'preferred items', whyThisModel: 'Similar users buy similar things; KNN finds them directly.', expectedOutput: 'Top-k similar users → recommended items.' },
      { problem: 'Medical nearest-case retrieval', data: 'Patient records with vitals + outcome', features: 'vital signs, lab results, demographics', target: 'outcome / similar case', whyThisModel: 'No parametric assumption about disease models; clinicians trust local analogues.', expectedOutput: 'k most similar historical patients and their outcomes.' },
      { problem: 'Image-based species ID', data: 'Photo feature vectors of plants/animals', features: 'extracted visual features', target: 'species label', whyThisModel: 'Same species look similar in feature space; KNN is label-free training.', expectedOutput: 'Likely species and closest reference photos.' }
    ],
    relatedModels: ['Logistic Regression', 'SVM', 'Decision Tree'],
    evaluationMetrics: ['Accuracy', 'Precision', 'Recall', 'F1', 'MAE (regression)'],
    visualization: 'knn', pagePath: 'pages/knn.html',
    keywords: ['distance', 'majority vote', 'k', 'curse of dimensionality', 'lazy learning', 'Euclidean']
  },
  {
    id: 'naive-bayes', name: 'Naive Bayes', category: 'Classification', learningType: 'Supervised',
    problemType: 'Classification', output: 'Posterior class probabilities', outputType: 'probability',
    description: 'Applies Bayes\' theorem with a strong (naive) conditional-independence assumption between features to estimate P(class | features).',
    difficulty: 2, difficultyStars: stars(2), interpretability: 'High', mathematicalDepth: '★★★☆☆',
    computationalComplexity: 'Low', trainingComplexity: 'Low', predictionSpeed: 'Fast',
    typicalDatasetSize: 'Small → Large', prerequisites: ['Probability', 'Bayes theorem', 'Conditional probability'],
    overview: 'Naive Bayes turns classification into a probability problem using Bayes\' theorem, assuming all features are independent given the class. The "naive" assumption is often false, yet the classifier is remarkably robust — especially on text.',
    strengths: ['Fast training and prediction', 'Works well with high-dimensional sparse data (text)', 'Handles multi-class naturally'],
    weaknesses: ['Conditional-independence assumption is usually violated', 'Zero-frequency needs smoothing (Laplace)', 'Probability estimates can be poor when assumptions fail'],
    assumptions: ['Features are conditionally independent given the class (naive assumption)', 'Each feature contributes reliably with smoothing'],
    applications: [
      { problem: 'Email / document classification', data: 'Word counts in documents', features: 'word frequencies', target: 'topic / spam / not-spam', whyThisModel: 'Word counts are sparse and high-dimensional; NB is the textbook baseline for text.', expectedOutput: 'Class posterior probabilities.' },
      { problem: 'Sentiment analysis', data: 'Short reviews (movie, product)', features: 'word presence / TF-IDF', target: 'positive / negative', whyThisModel: 'NB is fast, scales to huge vocabularies, and beats fancier models on noisy short text.', expectedOutput: 'Sentiment label and confidence.' },
      { problem: 'Medical triage risk scoring', data: 'Symptoms + vitals', features: 'symptom indicators, temperature, heart rate', target: 'low / medium / high risk', whyThisModel: 'Priors from population rates combine cleanly; fast enough for bedside triage.', expectedOutput: 'Risk-category posterior probabilities.' }
    ],
    relatedModels: ['Logistic Regression', 'Decision Tree'],
    evaluationMetrics: ['Accuracy', 'Precision', 'Recall', 'F1', 'Log-loss'],
    visualization: 'naive-bayes', pagePath: 'pages/naive-bayes.html',
    keywords: ['Bayes theorem', 'posterior', 'prior', 'likelihood', 'conditional independence', 'smoothing', 'Gaussian']
  },
  {
    id: 'decision-tree', name: 'Decision Tree', category: 'Classification', learningType: 'Supervised',
    problemType: 'Classification / Regression', output: 'Class label or continuous value', outputType: 'label-or-scalar',
    description: 'Learns a tree of hierarchical if/else splits on features, maximising class purity (Gini or entropy) at each node.',
    difficulty: 2, difficultyStars: stars(2), interpretability: 'High', mathematicalDepth: '★★☆☆☆',
    computationalComplexity: 'Medium', trainingComplexity: 'Low', predictionSpeed: 'Fast',
    typicalDatasetSize: 'Small → Medium', prerequisites: ['Probability', 'Entropy', 'Information gain', 'Gini impurity'],
    overview: 'A Decision Tree asks a sequence of yes/no questions, each chosen to maximally separate the classes (or reduce variance), until the leaves are as pure as possible. The tree itself is the model.',
    strengths: ['Highly interpretable — reads like a flowchart', 'Handles numeric and categorical features without scaling', 'Fast to train and predict'],
    weaknesses: ['Greedy splits are myopic — suboptimal globally', 'Prone to overfitting (high variance)', 'Small data changes can flip the whole tree'],
    assumptions: ['The target can be segmented by axis-aligned splits on features'],
    applications: [
      { problem: 'Loan approval', data: 'Income, credit score, debt, employment', features: 'annual income, credit score, dti, tenure', target: 'approved / rejected', whyThisModel: 'Underwriters want an auditable rule chain; the tree gives an explicit decision path.', expectedOutput: 'Approval decision plus the reasoning chain.' },
      { problem: 'Customer churn prediction', data: 'Usage metrics, plan type, support tickets', features: 'login frequency, plan tier, n_tickets, tenure', target: 'churned / retained', whyThisModel: 'Business users can follow the if/else rules to craft retention offers.', expectedOutput: 'Churn prediction and the segments driving it.' },
      { problem: 'Medical triage decision', data: 'Vitals and symptoms', features: 'blood pressure, heart rate, respiratory rate, pain score', target: 'triage level (red/yellow/green)', whyThisModel: 'Clinicians trust transparent threshold rules derived from data.', expectedOutput: 'Triage category and the clinical thresholds used.' }
    ],
    relatedModels: ['Random Forest', 'KNN', 'Naive Bayes'],
    evaluationMetrics: ['Gini impurity', 'Information gain', 'Entropy', 'Accuracy', 'Precision', 'Recall', 'F1'],
    visualization: 'decision-tree', pagePath: 'pages/decision-tree.html',
    keywords: ['Gini', 'entropy', 'information gain', 'purity', 'split', 'leaf', 'overfitting']
  },
  {
    id: 'random-forest', name: 'Random Forest', category: 'Ensemble', learningType: 'Supervised',
    problemType: 'Classification / Regression', output: 'Class label or value (majority vote / average)', outputType: 'label-or-scalar',
    description: 'Bagging ensemble of decision trees trained on bootstrap samples with random feature subsets; predictions are majority vote (classification) or averaging (regression).',
    difficulty: 3, difficultyStars: stars(3), interpretability: 'Medium', mathematicalDepth: '★★☆☆☆',
    computationalComplexity: 'High (training) / Fast (prediction)', trainingComplexity: 'High', predictionSpeed: 'Fast',
    typicalDatasetSize: 'Medium → Large', prerequisites: ['Decision Tree', 'Bootstrapping', 'Ensemble methods'],
    overview: 'Random Forest trains many decision trees on different bootstrapped subsets (and random feature subsets), then lets them vote. The randomness decorrelates the trees so their errors cancel instead of compounding.',
    strengths: ['Strong accuracy "out of the box"', 'Resistant to overfitting via averaging', 'Handles mixed feature types and missing values'],
    weaknesses: ['Slower to train and heavier than a single tree', 'Less interpretable than a single tree (black-box ensemble)', 'Can overfit noisy data with very deep trees'],
    assumptions: ['Aggregating decorrelated trees reduces variance', 'Bootstrap samples represent the population distribution'],
    applications: [
      { problem: 'Credit scoring', data: 'Financial history, demographics, payment behaviour', features: 'balance, delinquencies, income, age', target: 'default / no-default', whyThisModel: 'Many interacting, non-linear signals; the forest captures them without hand-engineering.', expectedOutput: 'Default probability and a credit decision.' },
      { problem: 'Fraud detection', data: 'Transaction logs with behavioural features', features: 'amount, merchant, location, velocity, time', target: 'fraud / legit', whyThisModel: 'Fraud patterns are rare and non-linear; the forest\'s diversity spots outliers.', expectedOutput: 'Fraud risk score and flagged transactions.' },
      { problem: 'Predictive maintenance', data: 'Sensor telemetry over time', features: 'vibration, temp, pressure, cycles, error counts', target: 'failure within window (0/1)', whyThisModel: 'Failure depends on subtle interactions; RandomForest models them without a parametric form.', expectedOutput: 'Time-to-failure risk per machine.' }
    ],
    relatedModels: ['Decision Tree', 'SVM', 'Gradient Boosting'],
    evaluationMetrics: ['Accuracy', 'Precision', 'Recall', 'F1', 'AUC-ROC', 'Feature importance (Gini)'],
    visualization: 'random-forest', pagePath: 'pages/random-forest.html',
    keywords: ['ensemble', 'bagging', 'bootstrap', 'feature bagging', 'majority vote', 'decorrelation', 'feature importance']
  },
  {
    id: 'svm', name: 'Support Vector Machine', category: 'Classification', learningType: 'Supervised',
    problemType: 'Classification / Regression', output: 'Class label via sign of decision function', outputType: 'label',
    description: 'Finds the maximum-margin separating hyperplane; uses support vectors and kernels to handle non-linear boundaries.',
    difficulty: 4, difficultyStars: stars(4), interpretability: 'Medium', mathematicalDepth: '★★★★☆',
    computationalComplexity: 'High (training) / Fast (prediction)', trainingComplexity: 'High', predictionSpeed: 'Fast',
    typicalDatasetSize: 'Small → Medium', prerequisites: ['Linear Algebra', 'Optimization', 'KKT conditions', 'Kernels'],
    overview: 'SVM draws the widest possible "street" (margin) between the two classes and places the decision boundary in its centre. Only points exactly on the margin — the support vectors — matter for the solution.',
    strengths: ['Maximum-margin decision boundary is robust', 'Kernels map to high dimensions cheaply', 'Strong theoretical foundation (VC dimension)'],
    weaknesses: ['Training is O(n²)–O(n³) — does not scale to big data', 'No probabilities by default (needs calibration)', 'Sensitive to kernel choice and hyperparameters'],
    assumptions: ['Classes are separable (soft-margin allows some error)', 'A good kernel exists for the true boundary'],
    applications: [
      { problem: 'Image-based face detection', data: 'HOG / pixel feature vectors', features: 'bag-of-visual-words / HOG descriptors', target: 'face / not-face', whyThisModel: 'High-dimensional but often separable; kernels handle the non-linear face manifold cheaply.', expectedOutput: 'Binary face decision and support vectors.' },
      { problem: 'Text categorisation (news topic)', data: 'Document TF-IDF vectors', features: 'high-dimensional sparse TF-IDF', target: 'topic category', whyThisModel: 'Sparse high-dim data is often linearly separable; SVM is the classic text baseline.', expectedOutput: 'Topic label for a new article.' },
      { problem: 'Bioinformatics protein family', data: 'Protein sequence profile vectors', features: 'evolutionary profile scores', target: 'protein family', whyThisModel: 'Feature dimension ≫ sample count; the max-margin boundary generalizes well in high dimensions.', expectedOutput: 'Protein family assignment.' }
    ],
    relatedModels: ['Logistic Regression', 'Kernel Methods', 'Random Forest'],
    evaluationMetrics: ['Accuracy', 'Precision', 'Recall', 'F1', 'AUC-ROC', 'Margin', 'Number of support vectors'],
    visualization: 'svm', pagePath: 'pages/svm.html',
    keywords: ['margin', 'support vectors', 'kernel', 'hard margin', 'soft margin', 'hyperplane', 'Lagrangian']
  },
  {
    id: 'kmeans', name: 'K-Means Clustering', category: 'Clustering', learningType: 'Unsupervised',
    problemType: 'Clustering', output: 'Cluster assignments and centroids', outputType: 'cluster-labels',
    description: 'Partitions n data points into k clusters by alternating between assigning points to the nearest centroid and moving centroids to the cluster mean until convergence.',
    difficulty: 2, difficultyStars: stars(2), interpretability: 'High', mathematicalDepth: '★★☆☆☆',
    computationalComplexity: 'Medium', trainingComplexity: 'Low', predictionSpeed: 'Fast',
    typicalDatasetSize: 'Medium → Large', prerequisites: ['Distance metrics', 'Means', 'Lloyd\'s algorithm'],
    overview: 'K-Means asks: "If I must divide my data into k groups, which division keeps every point closest to its group centre?" It answers by bouncing between assigning points to the nearest centroid and recomputing those centroids.',
    strengths: ['Simple, fast, and scales well', 'Easy to interpret — centroids are real points', 'Widely used baseline for clustering'],
    weaknesses: ['Needs k in advance (use elbow/silhouette to guess)', 'Sensitive to initial centroids and outliers', 'Only finds spherical clusters of similar size'],
    assumptions: ['Clusters are spherical and roughly equal in size and variance', 'The number of clusters k is known or estimable'],
    applications: [
      { problem: 'Customer segmentation', data: 'Purchase history, frequency, recency', features: 'recency, frequency, monetary value', target: 'customer segments', whyThisModel: 'Customers form natural blobs in RFM space; K-means segments them for targeted marketing.', expectedOutput: 'k behavioural segments.' },
      { problem: 'Image colour quantisation', data: 'Pixel RGB values of an image', features: 'R, G, B per pixel', target: 'reduced colour palette', whyThisModel: 'Colours group into blobs in RGB space; K-means reduces an image to k colours.', expectedOutput: 'A palette of k representative colours.' },
      { problem: 'Document topic grouping', data: 'TF-IDF vectors of documents', features: 'TF-IDF components', target: 'topic groups', whyThisModel: 'Documents on the same topic form dense regions in TF-IDF space.', expectedOutput: 'k topic clusters.' }
    ],
    relatedModels: ['Hierarchical Clustering', 'DBSCAN', 'PCA (for pre-projection)'],
    evaluationMetrics: ['Within-cluster sum of squares (WCSS / inertia)', 'Elbow method', 'Silhouette score'],
    visualization: 'kmeans', pagePath: 'pages/kmeans.html',
    keywords: ['centroid', 'Lloyd', 'WCSS', 'inertia', 'elbow', 'k', 'assignment', 'update']
  },
  {
    id: 'hierarchical-clustering', name: 'Hierarchical Clustering', category: 'Clustering', learningType: 'Unsupervised',
    problemType: 'Clustering', output: 'Tree of nested clusters (dendrogram)', outputType: 'cluster-tree',
    description: 'Builds a hierarchy of clusters either by merging smaller clusters (agglomerative) or splitting larger ones (divisive), visualised as a dendrogram.',
    difficulty: 3, difficultyStars: stars(3), interpretability: 'High', mathematicalDepth: '★★☆☆☆',
    computationalComplexity: 'Medium', trainingComplexity: 'Medium', predictionSpeed: 'Medium',
    typicalDatasetSize: 'Small → Medium', prerequisites: ['Distance metrics', 'Linkage', 'Dendrogram'],
    overview: 'Hierarchical Clustering doesn\'t commit to one k up front. Agglomerative clustering starts with every point as its own cluster and repeatedly fuses the two closest clusters, producing a tree (dendrogram) that reveals structure at every granularity.',
    strengths: ['No need to pre-specify k (read off the dendrogram)', 'Reveals nested structure', 'Works with arbitrary distance metrics and linkage'],
    weaknesses: ['O(n²) memory — doesn\'t scale to big data', 'Once merged, clusters cannot be split (greedy)', 'Sensitive to noise and linkage choice'],
    assumptions: ['Cluster structure is nested/hierarchical', 'A meaningful distance between clusters exists'],
    applications: [
      { problem: 'Biology — gene expression', data: 'Expression levels across conditions', features: 'gene expression vectors', target: 'gene family / co-expression tree', whyThisModel: 'Genes in the same pathway cluster at multiple resolutions; the dendrogram guides biology.', expectedOutput: 'A dendrogram of gene relationships.' },
      { problem: 'Document similarity taxonomy', data: 'TF-IDF of news articles', features: 'TF-IDF / embedding vectors', target: 'topic hierarchy', whyThisModel: 'Articles relate at multiple granularities; the tree exposes this.', expectedOutput: 'A topic dendrogram.' },
      { problem: 'Market-product taxonomy', data: 'Purchase co-occurrence between products', features: 'product association vectors', target: 'product hierarchy', whyThisModel: 'Products group at multiple levels; the dendrogram defines catalogue structure.', expectedOutput: 'A product-category tree.' }
    ],
    relatedModels: ['K-Means', 'DBSCAN'],
    evaluationMetrics: ['Cophenetic correlation', 'Dunn index', 'Within-set link (visual)'],
    visualization: 'hierarchical-clustering', pagePath: 'pages/hierarchical-clustering.html',
    keywords: ['dendrogram', 'agglomerative', 'linkage', 'single linkage', 'complete linkage', 'Ward', 'merge']
  },
  {
    id: 'dbscan', name: 'DBSCAN', category: 'Clustering', learningType: 'Unsupervised',
    problemType: 'Clustering', output: 'Clusters of arbitrary shape plus noise labels', outputType: 'cluster-labels',
    description: 'Density-based clustering that grows clusters from dense regions, treating sparse points as noise without needing k.',
    difficulty: 3, difficultyStars: stars(3), interpretability: 'Medium', mathematicalDepth: '★★★☆☆',
    computationalComplexity: 'Medium', trainingComplexity: 'Medium', predictionSpeed: 'Medium',
    typicalDatasetSize: 'Small → Medium', prerequisites: ['Density', 'ε-neighbourhood', 'Core points'],
    overview: 'DBSCAN (Density-Based Spatial Clustering of Applications with Noise) defines clusters as dense regions separated by sparse regions. A point is a "core" point if it has at least MinPts neighbours within radius ε; clusters grow by chaining core points.',
    strengths: ['Finds clusters of arbitrary shape', 'Doesn\'t need k — produces noise labels', 'Works on non-convex clusters'],
    weaknesses: ['Struggles with varying density', 'Sensitive to ε and MinPts', 'O(n²) naive (O(n log n) with spatial indexing)'],
    assumptions: ['Clusters have distinguishable density from noise', 'The ε / MinPts setting reflects true density gaps'],
    applications: [
      { problem: 'Anomaly detection in monitoring', data: 'IoT sensor streams', features: 'sensor readings over time', target: 'normal clusters + anomalies', whyThisModel: 'Normal readings form dense regions; attacks/spikes are sparse noise the algorithm flags automatically.', expectedOutput: 'Normal clusters and anomaly scores.' },
      { problem: 'Geographic hotspot detection', data: 'Latitude/longitude of incidents', features: 'lat, lon', target: 'crime hotspots vs background', whyThisModel: 'Crime clusters are dense blobs of arbitrary shape; background incidents are noise.', expectedOutput: 'Hotspot polygons and outlier incidents.' },
      { problem: 'Astronomy star/galaxy grouping', data: 'Photometric feature vectors', features: 'magnitudes in several bands', target: 'stellar populations + noise outliers', whyThisModel: 'Stars of a population form dense regions in colour–magnitude space; faint outliers are noise.', expectedOutput: 'Object groups and anomalous detections.' }
    ],
    relatedModels: ['K-Means', 'Hierarchical Clustering'],
    evaluationMetrics: ['Adjusted Rand Index', 'Silhouette (on non-noise)', 'Noise fraction'],
    visualization: 'dbscan', pagePath: 'pages/dbscan.html',
    keywords: ['density', 'epsilon', 'MinPts', 'core point', 'border', 'noise', 'arbitrary shape']
  },
  {
    id: 'pca', name: 'Principal Component Analysis', category: 'Dimensionality Reduction', learningType: 'Unsupervised',
    problemType: 'Dimensionality Reduction / Visualisation', output: 'Orthogonal components capturing maximal variance', outputType: 'components',
    description: 'Linear, unsupervised transformation that projects data onto the orthogonal directions of maximal variance (eigenvectors of the covariance matrix) for compression and visualisation.',
    difficulty: 4, difficultyStars: stars(4), interpretability: 'Medium', mathematicalDepth: '★★★★☆',
    computationalComplexity: 'Medium', trainingComplexity: 'Medium', predictionSpeed: 'Fast',
    typicalDatasetSize: 'Medium → Large', prerequisites: ['Linear Algebra (eigenvectors, covariance)', 'Variance'],
    overview: 'PCA finds new axes — the principal components — along which the data varies the most. Projecting onto the top few components compresses the data while retaining most of its variance, removing redundancy and noise.',
    strengths: ['Optimal linear compression (minimises reconstruction error)', 'Removes multicollinearity and noise', 'Speeds up downstream models'],
    weaknesses: ['Components are linear combinations — hard to interpret', 'Loses the original features', 'Assumes high-variance directions are most important'],
    assumptions: ['Directions of high variance are the most informative', 'Linear combinations capture the structure'],
    applications: [
      { problem: 'Visualising high-dim data', data: 'Any high-dimensional dataset', features: 'raw features', target: '2D/3D scatter to see clusters', whyThisModel: 'Humans can\'t plot 50D; PCA projects down to 2D/3D preserving the most structure.', expectedOutput: 'A 2D scatter coloured by class.' },
      { problem: 'Face recognition (Eigenfaces)', data: 'Pixel arrays of faces', features: 'pixel intensities', target: 'compact face representation', whyThisModel: 'Faces live on a low-dimensional subspace; PCA extracts the eigenfaces spanning it.', expectedOutput: 'A few components representing each face.' },
      { problem: 'Preprocessing before clustering/regression', data: 'Thousand-column feature matrices', features: 'many correlated features', target: 'denoised, low-dim input', whyThisModel: 'Curse of dimensionality breaks distances and inflates variance; PCA cures both.', expectedOutput: 'Reduced feature matrix ready for modelling.' }
    ],
    relatedModels: ['t-SNE', 'UMAP', 'Factor Analysis'],
    evaluationMetrics: ['Explained variance ratio', 'Cumulative explained variance', 'Reconstruction error'],
    visualization: 'pca', pagePath: 'pages/pca.html',
    keywords: ['eigenvector', 'eigenvalue', 'covariance matrix', 'variance', 'projection', 'explained variance', 'orthonormal']
  }
];


/* Standardized teaching schema layered onto every model. These fields make each
 * page answer the same six learning questions: intuition, math, assumptions,
 * tuning, visualization behavior and industry fit. */
export const MODEL_GUIDES = {
  'linear-regression': { objective:'$$\\min_{\\beta_0,\\beta_1}\\;\\frac{1}{n}\\sum_{i=1}^{n}(y_i-(\\beta_0+\\beta_1x_i))^2$$', optimization:'Ordinary least squares has a closed-form solution; gradient descent is useful for showing how iterative optimization follows the negative MSE gradient.', hyperparameters:[['learning rate η','Controls gradient-descent step size in the lab.'],['iterations','Controls how long iterative fitting runs.'],['fit intercept','Whether the model learns β₀.']] },
  'multiple-linear-regression': { objective:'$$\\min_{\\boldsymbol\\beta}\\;\\|\\mathbf y-\\mathbf X\\boldsymbol\\beta\\|_2^2$$', optimization:'Solve the normal equations when stable, or use gradient-based / numerical least-squares methods for larger systems.', hyperparameters:[['feature set','Changes the hyperplane and coefficient interpretation.'],['fit intercept','Adds or removes β₀.'],['feature scaling','Not required for OLS itself, but useful for conditioning and coefficient comparison.']] },
  'polynomial-regression': { objective:'$$\\min_{\\boldsymbol\\beta}\\;\\sum_i(y_i-\\sum_{j=0}^{d}\\beta_jx_i^j)^2$$', optimization:'Polynomial features turn the problem into ordinary linear least squares in an expanded feature space.', hyperparameters:[['degree d','Higher degree increases flexibility and overfitting risk.'],['regularization','Stabilizes high-degree fits.'],['feature scaling','Important when powers of x have very different magnitudes.']] },
  'ridge-regression': { objective:'$$\\min_{\\boldsymbol\\beta}\\;\\|\\mathbf y-\\mathbf X\\boldsymbol\\beta\\|_2^2+\\lambda\\|\\boldsymbol\\beta\\|_2^2$$', optimization:'Closed form or gradient methods; the L2 penalty continuously shrinks coefficients.', hyperparameters:[['λ (alpha)','Larger λ means stronger shrinkage and higher bias.'],['feature scaling','Essential so the penalty treats coefficients comparably.'],['fit intercept','Usually exclude the intercept from regularization.']] },
  'lasso-regression': { objective:'$$\\min_{\\boldsymbol\\beta}\\;\\|\\mathbf y-\\mathbf X\\boldsymbol\\beta\\|_2^2+\\lambda\\|\\boldsymbol\\beta\\|_1$$', optimization:'Coordinate descent or proximal methods handle the non-differentiable L1 corner and can create exact zeros.', hyperparameters:[['λ (alpha)','Controls sparsity: larger values zero more coefficients.'],['max iterations','Sets the optimization budget.'],['feature scaling','Critical for fair L1 penalization.']] },
  'logistic-regression': { objective:'$$\\min_{\\boldsymbol\\beta}-\\sum_i[y_i\\log p_i+(1-y_i)\\log(1-p_i)]$$', optimization:'Gradient-based optimization minimizes binary cross-entropy; regularization is usually added in practice.', hyperparameters:[['decision threshold','Changes the precision/recall trade-off without retraining.'],['regularization strength','Controls coefficient magnitude and overfitting.'],['class weights','Useful for imbalanced classification.']] },
  'knn': { objective:'$$\\hat y(\\mathbf x)=\\operatorname{mode}\\{y_i: i\\in N_K(\\mathbf x)\\}$$', optimization:'KNN has no parameter-fitting stage; prediction performs a neighbour search under the chosen distance metric.', hyperparameters:[['K','Small K is flexible/noisy; large K is smoother and more biased.'],['distance metric','Defines what “near” means.'],['weights','Uniform or distance-weighted voting changes neighbour influence.']] },
  'naive-bayes': { objective:'$$\\hat y=\\arg\\max_c P(c)\\prod_j P(x_j\\mid c)$$', optimization:'Estimate priors and class-conditional distributions from data; no iterative gradient optimization is required.', hyperparameters:[['smoothing α','Prevents zero probabilities for unseen categorical counts.'],['distribution family','Gaussian, Multinomial or Bernoulli should match the feature type.'],['class priors','Can be learned or supplied.']] },
  'decision-tree': { objective:'$$\\text{choose split }s^*=\\arg\\max_s\\;\\Delta I(s)$$', optimization:'Greedy recursive partitioning selects the split with the largest impurity decrease at each node.', hyperparameters:[['max depth','Primary control on model complexity.'],['min samples split/leaf','Prevents tiny unstable leaves.'],['criterion','Gini, entropy or task-specific impurity.']] },
  'random-forest': { objective:'$$\\hat f(\\mathbf x)=\\frac{1}{B}\\sum_{b=1}^{B} f_b(\\mathbf x)\\quad\\text{or majority vote}$$', optimization:'Train many randomized trees on bootstrap samples and aggregate their predictions to reduce variance.', hyperparameters:[['n_estimators','More trees usually stabilize predictions at higher compute cost.'],['max features','Controls tree correlation and diversity.'],['max depth','Controls individual-tree complexity.']] },
  'svm': { objective:'$$\\min_{\\mathbf w,b,\\xi}\\;\\frac12\\|\\mathbf w\\|^2+C\\sum_i\\xi_i\\;\\;\\text{s.t. }y_i(\\mathbf w^T\\mathbf x_i+b)\\ge1-\\xi_i$$', optimization:'Convex quadratic optimization maximizes margin while C controls soft-margin violations.', hyperparameters:[['C','Large C penalizes errors strongly; small C allows a wider, softer margin.'],['kernel','Controls the geometry of the decision boundary.'],['γ','For RBF-like kernels, sets how local each point’s influence is.']] },
  'kmeans': { objective:'$$\\min_{\\mu_1,\\dots,\\mu_K}\\sum_i\\min_k\\|\\mathbf x_i-\\mu_k\\|_2^2$$', optimization:'Lloyd’s algorithm alternates assignment and centroid-update steps until assignments stop changing.', hyperparameters:[['K','Sets the number of clusters.'],['initialization','K-means++ reduces poor random starts.'],['max iterations','Caps alternating optimization.']] },
  'hierarchical-clustering': { objective:'$$C_a,C_b=\\arg\\min_{a\\ne b}D(C_a,C_b)$$', optimization:'Agglomerative clustering repeatedly merges the closest pair of clusters according to the chosen linkage.', hyperparameters:[['linkage','Single, complete, average or Ward changes cluster geometry.'],['distance metric','Defines inter-point similarity.'],['cut level','Determines the final number of clusters from the dendrogram.']] },
  'dbscan': { objective:'$$N_\\varepsilon(p)=\\{q:d(p,q)\\le\\varepsilon\\},\\quad |N_\\varepsilon(p)|\\ge minPts$$', optimization:'Density expansion grows a cluster from core points; there is no global differentiable loss.', hyperparameters:[['ε (epsilon)','Neighbourhood radius; too small fragments clusters, too large merges them.'],['minPts','Minimum local density required for a core point.'],['distance metric','Determines neighbourhood geometry.']] },
  'pca': { objective:'$$\\max_{\\|\\mathbf w\\|=1}\\operatorname{Var}(\\mathbf X\\mathbf w)$$', optimization:'Compute eigenvectors of the covariance matrix or use SVD; keep directions with the largest eigenvalues.', hyperparameters:[['n_components','Sets the retained dimensionality.'],['standardization','Usually important when features use different units.'],['whitening','Rescales components to unit variance when desired.']] }
};
for (const model of MODELS) Object.assign(model, MODEL_GUIDES[model.id] || {});

export const MODEL_MAP = Object.fromEntries(MODELS.map((m) => [m.id, m]));

// Helpers used across pages
export const byId = (id) => MODEL_MAP[id];
export const prevModel = (id) => {
  const i = MODEL_ORDER.indexOf(id);
  return i > 0 ? MODEL_MAP[MODEL_ORDER[i - 1]] : null;
};
export const nextModel = (id) => {
  const i = MODEL_ORDER.indexOf(id);
  return i < MODEL_ORDER.length - 1 ? MODEL_MAP[MODEL_ORDER[i + 1]] : null;
};
export default MODELS;







