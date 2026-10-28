const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const User = require('../models/User');
const Profile = require('../models/Profile');
const TopicMastery = require('../models/TopicMastery');
const LearningEvent = require('../models/LearningEvent');
const promptManager = require('../ai/promptManager');

class AssessmentService {
  /**
   * Retrieves a balanced set of diagnostic questions across topics.
   */
  async getDiagnosticQuestions() {
    const questions = await Assessment.find({}).sort({ topicSlug: 1, difficulty: 1 });
    // Remove correctOptionIndex and explanation from payload sent to client for test security
    return questions.map(q => ({
      _id: q._id,
      topicSlug: q.topicSlug,
      difficulty: q.difficulty,
      type: q.type,
      question: q.question,
      codeSnippet: q.codeSnippet,
      options: q.options,
      points: q.points
    }));
  }

  /**
   * Evaluates answers and generates AI Skill Profile & baseline topic masteries.
   */
  async evaluateAssessment(userId, responses = []) {
    const allQuestions = await Assessment.find({});
    const questionMap = new Map(allQuestions.map(q => [q._id.toString(), q]));

    let totalEarnedPoints = 0;
    let maxPossiblePoints = 0;

    const topicPoints = {};
    const topicMaxPoints = {};

    let conceptPoints = 0, conceptMax = 0;
    let codingPoints = 0, codingMax = 0;
    let complexityPoints = 0, complexityMax = 0;
    let patternPoints = 0, patternMax = 0;

    const questionResults = [];

    for (const resp of responses) {
      const q = questionMap.get(resp.questionId?.toString());
      if (!q) continue;

      const isCorrect = q.correctOptionIndex === resp.selectedOptionIndex;
      const pts = isCorrect ? q.points : 0;

      totalEarnedPoints += pts;
      maxPossiblePoints += q.points;

      // Track by topic
      topicPoints[q.topicSlug] = (topicPoints[q.topicSlug] || 0) + pts;
      topicMaxPoints[q.topicSlug] = (topicMaxPoints[q.topicSlug] || 0) + q.points;

      // Track by category
      if (q.type === 'mcq') {
        conceptPoints += pts; conceptMax += q.points;
      } else if (q.type === 'complexity') {
        complexityPoints += pts; complexityMax += q.points;
      } else if (q.type === 'pattern_id') {
        patternPoints += pts; patternMax += q.points;
      } else {
        codingPoints += pts; codingMax += q.points;
      }

      questionResults.push({
        questionId: q._id,
        selectedOptionIndex: resp.selectedOptionIndex,
        isCorrect,
        timeTakenSeconds: resp.timeTakenSeconds || 30
      });
    }

    const overallScore = maxPossiblePoints > 0 ? Math.round((totalEarnedPoints / maxPossiblePoints) * 100) : 50;
    const conceptScore = conceptMax > 0 ? Math.round((conceptPoints / conceptMax) * 100) : 50;
    const codingScore = codingMax > 0 ? Math.round((codingPoints / codingMax) * 100) : 50;
    const complexityScore = complexityMax > 0 ? Math.round((complexityPoints / complexityMax) * 100) : 50;
    const patternScore = patternMax > 0 ? Math.round((patternPoints / patternMax) * 100) : 50;

    const topicScores = {};
    for (const [topic, maxPts] of Object.entries(topicMaxPoints)) {
      topicScores[topic] = Math.round(((topicPoints[topic] || 0) / maxPts) * 100);
    }

    const userProfile = await Profile.findOne({ userId }) || {};

    // Generate AI Profile via PromptManager
    const aiAnalysis = await promptManager.analyzeAssessment({
      scores: { overallScore, conceptScore, codingScore, complexityScore, patternScore },
      topicScores,
      answeredCount: responses.length,
      totalQuestions: allQuestions.length,
      userProfile
    });

    const determinedLevel = aiAnalysis.determinedLevel || (overallScore > 75 ? 'Advanced' : overallScore > 50 ? 'Intermediate' : 'Beginner');

    // Save AssessmentResult
    const assessmentResult = await AssessmentResult.findOneAndUpdate(
      { userId },
      {
        userId,
        overallScore,
        determinedLevel,
        topicScores,
        conceptScore,
        codingScore,
        complexityScore,
        patternScore,
        strengths: aiAnalysis.strengths || [],
        weaknesses: aiAnalysis.weaknesses || [],
        priorityTopicSlugs: aiAnalysis.priorityTopicSlugs || [],
        aiSummary: aiAnalysis.aiSummary || 'Assessment completed successfully.',
        aiRecommendationRationale: aiAnalysis.aiRecommendationRationale || '',
        estimatedCompletionWeeks: aiAnalysis.estimatedCompletionWeeks || 12,
        questionResponses: questionResults
      },
      { upsert: true, new: true }
    );

    // Initialize/Update TopicMastery for all evaluated topics
    for (const [slug, score] of Object.entries(topicScores)) {
      await TopicMastery.findOneAndUpdate(
        { userId, topicSlug: slug },
        {
          userId,
          topicSlug: slug,
          assessmentInitialScore: score,
          masteryScore: Math.round(score * 0.7) // Initial baseline mastery
        },
        { upsert: true }
      );
    }

    // Mark user assessment as completed
    await User.findByIdAndUpdate(userId, {
      isAssessmentCompleted: true,
      xp: { $inc: 150 }
    });

    // Update Profile current level
    await Profile.findOneAndUpdate({ userId }, { currentDsaLevel: determinedLevel });

    // Telemetry log
    await LearningEvent.create({
      userId,
      eventType: 'assessment_completed',
      metadata: { score: overallScore, determinedLevel }
    });

    return assessmentResult;
  }
}

module.exports = new AssessmentService();
