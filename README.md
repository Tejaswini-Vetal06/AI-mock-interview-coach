# AI & ML Mock Interview Coach 🎯🤖

An interactive, portfolio-grade mock interview coaching application designed to help students, fresh graduates, and AI/ML engineers prepare for real technical interviews across **Artificial Intelligence, Machine Learning, Data Science, and Generative AI**.

---

## 🌟 Key Features

### 1. 11 Specialized AI/ML Job Role Tracks
- **AI/ML Engineer**: End-to-end model training, data leakage prevention, and production deployment pipelines.
- **Machine Learning Engineer**: Supervised/unsupervised algorithms, ensemble methods, and hyperparameter tuning.
- **Data Scientist**: Statistical inference, hypothesis testing, churn modeling, and class imbalance.
- **Data Analyst**: Advanced SQL, CTEs, window functions (`ROW_NUMBER`, `RANK`, `LAG`), Pandas, and outlier detection.
- **Generative AI Engineer**: Foundation models, prompt engineering, agent loops, guardrails, and evaluation.
- **LLM / RAG Engineer**: Retrieval-Augmented Generation, vector databases, chunking strategies, and re-ranking.
- **Computer Vision Engineer**: Convolutional neural networks, transfer learning, IoU calculations, and object detection.
- **NLP Engineer**: Self-attention mechanism, tokenization (BPE/WordPiece), and transformers.
- **MLOps Engineer**: Model serialization (Safetensors vs ONNX vs Pickle), drift monitoring (PSI/KS tests), and containerization.
- **AI Research Intern**: Mathematical derivations, gradient dynamics, skip connections, and loss formulations.
- **Python Developer in AI/ML**: GIL implications, generators, iterators, OOP, and high-performance vectorization.

### 2. Multi-Dimensional Interview Configuration
- **Experience Levels**: Beginner, Intermediate, and Advanced.
- **Candidate Tracks**: Internship, Fresher, and Experienced.
- **Interview Types**: Technical, HR/Behavioral, Live Coding, Project-Based, or Mixed.
- **Customizable Duration & Question Counts**: 5, 10, 15, or 20 questions with live countdown timer.
- **Optional Personalization**: Client-side PDF resume parsing and job description matching.

### 3. Interactive Interview Workspace
- **Question-by-Question Progression**: Dynamic stepper with live timer and progress indicators.
- **Voice Mode**: Integrated Speech-to-Text (Microphone input) and Text-to-Speech (Interviewer voice).
- **Non-Spoiling Hints**: Contextual hints that guide candidate thinking without giving away answers.
- **Follow-Up Questions**: Interactive prompts drilling down into candidate explanations.

### 4. 4-Pillar Coaching Rubric Evaluation
Answers are evaluated against a weighted assessment rubric:
- 📊 **Technical Correctness (40%)**: Accuracy of concepts, correct nomenclature, and avoidance of misconceptions.
- 🔍 **Depth of Understanding (25%)**: Theoretical grounding, mathematical formulations, and underlying mechanisms.
- ⚙️ **Practical Application (20%)**: Production trade-offs, latency, memory constraints, and deployment edge cases.
- 🗣️ **Clarity of Explanation (15%)**: Concise structure, flow, and articulate delivery.
- **Configurable Weights**: Tailor rubric weights in the settings panel.

### 5. Safe Client-Side Algorithmic Coding Round
- Practice binary classification metrics (Precision, Recall, F1), bounding box IoU, vector Cosine Similarity, and SQL Window Retention queries.
- **Client-Side Sandbox**: Executed locally in the browser with timeout protection; **zero risk of remote arbitrary code execution**.
- Automated test case validation with Time and Space complexity analysis.

### 6. PDF Resume & Job Description Analyzer
- 100% private, client-side text extraction using `pdfjs-dist`.
- Skills gap analysis against role benchmarks with priority tags (`High`, `Medium`, `Low`).
- Automated project talking points and tailored revision checklist.

### 7. Performance Dashboard & Real Analytics
- Real-time KPI summaries: Overall score, questions answered, and top competencies.
- Topic performance breakdown (0–10 scale) identifying verified strengths and weak topics.
- Historical session log tracking candidate improvement over time without fabricated data.

### 8. Personalized 7-Day Interview Roadmap
- Day-by-day revision schedule customized by role and detected weak topics.
- Interactive task checkboxes with circular completion tracking and key daily interview questions.

---

## 🎨 UI/UX Theme
The interface follows a cohesive, professional 4-color palette designed for high contrast and readability:
- **Deep Navy Blue**: `#070B14`, `#0B132B`, `#0F172A`
- **White / Off-White**: `#FFFFFF`, `#F8FAFC`, `#E2E8F0`
- **Light Blue**: `#38BDF8`, `#7DD3FC`, `#E0F2FE`
- **Teal**: `#0D9488`, `#14B8A6`, `#2DD4BF`

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **PDF Extraction**: `pdfjs-dist` (client-side in-browser extraction)
- **Safe Sandbox**: In-browser sandboxed evaluation runner
- **Celebration Effects**: `canvas-confetti`
- **Persistence**: Browser `localStorage` with JSON schema validation
- **Optional AI Enhancement**: Google Gemini API integration (100% functional offline without an API key)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Tejaswini-Vetal06/AI-mock-interview-coach.git
cd AI-mock-interview-coach

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
```

The production assets will be generated in the `dist/` directory.

---

## 📁 Project Structure

```
AI-mock-interview-coach/
├── src/
│   ├── components/
│   │   ├── CodingPracticeView.tsx           # Coding challenge runner with test cases
│   │   ├── Header.tsx                       # Top navbar with status & voice mute controls
│   │   ├── InteractiveInterviewWorkspace.tsx# Question stepper, voice STT/TTS, rubric feedback
│   │   ├── InterviewSetupView.tsx           # Setup form, role selector, PDF uploader
│   │   ├── PerformanceDashboardView.tsx     # KPI metrics, topic score bars, session history
│   │   ├── ResumeAnalyzerView.tsx           # PDF parser, skill gap analysis, checklist
│   │   ├── RoadmapView.tsx                  # 7-day milestone checklist with progress %
│   │   ├── RoleCard.tsx                     # 11 target job role cards with skill tags
│   │   ├── SettingsModal.tsx                # Rubric weights & Gemini API configuration
│   │   └── Sidebar.tsx                      # Main sidebar navigation
│   ├── data/
│   │   ├── codingChallenges.ts              # Python & SQL coding challenges with test cases
│   │   ├── questions.ts                     # Curated AI/ML question bank across 8 domains
│   │   └── roles.ts                         # Role definitions and focus areas
│   ├── services/
│   │   ├── audioService.ts                  # Speech-to-Text & Text-to-Speech engine
│   │   ├── codeRunner.ts                    # Safe client-side sandbox execution service
│   │   ├── evaluator.ts                     # 4-pillar rubric evaluation engine (Local + Gemini)
│   │   ├── questionSelector.ts              # Dynamic role-tailored question generator
│   │   ├── resumeParser.ts                  # PDF text extraction & skill matching
│   │   └── storageService.ts                # Session history, settings, and roadmap persistence
│   ├── types/
│   │   └── index.ts                         # TypeScript domain models
│   ├── App.tsx                              # Application shell & state coordinator
│   ├── index.css                            # Tailwind CSS directives & animations
│   └── main.tsx                             # React entrypoint
├── index.html                               # HTML5 shell
├── package.json                             # Dependencies & scripts
├── tailwind.config.js                       # 4-color palette configuration
├── tsconfig.json                            # TypeScript configuration
└── vite.config.ts                           # Vite bundler configuration
```

---

## 📄 License
This project is open-source under the MIT License.
