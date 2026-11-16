import { InterviewConfig, Question, TopicCategory } from '../types';
import { QUESTION_BANK } from '../data/questions';

export class QuestionSelector {
  public static selectQuestionsForSession(config: InterviewConfig): Question[] {
    const { role, experienceLevel, interviewType, numQuestions, selectedTopics } = config;

    // Filter candidate questions by role and topics
    let pool = QUESTION_BANK.filter(q => {
      // Role match
      const roleMatches = q.roleCategories.includes(role);
      // Topic match (if user selected specific topics, otherwise include all)
      const topicMatches = selectedTopics.length === 0 || selectedTopics.includes(q.topic);
      // Type match (if user chose a specific interview type other than 'Mixed')
      const typeMatches = interviewType === 'Mixed' || q.type === interviewType;

      return roleMatches && topicMatches && typeMatches;
    });

    // If pool is too small due to strict filters, broaden pool with related questions
    if (pool.length < numQuestions) {
      const fallbackQuestions = QUESTION_BANK.filter(q => 
        selectedTopics.includes(q.topic) || q.roleCategories.includes(role)
      );
      const combined = Array.from(new Set([...pool, ...fallbackQuestions]));
      pool = combined;
    }

    // Sort questions by difficulty & relevance to experience level
    const preferredDiff = config.difficulty;
    const prioritized = [...pool].sort((a, b) => {
      const aDiffScore = a.difficulty === preferredDiff ? 2 : 1;
      const bDiffScore = b.difficulty === preferredDiff ? 2 : 1;
      const aExpScore = a.experienceLevels.includes(experienceLevel) ? 2 : 1;
      const bExpScore = b.experienceLevels.includes(experienceLevel) ? 2 : 1;
      return (bDiffScore + bExpScore) - (aDiffScore + aExpScore);
    });

    // Shuffle slightly within relevance tiers to avoid identical interview runs
    const shuffled = this.controlledShuffle(prioritized);

    // If candidate has resume projects and requested Project-Based or Mixed, ensure at least 1-2 project questions
    if (config.resumeText && (interviewType === 'Project-Based' || interviewType === 'Mixed')) {
      const projQ = QUESTION_BANK.find(q => q.topic === 'Project-Based');
      if (projQ && !shuffled.slice(0, numQuestions).some(q => q.id === projQ.id)) {
        shuffled.unshift(projQ);
      }
    }

    return shuffled.slice(0, numQuestions);
  }

  private static controlledShuffle(array: Question[]): Question[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      // 50% probability swap with nearby neighbor
      if (Math.random() > 0.4) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
    }
    return copy;
  }
}
