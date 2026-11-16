import { JobRole, TopicCategory } from '../types';

export interface RoleDefinition {
  id: JobRole;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  primaryTopics: TopicCategory[];
  keySkills: string[];
  focusAreas: string[];
}

export const JOB_ROLES: RoleDefinition[] = [
  {
    id: 'AI/ML Engineer',
    title: 'AI/ML Engineer',
    shortDesc: 'Build end-to-end machine learning systems from algorithms to production pipelines.',
    fullDesc: 'Focuses on designing, building, and deploying ML models into scalable production applications, combining strong software engineering with mathematical modeling.',
    icon: 'BrainCircuit',
    primaryTopics: ['Machine Learning', 'Deep Learning', 'Python', 'MLOps & Deployment', 'Project-Based'],
    keySkills: ['PyTorch/TensorFlow', 'Scikit-Learn', 'Feature Engineering', 'Model Deployment', 'Docker/FastAPI'],
    focusAreas: ['Model Architecture', 'Data Leakage prevention', 'Production inference latency', 'Pipelines']
  },
  {
    id: 'Machine Learning Engineer',
    title: 'Machine Learning Engineer',
    shortDesc: 'Optimize algorithms, train high-performance models, and automate pipelines.',
    fullDesc: 'Specializes in model architecture selection, hyperparameter tuning, loss function design, and reliable automated training workflows.',
    icon: 'Cpu',
    primaryTopics: ['Machine Learning', 'Deep Learning', 'Python', 'SQL & Data Handling'],
    keySkills: ['Supervised/Unsupervised ML', 'Ensemble Methods', 'Cross-Validation', 'Evaluation Metrics', 'Optimization'],
    focusAreas: ['Bias-Variance tradeoff', 'Gradient boosting vs Neural nets', 'Feature selection', 'Metric trade-offs']
  },
  {
    id: 'Data Scientist',
    title: 'Data Scientist',
    shortDesc: 'Transform data into predictive insights, business value, and statistical models.',
    fullDesc: 'Bridges statistics, hypothesis testing, predictive modeling, and business intuition to solve open-ended analytical problems.',
    icon: 'LineChart',
    primaryTopics: ['Machine Learning', 'SQL & Data Handling', 'Python', 'Project-Based'],
    keySkills: ['Pandas/NumPy', 'A/B Testing', 'Statistical Inference', 'Classification/Regression', 'Data Storytelling'],
    focusAreas: ['Data imputation', 'Experiment design', 'Handling class imbalance', 'Business impact metrics']
  },
  {
    id: 'Data Analyst',
    title: 'Data Analyst',
    shortDesc: 'Master data cleaning, advanced SQL querying, KPI modeling, and visualizations.',
    fullDesc: 'Extracts, transforms, and analyzes structured datasets using SQL, window functions, Pandas, and exploratory analysis to drive strategic decisions.',
    icon: 'BarChart3',
    primaryTopics: ['SQL & Data Handling', 'Python', 'Behavioral & HR'],
    keySkills: ['Advanced SQL (CTEs, Window Functions)', 'Data Cleaning', 'Aggregation & Joins', 'Pandas', 'Dashboarding'],
    focusAreas: ['Outlier detection', 'Complex multi-table joins', 'Cohort analysis', 'Data reconciliation']
  },
  {
    id: 'Generative AI Engineer',
    title: 'Generative AI Engineer',
    shortDesc: 'Harness LLMs, multi-agent frameworks, prompt systems, and generative pipelines.',
    fullDesc: 'Architects generative solutions leveraging foundation models, structured outputs, prompt engineering, guardrails, and multimodal integrations.',
    icon: 'Sparkles',
    primaryTopics: ['NLP & Generative AI', 'Deep Learning', 'Python', 'MLOps & Deployment'],
    keySkills: ['LLM Orchestration', 'Prompt Engineering', 'LangChain/LlamaIndex', 'Function Calling', 'Evaluation Metrics (ROUGE, BERTScore)'],
    focusAreas: ['Hallucination mitigation', 'Structured JSON generation', 'Cost vs Latency trade-offs', 'Guardrails']
  },
  {
    id: 'LLM / RAG Engineer',
    title: 'LLM / RAG Engineer',
    shortDesc: 'Build retrieval-augmented generation systems, vector databases, and agent pipelines.',
    fullDesc: 'Designs enterprise RAG architectures, chunking strategies, vector search indexing, re-ranking, and retrieval evaluation benchmarks.',
    icon: 'Layers',
    primaryTopics: ['NLP & Generative AI', 'Python', 'MLOps & Deployment'],
    keySkills: ['Vector DBs (Chroma/Milvus/Pinecone)', 'Chunking Strategies', 'Hybrid Search (BM25 + Dense)', 'RAG Triad (Ragas)', 'Re-ranking'],
    focusAreas: ['Lost-in-the-middle problem', 'Context window optimization', 'Embedding drift', 'Retrieval accuracy']
  },
  {
    id: 'Computer Vision Engineer',
    title: 'Computer Vision Engineer',
    shortDesc: 'Develop convolutional networks, object detectors, segmenters, and visual models.',
    fullDesc: 'Creates vision models for classification, object detection (YOLO), segmentation, image restoration, and video processing with OpenCV and PyTorch.',
    icon: 'Eye',
    primaryTopics: ['Deep Learning', 'Python', 'Machine Learning', 'Project-Based'],
    keySkills: ['CNNs / ResNet / ViT', 'Object Detection (YOLO, Faster R-CNN)', 'OpenCV', 'Data Augmentation', 'IoU & mAP'],
    focusAreas: ['Spatial resolution vs Depth', 'Anchor boxes & NMS', 'Transfer learning', 'Real-time inference']
  },
  {
    id: 'NLP Engineer',
    title: 'NLP Engineer',
    shortDesc: 'Design linguistic pipelines, transformers, tokenizers, and language representations.',
    fullDesc: 'Specializes in text classification, NER, sequence-to-sequence models, attention mechanisms, fine-tuning BERT/RoBERTa, and lexical semantics.',
    icon: 'MessageSquareCode',
    primaryTopics: ['NLP & Generative AI', 'Deep Learning', 'Python'],
    keySkills: ['Transformers & Self-Attention', 'Tokenization (BPE, WordPiece)', 'HuggingFace Transformers', 'Named Entity Recognition', 'Sentiment Analysis'],
    focusAreas: ['Self-attention complexity', 'Subword tokenization quirks', 'Fine-tuning vs In-context learning', 'Cross-lingual transfer']
  },
  {
    id: 'MLOps Engineer',
    title: 'MLOps Engineer',
    shortDesc: 'Manage CI/CD for models, drift monitoring, containerization, and model serving.',
    fullDesc: 'Automates end-to-end ML lifecycle: versioning datasets/models, containerizing inference engines, detecting data/concept drift, and orchestrating pipelines.',
    icon: 'Boxes',
    primaryTopics: ['MLOps & Deployment', 'Python', 'Machine Learning'],
    keySkills: ['Docker & Kubernetes', 'MLflow / Weights&Biases', 'FastAPI / Triton', 'Model Monitoring & Data Drift', 'CI/CD GitHub Actions'],
    focusAreas: ['Concept drift vs Data drift', 'Zero-downtime canary deployment', 'Inference batching', 'Model registry']
  },
  {
    id: 'AI Research Intern',
    title: 'AI Research Intern',
    shortDesc: 'Grasp foundational theory, novel architectures, loss formulations, and ablation studies.',
    fullDesc: 'Focuses on mathematical rigor, backpropagation derivations, optimization dynamics, novel paper comprehension, and experimental methodology.',
    icon: 'GraduationCap',
    primaryTopics: ['Deep Learning', 'Machine Learning', 'Python', 'Project-Based'],
    keySkills: ['Calculus & Linear Algebra', 'Backprop Derivations', 'Loss Landscape & Optimizers', 'Ablation Studies', 'Research Paper Review'],
    focusAreas: ['Vanishing/Exploding gradients', 'Loss formulation', 'Theoretical generalization bounds', 'Experimental rigor']
  },
  {
    id: 'Python Developer working in AI/ML',
    title: 'Python Developer working in AI/ML',
    shortDesc: 'Write idiomatic, high-performance Python, asynchronous APIs, and data utilities.',
    fullDesc: 'Specializes in robust Python engineering for AI: decorators, memory management, GIL implications, NumPy vectorization, OOP patterns, and async data ingestion.',
    icon: 'Terminal',
    primaryTopics: ['Python', 'SQL & Data Handling', 'MLOps & Deployment'],
    keySkills: ['Python OOP & Metaprogramming', 'Generators & Iterators', 'NumPy Vectorization', 'Asyncio & Concurrency', 'Pytest & Typing'],
    focusAreas: ['GIL (Global Interpreter Lock)', 'Memory leaks with large tensors', 'List comprehensions vs Generators', 'Decorator design']
  }
];

export const TOPIC_DISPLAY_NAMES: Record<TopicCategory, string> = {
  'Python': 'Python & OOP Fundamentals',
  'SQL & Data Handling': 'SQL, Data Cleaning & Wrangling',
  'Machine Learning': 'Machine Learning Algorithms & Modeling',
  'Deep Learning': 'Deep Learning & Neural Architectures',
  'NLP & Generative AI': 'NLP, LLMs & Retrieval-Augmented Generation',
  'MLOps & Deployment': 'MLOps, Docker, CI/CD & Monitoring',
  'Project-Based': 'Project Architecture & Applied Scenarios',
  'Behavioral & HR': 'Behavioral, Culture & Leadership'
};

