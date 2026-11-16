import { InterviewSession, RoadmapDay, UserSettings } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'ai_coach_sessions_v1',
  ROADMAP: 'ai_coach_roadmap_v1',
  SETTINGS: 'ai_coach_settings_v1',
  SAVED_RESUME: 'ai_coach_resume_cache_v1'
};

export class StorageService {
  public static getSessions(): InterviewSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveSession(session: InterviewSession): void {
    try {
      const sessions = this.getSessions();
      const existingIdx = sessions.findIndex(s => s.id === session.id);
      if (existingIdx >= 0) {
        sessions[existingIdx] = session;
      } else {
        sessions.unshift(session);
      }
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (err) {
      console.error('Failed to save session to localStorage:', err);
    }
  }

  public static getSessionById(id: string): InterviewSession | undefined {
    return this.getSessions().find(s => s.id === id);
  }

  public static clearSessions(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  }

  public static getSettings(): UserSettings {
    const defaultSettings: UserSettings = {
      rubricWeights: {
        technicalCorrectness: 0.40,
        depthOfUnderstanding: 0.25,
        practicalApplication: 0.20,
        clarityOfExplanation: 0.15
      },
      geminiApiKey: '',
      enableSpeechRecognition: true,
      enableTextToSpeech: true,
      voicePitch: 1.0,
      voiceRate: 1.0
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  public static saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  }

  public static getRoadmap(): RoadmapDay[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ROADMAP);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public static saveRoadmap(roadmap: RoadmapDay[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
    } catch (err) {
      console.error('Failed to save roadmap:', err);
    }
  }

  public static toggleRoadmapTask(dayNumber: number, taskId: string): RoadmapDay[] {
    const current = this.getRoadmap();
    const day = current.find(d => d.day === dayNumber);
    if (day) {
      const task = day.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        this.saveRoadmap(current);
      }
    }
    return current;
  }

  /**
   * Generates a tailored 7-Day Roadmap based on candidate weak topics and target role
   */
  public static generateRoadmapForSession(session: InterviewSession): RoadmapDay[] {
    const role = session.config.role;
    const weak = session.weakTopics.length > 0 
      ? session.weakTopics 
      : ['Machine Learning', 'Deep Learning'];

    const days: RoadmapDay[] = [
      {
        day: 1,
        title: 'Core Fundamentals & Data Manipulation',
        focusRole: role,
        topics: ['Python OOP', 'Generators & Iterators', 'SQL Window Functions', 'NumPy Vectorization'],
        summary: 'Solidify clean code habits, lazy evaluation memory patterns, and complex SQL joins.',
        tasks: [
          { id: 't1-1', task: 'Implement a batch generator using `yield` that streams memory-efficient data', completed: false },
          { id: 't1-2', task: 'Solve 3 SQL problems with ROW_NUMBER(), RANK(), and LAG()', completed: false },
          { id: 't1-3', task: 'Review Python GIL impact on CPU-bound vs I/O-bound tasks', completed: false }
        ],
        keyQuestionsToReview: [
          'What is the difference between a Python list and a generator in an ML pipeline?',
          'How do window functions differ from GROUP BY in SQL?'
        ]
      },
      {
        day: 2,
        title: 'Machine Learning Algorithms & Trade-offs',
        focusRole: role,
        topics: ['Bias-Variance Tradeoff', 'Ensemble Methods', 'Regularization (L1/L2)', 'Tree Splitting'],
        summary: 'Master the mathematical intuition and trade-offs between linear models and tree ensembles.',
        tasks: [
          { id: 't2-1', task: 'Derive how Random Forest reduces variance while Gradient Boosting reduces bias', completed: false },
          { id: 't2-2', task: 'Practice coding L1 vs L2 cost function penalties from scratch', completed: false },
          { id: 't2-3', task: 'Compare XGBoost vs LightGBM handling of missing categorical data', completed: false }
        ],
        keyQuestionsToReview: [
          'Why does Bagging reduce variance while Boosting reduces bias?',
          'How does L1 regularization create sparse feature coefficients?'
        ]
      },
      {
        day: 3,
        title: 'Feature Engineering & Data Leakage Prevention',
        focusRole: role,
        topics: ['Data Leakage', 'Missing Imputation', 'Outlier Detection', 'Cross-Validation Strategies'],
        summary: 'Learn how to detect subtle distribution shifts and guarantee zero test set contamination.',
        tasks: [
          { id: 't3-1', task: 'Audit your project code to verify Scalers/Imputers are fit strictly on training splits', completed: false },
          { id: 't3-2', task: 'Implement TimeSeriesSplit on chronological transaction data', completed: false },
          { id: 't3-3', task: 'Evaluate Precision-Recall AUC on a simulated 99:1 imbalanced dataset', completed: false }
        ],
        keyQuestionsToReview: [
          'What are the 3 major types of Data Leakage in production systems?',
          'Why is Accuracy deceptive for imbalanced fraud classification?'
        ]
      },
      {
        day: 4,
        title: 'Deep Learning & Neural Architectures',
        focusRole: role,
        topics: ['Backpropagation', 'Vanishing Gradients', 'CNNs & Equivariance', 'Normalizations (Batch vs Layer)'],
        summary: 'Deep dive into gradient flow dynamics, skip connections, and activation function choices.',
        tasks: [
          { id: 't4-1', task: 'Derive the chain rule gradient of Sigmoid and explain why derivative maxes at 0.25', completed: false },
          { id: 't4-2', task: 'Understand the mathematical formulation of ResNet residual connections', completed: false },
          { id: 't4-3', task: 'Compare LayerNorm vs BatchNorm in recurrent and attention-based networks', completed: false }
        ],
        keyQuestionsToReview: [
          'How does ResNet solve the vanishing gradient problem mathematically?',
          'Why do CNNs achieve parameter sharing and translation equivariance?'
        ]
      },
      {
        day: 5,
        title: 'NLP, Large Language Models & Modern RAG',
        focusRole: role,
        topics: ['Self-Attention Mechanism', 'RAG Architecture', 'Vector Search & Embeddings', 'Hallucination Mitigation'],
        summary: 'Master the foundation of Transformer architectures, chunking strategies, and hybrid search.',
        tasks: [
          { id: 't5-1', task: 'Explain why we scale dot-product attention by sqrt(d_k)', completed: false },
          { id: 't5-2', task: 'Design an enterprise RAG pipeline with Hybrid BM25 + Dense vector re-ranking', completed: false },
          { id: 't5-3', task: 'Implement an autonomous agent tool calling loop with strict JSON schema validation', completed: false }
        ],
        keyQuestionsToReview: [
          'Explain the Scaled Dot-Product Attention mechanism formula step-by-step.',
          'How do you eliminate hallucinations and reduce latency in high-traffic RAG systems?'
        ]
      },
      {
        day: 6,
        title: 'MLOps, Deployment & Live Coding Drills',
        focusRole: role,
        topics: ['Data & Concept Drift', 'Docker & FastAPI Serving', 'Model Serialization (Safetensors/ONNX)', 'Live Coding'],
        summary: 'Practice live timed coding challenges and production deployment failure modes.',
        tasks: [
          { id: 't6-1', task: 'Solve the Precision/Recall/F1 and IoU coding challenges under 15 minutes', completed: false },
          { id: 't6-2', task: 'Containerize a FastAPI model inference service with a Dockerfile', completed: false },
          { id: 't6-3', task: 'Differentiate Covariate Shift vs Concept Drift and establish PSI monitoring alerts', completed: false }
        ],
        keyQuestionsToReview: [
          'Why is Python Pickle dangerous in production compared to Safetensors/ONNX?',
          'How do you monitor model degradation when ground truth labels take 60 days to arrive?'
        ]
      },
      {
        day: 7,
        title: 'Full Mock Interview & Portfolio Defense',
        focusRole: role,
        topics: ['Project Architecture (STAR)', 'HR & Behavioral', 'Failure Post-Mortems', 'Full Simulation'],
        summary: 'Run a comprehensive 15-question mixed technical and project-based mock interview.',
        tasks: [
          { id: 't7-1', task: 'Deliver your primary project architecture explanation in under 3 minutes using STAR', completed: false },
          { id: 't7-2', task: 'Complete a full 10-question Mock Interview with over 8.0/10 average score', completed: false },
          { id: 't7-3', task: 'Review all rubric feedback tips and record your strongest answers', completed: false }
        ],
        keyQuestionsToReview: [
          'Walk me through an end-to-end ML/GenAI project you designed and deployed.',
          'Tell me about a time when your ML model failed to deliver expected results.'
        ]
      }
    ];

    this.saveRoadmap(days);
    return days;
  }
}
