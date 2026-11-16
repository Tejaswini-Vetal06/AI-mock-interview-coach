import { AnswerEvaluation, Question, UserSettings } from '../types';

export class AnswerEvaluator {
  /**
   * Evaluates an interview answer using a 4-part weighted rubric:
   * - Technical correctness (40%)
   * - Depth of understanding (25%)
   * - Practical application (20%)
   * - Clarity of explanation (15%)
   */
  public static async evaluateAnswer(
    question: Question,
    userAnswer: string,
    settings?: UserSettings
  ): Promise<AnswerEvaluation> {
    const trimmed = userAnswer.trim();
    if (!trimmed || trimmed.length < 5) {
      return this.generateEmptyEvaluation(question);
    }

    // Check if user has provided an active Gemini API key in settings
    if (settings?.geminiApiKey && settings.geminiApiKey.trim().length > 15) {
      try {
        const geminiResult = await this.evaluateWithGemini(
          question,
          userAnswer,
          settings.geminiApiKey,
          settings.rubricWeights
        );
        if (geminiResult) {
          return geminiResult;
        }
      } catch (err) {
        console.warn('Gemini API evaluation failed, falling back to local rubric engine:', err);
      }
    }

    // Default: Deterministic local rubric engine
    return this.evaluateLocally(question, userAnswer, settings?.rubricWeights);
  }

  private static evaluateLocally(
    question: Question,
    userAnswer: string,
    weights = {
      technicalCorrectness: 0.40,
      depthOfUnderstanding: 0.25,
      practicalApplication: 0.20,
      clarityOfExplanation: 0.15
    }
  ): AnswerEvaluation {
    const lowerAnswer = userAnswer.toLowerCase();
    const words = lowerAnswer.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // 1. Evaluate Expected Concepts Coverage (Technical Correctness)
    const matchedConcepts: string[] = [];
    const missingConcepts: string[] = [];

    question.expectedConcepts.forEach(concept => {
      // Extract key lexical tokens from concept statement
      const keyTerms = concept
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3 && !['with', 'from', 'that', 'this', 'have', 'when', 'than', 'into'].includes(w));

      // Check how many key terms from this concept appear in candidate answer
      const matchCount = keyTerms.filter(term => lowerAnswer.includes(term)).length;
      const coverageRatio = keyTerms.length > 0 ? matchCount / keyTerms.length : 0;

      if (coverageRatio >= 0.4 || lowerAnswer.includes(concept.toLowerCase().slice(0, 15))) {
        matchedConcepts.push(concept);
      } else {
        missingConcepts.push(concept);
      }
    });

    // Check for common mistakes
    const detectedMistakes: string[] = [];
    question.commonMistakes.forEach(mistake => {
      const mistakeTerms = mistake.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      const overlap = mistakeTerms.filter(t => lowerAnswer.includes(t)).length;
      if (overlap >= 3) {
        detectedMistakes.push(mistake);
      }
    });

    // Compute pillar scores (0 - 10 scale)
    const conceptRatio = question.expectedConcepts.length > 0 
      ? matchedConcepts.length / question.expectedConcepts.length 
      : 0.7;

    // Technical correctness: proportional to concept match, penalized by detected misconceptions
    let techScore = Math.min(10, Math.max(1, Math.round(conceptRatio * 10 - (detectedMistakes.length * 1.5))));
    if (wordCount < 15 && techScore > 5) techScore = 4;

    // Depth of understanding: looks for nuance, structural depth, reasoning words
    const reasoningMarkers = [
      'because', 'therefore', 'trade-off', 'tradeoff', 'under the hood',
      'complexity', 'difference', 'in contrast', 'consequently', 'specifically',
      'furthermore', 'mechanism', 'mathematically', 'derivation', 'architecture'
    ];
    const markerMatches = reasoningMarkers.filter(m => lowerAnswer.includes(m)).length;
    let depthScore = Math.min(10, Math.max(2, Math.round(4 + markerMatches * 1.2 + (conceptRatio > 0.6 ? 2 : 0))));

    // Practical application: looks for tools, libraries, production considerations, edge cases
    const practicalMarkers = [
      'production', 'pipeline', 'deployment', 'latency', 'memory', 'gpu',
      'batch', 'scale', 'docker', 'dataset', 'cache', 'real-world', 'monitoring',
      'error', 'exception', 'failure', 'threshold', 'baseline', 'metric'
    ];
    const practicalMatches = practicalMarkers.filter(m => lowerAnswer.includes(m)).length;
    let practicalScore = Math.min(10, Math.max(2, Math.round(3 + practicalMatches * 1.4)));

    // Clarity of explanation: concise, good formatting, clear structure
    let clarityScore = 8;
    if (wordCount < 15) clarityScore = 4;
    else if (wordCount > 350) clarityScore = 6; // penalized for rambling
    else if (userAnswer.includes('\n') || userAnswer.includes('- ') || userAnswer.includes('1.')) clarityScore = 9;

    // Calculate overall weighted score
    const totalWeightedScore = 
      (techScore * weights.technicalCorrectness) +
      (depthScore * weights.depthOfUnderstanding) +
      (practicalScore * weights.practicalApplication) +
      (clarityScore * weights.clarityOfExplanation);

    const roundedOverall = Math.round(totalWeightedScore * 10) / 10;

    const correctPoints = matchedConcepts.length > 0 
      ? matchedConcepts.map(c => `Accurately identified: ${c.split('(')[0]}`)
      : ['Candidate provided an intuitive response, but lacked standard technical keyword formulation.'];

    return {
      score: roundedOverall,
      rubricBreakdown: {
        technicalCorrectness: {
          score: techScore,
          max: 10,
          weight: weights.technicalCorrectness,
          feedback: techScore >= 8 
            ? 'Strong technical accuracy with direct addressing of required terminology.'
            : techScore >= 5 
            ? 'Partially accurate; key principles were mentioned but core technical definitions were incomplete.'
            : 'Several fundamental technical components or definitions were missing or incorrect.'
        },
        depthOfUnderstanding: {
          score: depthScore,
          max: 10,
          weight: weights.depthOfUnderstanding,
          feedback: depthScore >= 8 
            ? 'Exhibited solid conceptual depth and explained underlying mechanisms effectively.'
            : 'Could dive deeper into mathematical foundations or underlying architectural reasons.'
        },
        practicalApplication: {
          score: practicalScore,
          max: 10,
          weight: weights.practicalApplication,
          feedback: practicalScore >= 7 
            ? 'Demonstrated strong real-world engineering and production trade-off awareness.'
            : 'Strengthen by highlighting real production failure modes, performance SLAs, or deployment constraints.'
        },
        clarityOfExplanation: {
          score: clarityScore,
          max: 10,
          weight: weights.clarityOfExplanation,
          feedback: clarityScore >= 8 
            ? 'Clear, well-structured, and concise communication suitable for senior interviews.'
            : 'Keep answers structured using bullet points or STAR format to maintain interview flow.'
        }
      },
      correctPoints,
      missingConcepts: missingConcepts.length > 0 ? missingConcepts : ['Great job! You covered all core concepts required.'],
      simpleExplanation: question.expectedConcepts.slice(0, 2).join(' Furthermore, '),
      modelAnswer: question.modelAnswer,
      suggestedFollowUp: question.suggestedFollowUp,
      practicalTip: question.practicalTip,
      source: 'local-engine'
    };
  }

  private static generateEmptyEvaluation(question: Question): AnswerEvaluation {
    return {
      score: 0.0,
      rubricBreakdown: {
        technicalCorrectness: { score: 0, max: 10, weight: 0.40, feedback: 'No answer provided.' },
        depthOfUnderstanding: { score: 0, max: 10, weight: 0.25, feedback: 'No answer provided.' },
        practicalApplication: { score: 0, max: 10, weight: 0.20, feedback: 'No answer provided.' },
        clarityOfExplanation: { score: 0, max: 10, weight: 0.15, feedback: 'No answer provided.' }
      },
      correctPoints: ['No answer submitted.'],
      missingConcepts: question.expectedConcepts,
      simpleExplanation: question.modelAnswer.slice(0, 150) + '...',
      modelAnswer: question.modelAnswer,
      suggestedFollowUp: question.suggestedFollowUp,
      practicalTip: question.practicalTip,
      source: 'local-engine'
    };
  }

  private static async evaluateWithGemini(
    question: Question,
    userAnswer: string,
    apiKey: string,
    weights = {
      technicalCorrectness: 0.40,
      depthOfUnderstanding: 0.25,
      practicalApplication: 0.20,
      clarityOfExplanation: 0.15
    }
  ): Promise<AnswerEvaluation | null> {
    const prompt = `You are a Principal AI/ML Engineer and hiring interviewer.
Evaluate the candidate's interview answer to the following technical question.

Question: ${question.questionText}
Topic: ${question.topic}
Difficulty: ${question.difficulty}
Expected Core Concepts:
${question.expectedConcepts.map(c => `- ${c}`).join('\n')}

Candidate Answer:
"""
${userAnswer}
"""

Evaluate strictly using this 4-pillar rubric (score 0-10 each):
1. technicalCorrectness (weight ${weights.technicalCorrectness}): accuracy, no hallucinations or false facts.
2. depthOfUnderstanding (weight ${weights.depthOfUnderstanding}): mechanisms, theoretical grasp, nuances.
3. practicalApplication (weight ${weights.practicalApplication}): real-world trade-offs, scalability, engineering constraints.
4. clarityOfExplanation (weight ${weights.clarityOfExplanation}): structure, concise, articulate delivery.

Return ONLY a valid JSON object with the following exact schema:
{
  "scores": {
    "technicalCorrectness": number,
    "depthOfUnderstanding": number,
    "practicalApplication": number,
    "clarityOfExplanation": number
  },
  "feedback": {
    "technicalCorrectness": string,
    "depthOfUnderstanding": string,
    "practicalApplication": string,
    "clarityOfExplanation": string
  },
  "correctPoints": string[],
  "missingConcepts": string[],
  "simpleExplanation": string,
  "suggestedFollowUp": string,
  "practicalTip": string
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText);
    const s = parsed.scores;
    const fb = parsed.feedback;

    const weightedScore =
      (s.technicalCorrectness * weights.technicalCorrectness) +
      (s.depthOfUnderstanding * weights.depthOfUnderstanding) +
      (s.practicalApplication * weights.practicalApplication) +
      (s.clarityOfExplanation * weights.clarityOfExplanation);

    return {
      score: Math.round(weightedScore * 10) / 10,
      rubricBreakdown: {
        technicalCorrectness: {
          score: s.technicalCorrectness,
          max: 10,
          weight: weights.technicalCorrectness,
          feedback: fb.technicalCorrectness
        },
        depthOfUnderstanding: {
          score: s.depthOfUnderstanding,
          max: 10,
          weight: weights.depthOfUnderstanding,
          feedback: fb.depthOfUnderstanding
        },
        practicalApplication: {
          score: s.practicalApplication,
          max: 10,
          weight: weights.practicalApplication,
          feedback: fb.practicalApplication
        },
        clarityOfExplanation: {
          score: s.clarityOfExplanation,
          max: 10,
          weight: weights.clarityOfExplanation,
          feedback: fb.clarityOfExplanation
        }
      },
      correctPoints: parsed.correctPoints || ['Answer provided valid domain knowledge.'],
      missingConcepts: parsed.missingConcepts || [],
      simpleExplanation: parsed.simpleExplanation || question.modelAnswer.slice(0, 160),
      modelAnswer: question.modelAnswer,
      suggestedFollowUp: parsed.suggestedFollowUp || question.suggestedFollowUp,
      practicalTip: parsed.practicalTip || question.practicalTip,
      source: 'gemini-ai'
    };
  }
}
