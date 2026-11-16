export type JobRole =
  | 'AI/ML Engineer'
  | 'Machine Learning Engineer'
  | 'Data Scientist'
  | 'Data Analyst'
  | 'Generative AI Engineer'
  | 'LLM / RAG Engineer'
  | 'Computer Vision Engineer'
  | 'NLP Engineer'
  | 'MLOps Engineer'
  | 'AI Research Intern'
  | 'Python Developer working in AI/ML';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CandidateMode = 'Internship' | 'Fresher' | 'Experienced';
export type InterviewType = 'Technical' | 'HR' | 'Coding' | 'Project-Based' | 'Mixed';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type TopicCategory =
  | 'Python'
  | 'SQL & Data Handling'
  | 'Machine Learning'
  | 'Deep Learning'
  | 'NLP & Generative AI'
  | 'MLOps & Deployment'
  | 'Project-Based'
  | 'Behavioral & HR';

export interface Question {
  id: string;
  roleCategories: JobRole[];
  topic: TopicCategory;
  difficulty: Difficulty;
  experienceLevels: ExperienceLevel[];
  type: InterviewType;
  questionText: string;
  hint: string;
  expectedConcepts: string[];
  modelAnswer: string;
  commonMistakes: string[];
  suggestedFollowUp: string;
  practicalTip: string;
  codeSnippet?: string;
}

export interface RubricCriterion {
  score: number;
  max: number;
  weight: number;
  feedback: string;
}

export interface AnswerEvaluation {
  score: number; // 0.0 - 10.0
  rubricBreakdown: {
    technicalCorrectness: RubricCriterion;
    depthOfUnderstanding: RubricCriterion;
    practicalApplication: RubricCriterion;
    clarityOfExplanation: RubricCriterion;
  };
  correctPoints: string[];
  missingConcepts: string[];
  simpleExplanation: string;
  modelAnswer: string;
  suggestedFollowUp: string;
  practicalTip: string;
  source?: 'local-engine' | 'gemini-ai';
}

export interface TestCase {
  id: string;
  input: any;
  expected: any;
  description: string;
  hidden?: boolean;
}

export interface CodingChallenge {
  id: string;
  title: string;
  language: 'python' | 'sql';
  difficulty: Difficulty;
  topic: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  hints: string[];
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
}

export interface InterviewConfig {
  role: JobRole;
  experienceLevel: ExperienceLevel;
  candidateMode: CandidateMode;
  interviewType: InterviewType;
  difficulty: Difficulty;
  numQuestions: number;
  durationMinutes: number;
  selectedTopics: TopicCategory[];
  jobDescription?: string;
  resumeFileName?: string;
  resumeText?: string;
  resumeSkills?: string[];
  resumeProjects?: { title: string; description: string }[];
}

export interface SessionAnswer {
  questionId: string;
  userAnswer: string;
  evaluation?: AnswerEvaluation;
  timeSpentSeconds: number;
  skipped?: boolean;
  followUpAnswer?: string;
  followUpEvaluation?: AnswerEvaluation;
}

export interface InterviewSession {
  id: string;
  timestamp: number;
  config: InterviewConfig;
  status: 'in-progress' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  questions: Question[];
  answers: SessionAnswer[];
  overallScore: number;
  topicScores: Record<string, number>;
  weakTopics: string[];
  strongTopics: string[];
  feedbackSummary?: string;
}

export interface ResumeAnalysisResult {
  candidateName?: string;
  identifiedSkills: string[];
  matchedRoleSkills: string[];
  missingSkills: string[];
  experienceHighlights: string[];
  projectSummaries: string[];
  recommendedTopicsToRevise: string[];
  matchScore: number;
  skillChecklist: { skill: string; matched: boolean; priority: 'High' | 'Medium' | 'Low' }[];
}

export interface RoadmapTask {
  id: string;
  task: string;
  completed: boolean;
}

export interface RoadmapDay {
  day: number;
  title: string;
  focusRole: string;
  topics: string[];
  summary: string;
  tasks: RoadmapTask[];
  keyQuestionsToReview: string[];
}

export interface UserSettings {
  rubricWeights: {
    technicalCorrectness: number; // default 0.40
    depthOfUnderstanding: number; // default 0.25
    practicalApplication: number; // default 0.20
    clarityOfExplanation: number; // default 0.15
  };
  geminiApiKey?: string;
  enableSpeechRecognition: boolean;
  enableTextToSpeech: boolean;
  voicePitch: number;
  voiceRate: number;
}

