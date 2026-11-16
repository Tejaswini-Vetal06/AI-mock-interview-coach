import { Question } from '../types';

export const QUESTION_BANK: Question[] = [
  // ==========================================
  // PYTHON
  // ==========================================
  {
    id: 'py-01',
    roleCategories: ['AI/ML Engineer', 'Machine Learning Engineer', 'Data Scientist', 'Python Developer working in AI/ML', 'AI Research Intern'],
    topic: 'Python',
    difficulty: 'Easy',
    experienceLevels: ['Beginner', 'Intermediate'],
    type: 'Technical',
    questionText: 'What is the difference between a Python list and a Python generator, and when would you prefer a generator in an ML data pipeline?',
    hint: 'Think about memory consumption (lazy evaluation vs eager evaluation) when loading millions of training records or images.',
    expectedConcepts: [
      'Lists store all elements in memory simultaneously (eager evaluation)',
      'Generators produce items on-the-fly using the yield keyword (lazy evaluation / iterator protocol)',
      'Generators have O(1) space complexity regardless of stream size',
      'In ML pipelines, generators prevent Out-Of-Memory (OOM) crashes when streaming large datasets, audio, or batches of images'
    ],
    modelAnswer: 'A Python list is an in-memory sequence where all elements are allocated upfront in RAM (eager evaluation). In contrast, a generator is an iterator that evaluates expressions lazily on-the-fly using the `yield` statement, holding only one element in memory at a time with O(1) space complexity. In ML data pipelines, generators are essential when reading terabytes of CSVs, streaming batches of high-resolution images, or tokenizing text documents sequentially, preventing the machine from exhausting its RAM before training even begins.',
    commonMistakes: [
      'Assuming generators are faster in compute speed rather than memory-efficient',
      'Forgetting that generators cannot be indexed (no generator[i]) and are exhausted after a single traversal'
    ],
    suggestedFollowUp: 'How would you write a custom PyTorch DataLoader or batch generator using `yield` that supports shuffling without loading the whole dataset into memory?',
    practicalTip: 'Always use generator expressions `(x for x in data)` or `yield` when dealing with datasets larger than your system RAM.'
  },
  {
    id: 'py-02',
    roleCategories: ['AI/ML Engineer', 'Python Developer working in AI/ML', 'Machine Learning Engineer'],
    topic: 'Python',
    difficulty: 'Medium',
    experienceLevels: ['Intermediate', 'Advanced'],
    type: 'Technical',
    questionText: 'Explain Python\'s Global Interpreter Lock (GIL). How does it affect multithreaded machine learning workloads, and how do libraries like NumPy or PyTorch bypass it?',
    hint: 'Consider CPU-bound versus I/O-bound tasks and how C-extensions release the interpreter lock during heavy vector operations.',
    expectedConcepts: [
      'GIL is a mutex that prevents multiple native threads from executing Python bytecodes simultaneously in CPython',
      'For CPU-bound pure Python loops, multithreading does not achieve true parallelism due to GIL contention',
      'NumPy, PyTorch, and TensorFlow release the GIL when entering underlying C/C++/CUDA kernels',
      'For parallel CPU preprocessing in Python, multiprocessing or Joblib (process-based) is preferred over threading'
    ],
    modelAnswer: 'The GIL (Global Interpreter Lock) is a mutual exclusion lock used by CPython to ensure only one thread executes Python bytecode at any given moment, safeguarding Python\'s memory management and reference counting. In CPU-intensive pure Python operations, standard multithreading cannot achieve multi-core acceleration because threads compete for the GIL. However, high-performance ML libraries like NumPy, PyTorch, and SciPy release the GIL as soon as execution transitions into compiled C/C++ or CUDA code, allowing full multi-core and multi-threaded computation (e.g. OpenMP or BLAS). For CPU-bound pure Python data transformations, engineers use `multiprocessing` or `concurrent.futures.ProcessPoolExecutor` to spawn separate OS processes with independent memory spaces.',
    commonMistakes: [
      'Claiming that Python can never use multiple CPU cores at all (multiprocessing and C-extensions do)',
      'Confusing CPU-bound tasks with I/O-bound tasks where standard threads or asyncio perform well'
    ],
    suggestedFollowUp: 'What are the memory overhead implications of using multiprocessing versus multithreading when sharing a 10GB feature matrix across 8 worker processes?',
    practicalTip: 'In production ML inference servers, use process-based workers (like Gunicorn with Uvicorn workers) rather than threads to bypass the GIL.'
  },
  {
    id: 'py-03',
    roleCategories: ['Python Developer working in AI/ML', 'Data Analyst', 'Data Scientist'],
    topic: 'Python',
    difficulty: 'Easy',
    experienceLevels: ['Beginner', 'Intermediate'],
    type: 'Coding',
    questionText: 'Explain the difference between shallow copy and deep copy in Python, especially when mutating nested structures like configuration dictionaries or tensors.',
    hint: 'Think about references to inner objects versus creating brand new duplicated objects in memory.',
    expectedConcepts: [
      'Shallow copy (copy.copy or list.copy) duplicates the outer container but copies references to nested objects',
      'Deep copy (copy.deepcopy) recursively copies both outer and inner objects, allocating fresh memory',
      'Mutating a nested list or dict in a shallow copy inadvertently mutates the original object'
    ],
    modelAnswer: 'A shallow copy (`copy.copy()`, `dict.copy()`, or `list[:]`) constructs a new collection object but populates it with references to the child objects found in the original. If the collection contains nested mutable structures (like a dictionary containing a list of model hyperparameters), modifying the nested list in the copied object will also mutate the original. Conversely, a deep copy (`copy.deepcopy()`) recursively traverses and clones every child object, creating a fully detached replica where mutations never cascade back to the source.',
    commonMistakes: [
      'Believing `list.copy()` creates an independent copy of nested lists',
      'Using deepcopy excessively in tight loops where memory overhead degrades latency'
    ],
    suggestedFollowUp: 'How does PyTorch handle tensor copying with `.clone()` vs `.detach()` vs `.clone().detach()` with respect to computational graph history?',
    practicalTip: 'When cloning model checkpoint configurations or experiment dictionaries before overriding keys, always use `copy.deepcopy` to avoid silent bugs.'
  },

  // ==========================================
  // SQL AND DATA HANDLING
  // ==========================================
  {
    id: 'sql-01',
    roleCategories: ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'AI/ML Engineer'],
    topic: 'SQL & Data Handling',
    difficulty: 'Medium',
    experienceLevels: ['Beginner', 'Intermediate', 'Advanced'],
    type: 'Technical',
    questionText: 'What are SQL Window Functions? Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() with an example use case in data preparation.',
    hint: 'Think about how each function handles tied values (e.g. two users with the exact same transaction amount).',
    expectedConcepts: [
      'Window functions perform calculations across a set of rows related to the current row without collapsing rows like GROUP BY',
      'ROW_NUMBER() assigns a unique sequential integer (1, 2, 3, 4) regardless of ties',
      'RANK() assigns equal rank to ties and skips subsequent numbers (e.g., 1, 2, 2, 4)',
      'DENSE_RANK() assigns equal rank to ties without skipping numbers (e.g., 1, 2, 2, 3)',
      'Used in ML feature engineering for finding user recent transactions, rolling averages, or customer top-k purchases'
    ],
    modelAnswer: 'SQL Window Functions evaluate calculations across a partitioned subset of table rows (defined by `OVER (PARTITION BY ... ORDER BY ...)`) while preserving individual row identity, unlike `GROUP BY` which aggregates rows into a single summary. \n- `ROW_NUMBER()` assigns an incrementing, distinct sequential integer to every row (1, 2, 3, 4), breaking ties arbitrarily.\n- `RANK()` gives tied records the same rank, but skips subsequent rank numbers according to the tie count (e.g., 1, 2, 2, 4).\n- `DENSE_RANK()` gives tied records the same rank but does not skip any ranks (e.g., 1, 2, 2, 3).\nIn ML pipelines, `ROW_NUMBER()` is heavily used for deduplication (keeping the latest record where `row_num = 1`) and computing chronological lag features.',
    commonMistakes: [
      'Confusing GROUP BY with PARTITION BY',
      'Swapping the behaviors of RANK() and DENSE_RANK() on ties'
    ],
    suggestedFollowUp: 'How would you write a query using `ROW_NUMBER()` to deduplicate a streaming table where each user has multiple event timestamps?',
    practicalTip: 'For ML feature stores, always specify deterministic tie-breakers in `ORDER BY` when using `ROW_NUMBER()` to ensure reproducible training sets.'
  },
  {
    id: 'sql-02',
    roleCategories: ['Data Scientist', 'Data Analyst', 'AI/ML Engineer', 'Machine Learning Engineer'],
    topic: 'SQL & Data Handling',
    difficulty: 'Medium',
    experienceLevels: ['Intermediate', 'Advanced'],
    type: 'Technical',
    questionText: 'How do you detect and handle missing data and outliers in Pandas before training an ML model? What are the dangers of naive mean imputation?',
    hint: 'Consider skewed distributions, categorical vs numerical features, data leakage during train/test split, and tree models vs linear models.',
    expectedConcepts: [
      'Missing data mechanisms: MCAR (Missing Completely at Random), MAR, MNAR',
      'Handling missing data: Imputation (median/mean/mode, KNN, Iterative/MICE) or indicator flags (`missing_indicator`)',
      'Naive mean imputation distorts distribution variance, under-represents uncertainty, and is heavily skewed by outliers',
      'Outlier detection: IQR rule, Z-score, Isolation Forest, boxplots',
      'Crucial to fit imputer ONLY on training set to prevent data leakage'
    ],
    modelAnswer: 'Missing data should first be diagnosed to understand whether it is MCAR, MAR, or MNAR. Naive mean imputation is dangerous because it artificially shrinks the feature\'s variance, underestimates standard errors, weakens correlation signals, and fails when extreme outliers distort the mean. Instead, median imputation or iterative/KNN imputation is preferred for numerical variables, or adding a binary missingness indicator column. Outliers can be detected using IQR bounds (Q1 - 1.5*IQR to Q3 + 1.5*IQR), Z-scores (>3 for Gaussian data), or isolation forests. Crucially, any imputation parameters (mean, median, scalers) must be fitted exclusively on the training fold and applied to validation/test sets to strictly prevent data leakage.',
    commonMistakes: [
      'Applying imputation on the entire dataframe before splitting into train/test (classic data leakage)',
      'Blindly dropping all rows with null values without checking if missingness carries signal'
    ],
    suggestedFollowUp: 'If a sensor feature is missing because the temperature exceeded the sensor limit (MNAR), why will median imputation completely ruin the predictive capability?',
    practicalTip: 'For gradient boosted trees (XGBoost/LightGBM), native missing value handling is often superior to manual mean/median imputation.'
  },

  // ==========================================
  // MACHINE LEARNING
  // ==========================================
  {
    id: 'ml-01',
    roleCategories: ['Machine Learning Engineer', 'AI/ML Engineer', 'Data Scientist', 'AI Research Intern'],
    topic: 'Machine Learning',
    difficulty: 'Medium',
    experienceLevels: ['Beginner', 'Intermediate'],
    type: 'Technical',
    questionText: 'What is the Bias-Variance tradeoff? How do techniques like L1/L2 regularization and ensemble methods (Bagging vs Boosting) influence bias and variance?',
    hint: 'Relate underfitting to bias, overfitting to variance, Random Forests to bagging, and Gradient Boosting to boosting.',
    expectedConcepts: [
      'Bias is error from erroneous assumptions or oversimplified models (underfitting)',
      'Variance is error from sensitivity to small fluctuations in training data (overfitting)',
      'Total Error = Bias^2 + Variance + Irreducible Error',
      'Regularization (L1 Lasso, L2 Ridge) adds a penalty to weights, slightly increasing bias to significantly reduce variance',
      'Bagging (Random Forest) trains independent models in parallel to reduce variance without increasing bias',
      'Boosting (XGBoost, AdaBoost) trains sequentially, focusing on residual errors to reduce bias'
    ],
    modelAnswer: 'The Bias-Variance tradeoff describes the tension between two sources of reducible error in machine learning: Bias measures how far model predictions are from the true functional relationship (high bias causes underfitting), while Variance measures how sensitive predictions are to specific training set variations (high variance causes overfitting). Total error is composed of Bias^2 + Variance + Irreducible noise.\n\n- L1 and L2 regularization penalize large weight magnitudes, which introduces a small amount of bias in exchange for drastically lowering variance and curbing overfitting.\n- Bagging (e.g., Random Forest) trains deep, low-bias trees in parallel on bootstrap samples and averages their outputs, reducing model variance.\n- Boosting (e.g., XGBoost) iteratively trains shallow, high-bias weak learners on the residuals of preceding models, primarily reducing bias while controlling variance via learning rate shrinkage.',
    commonMistakes: [
      'Saying bagging reduces bias and boosting reduces variance (it is the exact opposite)',
      'Assuming complex neural networks always have zero variance'
    ],
    suggestedFollowUp: 'Why does adding more features often decrease bias but increase variance?',
    practicalTip: 'When an XGBoost model is severely overfitting, increase `min_child_weight`, reduce `max_depth`, or lower `subsample` to decrease variance.'
  },
  {
    id: 'ml-02',
    roleCategories: ['Data Scientist', 'Machine Learning Engineer', 'AI/ML Engineer', 'Data Analyst'],
    topic: 'Machine Learning',
    difficulty: 'Medium',
    experienceLevels: ['Beginner', 'Intermediate', 'Advanced'],
    type: 'Technical',
    questionText: 'In an imbalanced classification problem (e.g., 99% negative, 1% fraud), why is Accuracy misleading? Explain Precision, Recall, F1-Score, and ROC-AUC, and how you would choose between Precision and Recall.',
    hint: 'Think about a naive model that predicts "No Fraud" for every single transaction—what is its accuracy?',
    expectedConcepts: [
      'Accuracy paradox: A trivial model predicting the majority class achieves 99% accuracy while catching zero fraud cases',
      'Precision = TP / (TP + FP): Fraction of flagged cases that are truly positive (cost of false alarms)',
      'Recall / Sensitivity = TP / (TP + FN): Fraction of actual positives caught (cost of missed detections)',
      'F1-Score: Harmonic mean of Precision and Recall, balancing both',
      'ROC-AUC evaluates ranking performance across all decision thresholds; PR-AUC is better when the positive class is rare',
      'Use case choice: Cancer detection/fraud demands high Recall; Spam filter/legal holds demands high Precision'
    ],
    modelAnswer: 'Accuracy is misleading for imbalanced data because a naive dummy classifier predicting the majority class everywhere yields 99% accuracy while having a 0% recall on the minority class. \n- **Precision** (TP / [TP + FP]) answers: "Of all items flagged as positive, how many were actually positive?" We prioritize Precision when False Positives are costly (e.g. email spam filtering, recommending high-value investment stocks).\n- **Recall** (TP / [TP + FN]) answers: "Of all actual positive cases, how many did we successfully detect?" We prioritize Recall when False Negatives are critical or life-threatening (e.g. malignant tumor diagnosis, fraud detection, nuclear alert systems).\n- **F1-Score** is the harmonic mean of Precision and Recall, punishing extreme trade-offs.\n- **ROC-AUC** measures the model\'s ability to rank positive instances above negative instances across all possible thresholds, though for severe imbalance, the Precision-Recall AUC (PR-AUC) provides a more honest picture.',
    commonMistakes: [
      'Using arithmetic mean instead of harmonic mean for F1 calculation',
      'Claiming ROC-AUC is unaffected by extreme class imbalance (ROC-AUC can look artificially optimistic because False Positive Rate stays tiny due to massive True Negatives)'
    ],
    suggestedFollowUp: 'If your business stakeholder wants 95% Recall but can only afford 20 manual review investigations per day, how do you set the decision threshold?',
    practicalTip: 'Always calculate PR-AUC (Average Precision) alongside ROC-AUC whenever positive class incidence is under 5%.'
  },
  {
    id: 'ml-03',
    roleCategories: ['AI/ML Engineer', 'Machine Learning Engineer', 'Data Scientist'],
    topic: 'Machine Learning',
    difficulty: 'Hard',
    experienceLevels: ['Intermediate', 'Advanced'],
    type: 'Technical',
    questionText: 'What is Data Leakage in Machine Learning? Give three distinct examples of how it occurs during preprocessing and cross-validation, and how to prevent it.',
    hint: 'Consider target leakage, feature engineering leakage across folds, and temporal/time-series data splitting.',
    expectedConcepts: [
      'Data leakage occurs when information from outside the training dataset is inadvertently used to train the model',
      'Example 1: Preprocessing before splitting (fitting Scaler, Imputer, or PCA on the entire dataset)',
      'Example 2: Target leakage (including a feature that is only available after the event occurred, e.g. "claim_settlement_date" in insurance fraud prediction)',
      'Example 3: Temporal leakage (using random K-Fold split on time-series instead of TimeSeriesSplit or forward-chaining)',
      'Prevention: Use scikit-learn Pipelines, strict temporal splits, and audit feature generation timeline'
    ],
    modelAnswer: 'Data leakage occurs when training data contains information about the target variable that would not be available in a real-world production inference environment, leading to unrealistically optimistic offline metrics that collapse in production. \n\nThree common manifestations are:\n1. **Preprocessing / Transformation Leakage**: Fitting standard scalers, TF-IDF vectorizers, or missing value imputers on the entire dataset before creating the train/validation split. The test distribution parameters seep into training.\n2. **Target / Feature Contamination Leakage**: Including a feature that is causally downstream of the target. For instance, predicting customer loan default using a feature like `account_closed_reason` or `collection_agency_contact_timestamp` which only exists after the user defaults.\n3. **Temporal Leakage**: Applying standard shuffled K-Fold Cross-Validation on time-dependent data (stock prices, fraud), allowing the model to peek into future timestamps to predict historical events.\n\nPrevention requires encapsulating all transformations within `Pipeline` objects and using chronological `TimeSeriesSplit`.',
    commonMistakes: [
      'Believing that normalizing data before splitting is harmless because it only shifts mean and scale',
      'Failing to check the exact timestamp of when every feature becomes available in production'
    ],
    suggestedFollowUp: 'In a Kaggle competition or production pipeline, what telltale signs in training versus validation curves indicate probable target leakage?',
    practicalTip: 'Always wrap preprocessing and estimators into `sklearn.pipeline.Pipeline` to guarantee transformers only learn from training folds.'
  },

  // ==========================================
  // DEEP LEARNING
  // ==========================================
  {
    id: 'dl-01',
    roleCategories: ['Computer Vision Engineer', 'AI/ML Engineer', 'NLP Engineer', 'AI Research Intern', 'Machine Learning Engineer'],
    topic: 'Deep Learning',
    difficulty: 'Medium',
    experienceLevels: ['Beginner', 'Intermediate'],
    type: 'Technical',
    questionText: 'Explain the Vanishing and Exploding Gradient problems in deep neural networks. What are three architectural or optimization techniques used to alleviate them?',
    hint: 'Think about the chain rule of differentiation with Sigmoid/Tanh activations, residual connections, and normalization layers.',
    expectedConcepts: [
      'Gradients calculated via chain rule during backprop: derivatives of weights and activations are multiplied repeatedly',
      'If derivatives are < 1 (e.g. Sigmoid derivative max 0.25), gradients decay exponentially towards zero (vanishing), stalling early layers',
      'If derivatives or weights are > 1, gradients grow exponentially (exploding), causing NaN losses or divergence',
      'Solutions: ReLU/GELU activations, Residual / Skip connections (ResNet), Batch/Layer Normalization, Proper initialization (He/Xavier), Gradient Clipping'
    ],
    modelAnswer: 'During backpropagation, gradients are computed via repeated matrix multiplications of layer Jacobians using the calculus chain rule. With saturating activation functions like Sigmoid (whose maximum derivative is only 0.25) or Tanh, multiplying dozens of sub-unity terms causes gradients to shrink exponentially as they propagate back to initial layers. As a result, early layers barely update their weights (Vanishing Gradients). Conversely, if initial weights or spectral norms exceed 1, gradients compound exponentially, causing numerical instability, weight explosion, and `NaN` losses (Exploding Gradients).\n\nThree primary solutions include:\n1. **Non-saturating activations**: Replacing Sigmoid with ReLU, LeakyReLU, or GELU which have constant derivative 1 for positive inputs.\n2. **Residual / Skip Connections (ResNets)**: Providing an additive identity shortcut ($y = F(x) + x$) so gradients can propagate directly through the identity addition ($\partial y / \partial x = \partial F / \partial x + 1$) without diminishing.\n3. **Normalization & Proper Initialization**: Employing LayerNorm/BatchNorm and Xavier/He weight initialization, combined with gradient clipping for exploding gradients.',
    commonMistakes: [
      'Thinking ReLU completely eliminates vanishing gradients (ReLU can suffer from the "dying ReLU" problem where negative inputs have 0 gradient)',
      'Thinking Batch Normalization solves exploding gradients during inference'
    ],
    suggestedFollowUp: 'Why is Layer Normalization preferred over Batch Normalization in Transformers and RNNs?',
    practicalTip: 'For deep architectures, always use He (Kaiming) initialization for ReLU networks and Xavier (Glorot) initialization for Tanh networks.'
  },
  {
    id: 'dl-02',
    roleCategories: ['Computer Vision Engineer', 'AI/ML Engineer'],
    topic: 'Deep Learning',
    difficulty: 'Medium',
    experienceLevels: ['Intermediate', 'Advanced'],
    type: 'Technical',
    questionText: 'How does a Convolutional Layer achieve parameter sharing and translation equivariance compared to a Fully Connected (Dense) layer?',
    hint: 'Think about kernel receptive fields, sliding dot products, and what happens when an object moves within an image.',
    expectedConcepts: [
      'Dense layers connect every input pixel to every neuron with unique weights: O(W*H*C * hidden_units) parameters, prone to overfitting',
      'Convolutional layers use small shared kernels (e.g., 3x3) slid across spatial dimensions',
      'Parameter sharing: The same filter weights detect local patterns (edges, textures) everywhere in the image',
      'Translation equivariance: Shifting an object in the input shifts the feature map by the corresponding amount'
    ],
    modelAnswer: 'A Fully Connected layer connects every single input pixel to every neuron in the hidden layer, assigning a distinct, independent weight to each spatial coordinate. For an image, this causes astronomical parameter counts and discards spatial locality. \n\nIn contrast, a Convolutional Layer operates on two foundational principles:\n1. **Local Receptive Fields & Parameter Sharing**: A small weight kernel (e.g., $3\\times 3\\times C$) slides across the entire image performing element-wise dot products. The same set of learned filter weights is reused across every spatial patch, drastically reducing parameter count and enforcing that a visual feature (such as a diagonal edge) is detected equally whether it appears in the top-left or bottom-right.\n2. **Translation Equivariance**: If the input image is spatially shifted by $k$ pixels, the resulting activation feature map is shifted by the exact same proportion $f(g(x)) = g(f(x))$. Pooling operations subsequently introduce approximate translation invariance.',
    commonMistakes: [
      'Confusing equivariance (shift in input shifts output map) with invariance (output remains unchanged despite shift)',
      'Assuming CNNs are naturally rotation-invariant (they are not without data augmentation or spatial transform networks)'
    ],
    suggestedFollowUp: 'Why have Vision Transformers (ViT) begun replacing standard CNNs in large-scale computer vision benchmarks?',
    practicalTip: 'In computer vision interviews, clearly distinguish translation equivariance in convolutional layers from translation invariance introduced by global pooling.'
  },

  // ==========================================
  // NLP AND GENERATIVE AI
  // ==========================================
  {
    id: 'genai-01',
    roleCategories: ['Generative AI Engineer', 'LLM / RAG Engineer', 'NLP Engineer', 'AI/ML Engineer'],
    topic: 'NLP & Generative AI',
    difficulty: 'Medium',
    experienceLevels: ['Beginner', 'Intermediate', 'Advanced'],
    type: 'Technical',
    questionText: 'Explain the Scaled Dot-Product Self-Attention mechanism in the Transformer architecture. Why do we divide by the square root of d_k?',
    hint: 'Write out the formula Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) V and consider the variance of dot products as dimension grows.',
    expectedConcepts: [
      'Formula: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) * V',
      'Q (Query), K (Key), V (Value) are linear projections of input embeddings',
      'Q K^T calculates similarity scores between all pairs of tokens (N x N matrix)',
      'Dividing by sqrt(d_k) prevents dot products from growing excessively large for high dimensions',
      'Large dot product values push the softmax function into regions with extremely small gradients (gradient vanishing)'
    ],
    modelAnswer: 'The Scaled Dot-Product Attention mechanism allows each token in a sequence to dynamically weigh and aggregate information from every other token based on contextual relevance. Input vectors are projected via learned linear matrices into Queries ($Q$), Keys ($K$), and Values ($V$) of dimension $d_k$.\n\nThe formulation is:  \n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\n$QK^T$ computes an unscaled pairwise similarity score matrix for all token pairs. We scale by $\\frac{1}{\\sqrt{d_k}}$ because as the embedding dimension $d_k$ grows large, the dot products grow in magnitude (if elements of $Q$ and $K$ are independent random variables with zero mean and unit variance, their dot product has mean 0 and variance $d_k$). Unchecked large values would push the Softmax function into saturation regions with near-zero gradients, paralyzing backpropagation. Scaling maintains unit variance and stable gradients.',
    commonMistakes: [
      'Forgetting the mathematical reason for sqrt(d_k) and claiming it is just an arbitrary hyperparameter',
      'Confusing self-attention (sequence attends to itself) with cross-attention (decoder queries attend to encoder keys and values)'
    ],
    suggestedFollowUp: 'What is the computational complexity of self-attention with respect to sequence length $N$, and what techniques (e.g. FlashAttention) optimize this in modern LLMs?',
    practicalTip: 'Remember that FlashAttention optimizes memory I/O between GPU SRAM and HBM rather than changing the mathematical $O(N^2)$ algorithm.'
  },
  {
    id: 'genai-02',
    roleCategories: ['LLM / RAG Engineer', 'Generative AI Engineer', 'AI/ML Engineer'],
    topic: 'NLP & Generative AI',
    difficulty: 'Medium',
    experienceLevels: ['Intermediate', 'Advanced'],
    type: 'Technical',
    questionText: 'What is Retrieval-Augmented Generation (RAG)? Walk through the complete RAG pipeline from ingestion to generation, and explain two common failure modes and their mitigations.',
    hint: 'Break the pipeline into: chunking, embedding, vector indexing, retrieval, reranking, prompt augmentation, and generation.',
    expectedConcepts: [
      'Ingestion: Document parsing, recursive chunking with overlap, dense embeddings, indexing in Vector DB',
      'Query time: Query embedding, top-k similarity search (cosine/dot product), optional cross-encoder reranker',
      'Generation: Augmented prompt injected with retrieved context fed to LLM',
      'Failure mode 1: Retrieval failure / semantic mismatch / poor chunking (Mitigation: Hybrid search BM25 + dense, contextual chunking, HyDE)',
      'Failure mode 2: Hallucination or lost-in-the-middle (Mitigation: Re-ranking with Cohere/BGE, citation prompting, RAG triad evaluation like Ragas)'
    ],
    modelAnswer: 'RAG (Retrieval-Augmented Generation) combines external knowledge retrieval with parametric foundation models to generate factually grounded, domain-specific responses without retraining weights.\n\n**The Pipeline:**\n1. **Ingestion & Chunking**: Source documents are cleaned and split into semantic chunks with overlapping boundaries (e.g., 512 tokens with 50-token overlap).\n2. **Embedding & Storage**: Each chunk is passed through an embedding model and stored in a vector database (e.g., Milvus, Chroma, Pinecone) with metadata.\n3. **Query & Retrieval**: A user query is embedded and matched against vector chunks using Cosine Similarity or HNSW index search.\n4. **Re-Ranking & Prompt Construction**: A cross-encoder re-ranker scores the top-20 chunks down to the top-5 most relevant chunks. These are concatenated into a structured prompt with system instructions.\n5. **Generation**: The LLM synthesizes the answer grounded strictly in the provided context.\n\n**Common Failure Modes:**\n- *Retrieval failure (irrelevant context retrieved)*: Solved using **Hybrid Search** (combining sparse BM25 keyword matching with dense semantic embeddings) or **HyDE** (Hypothetical Document Embeddings).\n- *Lost-in-the-middle / Hallucination*: When LLMs ignore chunks placed in the center of long prompts. Mitigated by re-ranking to place top evidence at prompt boundaries and using RAG evaluation frameworks (faithfulness, answer relevance).',
    commonMistakes: [
      'Using naive fixed-character splitting that breaks sentences or tables in half',
      'Relying solely on vector search for queries containing specific part numbers or exact acronyms where BM25 outperforms embeddings'
    ],
    suggestedFollowUp: 'How would you measure the "Faithfulness" of a RAG pipeline without human annotators using LLM-as-a-judge?',
    practicalTip: 'Always recommend Hybrid Search (dense + sparse BM25 with reciprocal rank fusion) for enterprise RAG over pure vector search.'
  },
  {
    id: 'genai-03',
    roleCategories: ['Generative AI Engineer', 'LLM / RAG Engineer'],
    topic: 'NLP & Generative AI',
    difficulty: 'Hard',
    experienceLevels: ['Intermediate', 'Advanced'],
    type: 'Technical',
    questionText: 'How do Function Calling (Tool Calling) and Autonomous AI Agents work under the hood in modern LLMs? How do you prevent infinite execution loops or hallucinated arguments?',
    hint: 'Think about JSON schemas passed in system prompts, stop sequences, parsing tool calls, and loop guardrails.',
    expectedConcepts: [
      'Function calling provides LLMs with JSON schemas describing available tools, arguments, and types',
      'The model generates structured text (e.g., `{"name": "get_weather", "arguments": {"city": "Paris"}}`) triggering a stop token',
      'Application executes the tool and appends the result as a tool/function message in conversation history',
      'Agent loops (ReAct: Reason + Act) iterate until the model outputs a final answer',
      'Guardrails: Max recursion limit (e.g. 5 steps), JSON Schema validation with Pydantic, timeout handlers, confirmation for destructive actions'
    ],
    modelAnswer: 'Function calling allows an LLM to act as a reasoning engine rather than just a text generator. The developer supplies a list of functions defined via JSON schemas (names, descriptions, parameter types, required fields). When a user query requires external data or action, the fine-tuned LLM outputs a structured JSON object specifying the function to invoke and its arguments, immediately emitting a stop token instead of generating free text.\n\nThe application host intercepts this payload, executes the actual code (such as an API call or SQL query), formats the output into a `tool` role message, and sends it back to the LLM. In an autonomous agent loop (such as ReAct), the LLM observes the tool output and decides whether to invoke another tool or deliver the final user response.\n\nTo prevent catastrophic failures:\n1. **Schema Validation**: Validate generated tool parameters against Pydantic schemas before execution to catch type errors.\n2. **Infinite Loop Circuit Breaker**: Impose a strict maximum step count (e.g., max 5 iterations) and total token budget.\n3. **Human-in-the-Loop**: Require explicit user confirmation before executing state-modifying tools (e.g., deleting a database or sending an email).',
    commonMistakes: [
      'Believing the LLM executes the Python/API function itself inside its weights (the host environment executes it)',
      'Not validating the LLM\'s JSON output, leading to unhandled runtime errors in backend code'
    ],
    suggestedFollowUp: 'What are the trade-offs between zero-shot ReAct agent prompting versus fine-tuned function calling tokens?',
    practicalTip: 'Always use strict JSON schema mode (`response_schema` or `function_call={"name": ...}`) to guarantee 100% parseable tool calls.'
  },

  // ==========================================
  // MLOPS AND DEPLOYMENT
  // ==========================================
  {
    id: 'mlops-01',
    roleCategories: ['MLOps Engineer', 'AI/ML Engineer', 'Machine Learning Engineer'],
    topic: 'MLOps & Deployment',
    difficulty: 'Medium',
    experienceLevels: ['Intermediate', 'Advanced'],
    type: 'Technical',
    questionText: 'What is the difference between Data Drift and Concept Drift? How do you monitor and detect them in a live production machine learning system?',
    hint: 'Think about $P(X)$ changing versus $P(Y|X)$ changing, and how ground truth delays affect monitoring.',
    expectedConcepts: [
      'Data Drift / Covariate Shift: Shift in the distribution of input features P(X) while P(Y|X) remains constant',
      'Concept Drift: Shift in the relationship between input features and target variable P(Y|X), changing the ground truth behavior',
      'Detection for Data Drift: Statistical tests (KS test for numerical, Chi-Square for categorical, Population Stability Index (PSI), Wasserstein distance)',
      'Detection for Concept Drift: Tracking online model performance metrics (Accuracy, F1, Log-loss) against delayed ground truth labels',
      'Remediation: Automated retraining triggers, rolling training windows, feature importance recalculation'
    ],
    modelAnswer: 'Both Data Drift and Concept Drift degrade production ML performance over time, but they stem from fundamentally different probabilistic changes:\n\n1. **Data Drift (Covariate Shift)**: Occurs when the marginal distribution of input features $P(X)$ changes while the underlying mapping $P(Y|X)$ remains invariant. For example, during an economic shock, the distribution of applicant income drops, but the definition of what constitutes credit default given an income level remains consistent. Detected via statistical two-sample tests: Kolmogorov-Smirnov (KS) tests for continuous variables, Chi-Square tests for categorical variables, or Population Stability Index (PSI > 0.2 indicates significant drift).\n\n2. **Concept Drift**: Occurs when the statistical relationship between features and target $P(Y|X)$ changes. For instance, after a major pandemic or regulatory shift, buying patterns or fraud tactics evolve such that features that used to indicate legitimate transactions now indicate fraud. It cannot be detected purely by looking at inputs; it requires monitoring degradation in performance metrics (Precision, Recall, ROC-AUC) as ground-truth labels gradually arrive.\n\nMitigation involves establishing automated monitoring dashboards (Evidently AI, Great Expectations) and triggers for automated pipeline retraining.',
    commonMistakes: [
      'Using the terms data drift and concept drift interchangeably',
      'Assuming concept drift can be detected in real time without ground-truth labels'
    ],
    suggestedFollowUp: 'How do you design a model retraining strategy when ground truth labels take 60 days to arrive (delayed feedback loop)?',
    practicalTip: 'Set up automated alerts when PSI (Population Stability Index) exceeds 0.25 on primary predictive features.'
  },
  {
    id: 'mlops-02',
    roleCategories: ['MLOps Engineer', 'AI/ML Engineer', 'Python Developer working in AI/ML'],
    topic: 'MLOps & Deployment',
    difficulty: 'Medium',
    experienceLevels: ['Beginner', 'Intermediate', 'Advanced'],
    type: 'Technical',
    questionText: 'Why should you never use Python Pickle for model serialization in untrusted production environments? What are modern, secure alternatives for saving ML and DL models?',
    hint: 'Think about arbitrary code execution through __reduce__ method in pickle files, ONNX, Safetensors, and Joblib.',
    expectedConcepts: [
      'Pickle security flaw: Unpickling untrusted data can execute arbitrary malicious bytecode via `__reduce__` hook',
      'Pickle language lock-in: Python-only, fragile across Python/library version differences',
      'Alternatives for classical ML: ONNX (Open Neural Network Exchange), Treelite, PMML',
      'Alternatives for Deep Learning: Safetensors (Hugging Face zero-copy memory-mapped safe tensor format), ONNX Runtime, TorchScript/Torch Export, SavedModel'
    ],
    modelAnswer: 'Python\'s `pickle` module is fundamentally insecure for loading models from untrusted sources because it is a general object serialization protocol, not a pure data format. When `pickle.load()` is executed, Python invokes the object\'s `__reduce__` method, which can execute arbitrary shell commands (e.g., executing reverse shells or deleting files) on the host machine. Furthermore, pickle files are tightly coupled to Python versions and environment libraries.\n\nSecure production alternatives include:\n- **Safetensors**: A modern format developed by Hugging Face that serializes pure tensor weights safely without executable code, supporting zero-copy memory mapping (`mmap`) for instant model loading.\n- **ONNX (Open Neural Network Exchange)**: An open standard representation that separates model architecture and weights from the runtime, allowing high-performance inference across C++, C#, Java, and Triton Inference Server.\n- **TorchScript / TorchDynamo / OpenVINO**: Compiles PyTorch models into independent serialized graphs that run without a Python interpreter.',
    commonMistakes: [
      'Believing Joblib is secure (Joblib is built directly on top of pickle and shares the exact same code execution vulnerabilities)',
      'Thinking ONNX is only for PyTorch (it supports Scikit-learn, XGBoost, and LightGBM as well)'
    ],
    suggestedFollowUp: 'How does zero-copy memory mapping in Safetensors reduce GPU model cold-start times compared to standard serialization?',
    practicalTip: 'Always distribute LLM and vision model weights as `.safetensors` rather than `.bin` or `.pt` files to pass enterprise security audits.'
  },

  // ==========================================
  // PROJECT-BASED & PRACTICAL SCENARIOS
  // ==========================================
  {
    id: 'proj-01',
    roleCategories: ['AI/ML Engineer', 'Machine Learning Engineer', 'Data Scientist', 'Generative AI Engineer', 'AI Research Intern'],
    topic: 'Project-Based',
    difficulty: 'Medium',
    experienceLevels: ['Beginner', 'Intermediate', 'Advanced'],
    type: 'Project-Based',
    questionText: 'Walk me through an end-to-end Machine Learning or GenAI project you built. What was the core problem, why did you choose that specific model architecture, and how did you measure its business success?',
    hint: 'Structure your answer using the STAR method (Situation, Task, Action, Result). State trade-offs, baseline models, and production metrics.',
    expectedConcepts: [
      'Clear problem definition and business impact (not just a toy dataset)',
      'Exploration of baseline model before moving to complex deep learning / LLMs',
      'Justification of model selection (accuracy vs latency vs operational cost trade-offs)',
      'Evaluation strategy (offline metrics like F1/ROC-AUC and online business KPIs)',
      'Key engineering challenge overcome (e.g. imbalanced data, latency, cold-start)'
    ],
    modelAnswer: 'In my predictive customer churn project for an e-commerce platform, the goal was identifying high-risk subscribers 30 days before contract renewal to allow proactive retention discounts.\n\nI started by engineering behavioral features: login frequency decay, support ticket sentiments, and recent payment failures. I established a Logistic Regression baseline (ROC-AUC 0.71), then benchmarked XGBoost versus a Multi-Layer Perceptron. I selected XGBoost because it handled tabular non-linearities gracefully, provided built-in handling of missing values, and offered interpretable SHAP feature attributions for marketing teams.\n\nBecause churn represented only 4% of customers, we optimized for Precision-Recall AUC and tuned the decision threshold to capture 80% of true churners while keeping False Positives within marketing outreach budgets. We packaged the model in a FastAPI container on AWS ECS, monitored prediction drift with Prometheus, and achieved a 14% reduction in quarterly subscriber attrition during A/B testing.',
    commonMistakes: [
      'Starting immediately with complex deep learning without trying a simple baseline first',
      'Focusing solely on academic metrics like accuracy without connecting to a business or user outcome',
      'Failing to mention how the model was deployed or maintained in production'
    ],
    suggestedFollowUp: 'What was the single biggest limitation or failure case of your chosen model in production, and how would you address it in version 2.0?',
    practicalTip: 'In interviews, always explain why you rejected alternative models (e.g. "We considered a transformer, but inference latency exceeded our 100ms SLA").'
  },
  {
    id: 'proj-02',
    roleCategories: ['LLM / RAG Engineer', 'Generative AI Engineer', 'AI/ML Engineer'],
    topic: 'Project-Based',
    difficulty: 'Hard',
    experienceLevels: ['Intermediate', 'Advanced'],
    type: 'Project-Based',
    questionText: 'Imagine your deployed RAG system is suffering from 3-second latency and occasional hallucinations on multi-page PDF documents. How would you systematically diagnose and fix both issues?',
    hint: 'Deconstruct latency into embedding, vector search, reranking, and generation. Deconstruct hallucinations into chunking, retrieval quality, and prompt constraints.',
    expectedConcepts: [
      'Latency profiling: Instrumenting spans for query embedding, vector DB search, re-ranking, and TTFT (Time to First Token) / token generation',
      'Latency optimizations: Streaming responses, caching query embeddings, asynchronous I/O, quantized models, vector indexing (HNSW vs IVFFlat)',
      'Hallucination diagnosis: Check if evidence exists in retrieved chunks (retrieval failure vs generator failure)',
      'Hallucination fixes: Semantic chunking, contextual headers, cross-encoder re-ranking, strict system prompt ("Answer ONLY using the provided context, else reply I do not know"), citation verification'
    ],
    modelAnswer: 'To tackle the 3-second latency and hallucinations, I would decompose the issue systematically:\n\n**1. Latency Profiling & Optimization**:\n- Instrument OpenTelemetry spans across the pipeline: (1) Query embedding time, (2) Vector similarity search, (3) Cross-encoder re-ranking, and (4) LLM Time-to-First-Token (TTFT) and generation.\n- Typically, 70%+ of latency comes from sequential LLM generation. I would implement token streaming so users see initial output within 400ms.\n- Enable semantic caching (Redis) for frequent queries, replace brute-force vector search with an optimized HNSW index, and parallelize retrieval across document shards.\n\n**2. Hallucination Diagnosis & Elimination**:\n- Use the RAG Triad framework (Ragas): check Context Relevance (did we retrieve the right paragraph?), Groundedness (is the answer derived from the retrieved context?), and Answer Relevance.\n- If the correct paragraph wasn\'t retrieved, PDF tables or multi-column layouts were likely mangled by naive chunking. I would implement layout-aware PDF extraction (e.g., Unstructured or PyMuPDF) and prepend chunk metadata (document title, section name).\n- Add a cross-encoder re-ranker (Cohere or BGE-Reranker) to discard low-scoring noise chunks, and enforce strict prompting: "If the provided context does not explicitly contain the answer, reply that the document does not specify."',
    commonMistakes: [
      'Assuming increasing the LLM model size will automatically fix retrieval-based hallucinations',
      'Blaming the vector database for latency without checking LLM token generation speed'
    ],
    suggestedFollowUp: 'How would you handle user questions that require aggregating numerical information across multiple tables located in different PDF pages?',
    practicalTip: 'For multi-page financial or analytical PDFs, combine vector RAG with a structured Text-to-SQL or tabular parser.'
  },

  // ==========================================
  // BEHAVIORAL & HR
  // ==========================================
  {
    id: 'hr-01',
    roleCategories: [
      'AI/ML Engineer', 'Machine Learning Engineer', 'Data Scientist', 'Data Analyst',
      'Generative AI Engineer', 'LLM / RAG Engineer', 'Computer Vision Engineer',
      'NLP Engineer', 'MLOps Engineer', 'AI Research Intern', 'Python Developer working in AI/ML'
    ],
    topic: 'Behavioral & HR',
    difficulty: 'Easy',
    experienceLevels: ['Beginner', 'Intermediate', 'Advanced'],
    type: 'HR',
    questionText: 'Tell me about a time when your ML model or data project failed to deliver expected results in production or testing. How did you handle the situation and communicate with stakeholders?',
    hint: 'Use the STAR format. Emphasize accountability, root cause analysis, stakeholder transparency, and key learnings.',
    expectedConcepts: [
      'Transparent communication without being defensive',
      'Root-cause analysis (e.g. data shift, faulty assumptions, metric misalignment)',
      'Actionable mitigation plan presented to stakeholders with timelines',
      'Long-term process improvements to prevent recurrence'
    ],
    modelAnswer: 'During a demand forecasting project, our model showed a strong 8% MAPE improvement during offline backtesting. However, once deployed to an early pilot region, forecast errors spiked by over 30%, causing stock discrepancies in three distribution centers.\n\nInstead of concealing the issue, I immediately alerted the product manager and business stakeholders, explaining that we were rolling back to the baseline rule-based system to protect daily operations. I conducted a root-cause audit and discovered that our training pipeline had used end-of-day reconciled inventory snapshots, whereas the production inference service was receiving raw, un-reconciled real-time stream data with frequent negative counts and delayed cancellation logs.\n\nI aligned our offline feature engineering pipeline with the real-time streaming schemas, introduced data validation checks using Great Expectations, and re-tested over a two-week shadow deployment. The stakeholders appreciated the honest post-mortem and the fact that we established automated schema contract alerts before our next rollout.',
    commonMistakes: [
      'Claiming you have never had a project or model fail (interviewers consider this unrealistic)',
      'Blaming other team members or external clients for the failure'
    ],
    suggestedFollowUp: 'How do you set expectations with non-technical business leaders regarding the probabilistic nature of ML models compared to deterministic software?',
    practicalTip: 'Frame failures as disciplined engineering learning cycles: "We contained the blast radius, isolated the root cause, and codified a guardrail to permanently prevent it."'
  }
];

