/**
 * Central Database Models Registry
 * Follows the eight core collections specified in Progress Report 03 and IEEE Paper:
 * 1. User
 * 2. Topic
 * 3. Problem
 * 4. Attempt (Submission)
 * 5. MasteryScore (TopicMastery)
 * 6. Roadmap
 * 7. RevisionSchedule
 * 8. HintSession
 */

const User = require('./User');
const Topic = require('./Topic');
const Problem = require('./Problem');
const Attempt = require('./Attempt');
const MasteryScore = require('./MasteryScore');
const Roadmap = require('./Roadmap');
const RevisionSchedule = require('./RevisionSchedule');
const HintSession = require('./HintSession');

// Supplementary models
const Profile = require('./Profile');
const LearningEvent = require('./LearningEvent');
const Assessment = require('./Assessment');
const AssessmentResult = require('./AssessmentResult');
const Pattern = require('./Pattern');
const Contest = require('./Contest');
const Achievement = require('./Achievement');
const MockInterview = require('./MockInterview');

module.exports = {
  // 8 Official Collections
  User,
  Topic,
  Problem,
  Attempt,
  MasteryScore,
  Roadmap,
  RevisionSchedule,
  HintSession,

  // Backwards compatibility aliases
  Submission: Attempt,
  TopicMastery: MasteryScore,

  // Supporting entities
  Profile,
  LearningEvent,
  Assessment,
  AssessmentResult,
  Pattern,
  Contest,
  Achievement,
  MockInterview
};
