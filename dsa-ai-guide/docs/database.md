# 🗄️ Database Schemas & Data Model Reference

DSA AI Guide utilizes MongoDB with 15 normalized Mongoose schemas designed for ACID consistency, low latency reads, and granular telemetry event tracking.

---

## Collections Summary

1. **`users`**:
   - `_id`: ObjectId
   - `name`: String
   - `email`: String (Unique index)
   - `passwordHash`: String (bcrypt hash)
   - `role`: String ('student' | 'admin')
   - `xp`: Number
   - `level`: Number
   - `streakCurrent`: Number
   - `streakLongest`: Number
   - `streakFreezeCount`: Number
   - `lastActiveDate`: Date
   - `isAssessmentCompleted`: Boolean
   - `isOnboardingCompleted`: Boolean

2. **`profiles`**:
   - `userId`: ObjectId (Ref: User, Unique index)
   - `college`: String
   - `degree`: String
   - `branch`: String
   - `graduationYear`: Number
   - `currentDsaLevel`: String
   - `targetGoal`: String
   - `preferredLanguage`: String ('cpp' | 'python' | 'java' | 'javascript')
   - `dailyStudyMinutes`: Number (30 | 60 | 90 | 120 | 180)
   - `targetCompanies`: [String]
   - `codingExperience`: String

3. **`topics`**:
   - `slug`: String (Unique index)
   - `name`: String
   - `category`: String
   - `description`: String
   - `order`: Number
   - `icon`: String
   - `prerequisites`: [String]
   - `estimatedHours`: Number
   - `importanceLevel`: String

4. **`patterns`**:
   - `slug`: String (Unique index)
   - `name`: String
   - `description`: String
   - `conceptGuide`: String
   - `topicSlug`: String (Index)
   - `timeComplexity`: String
   - `spaceComplexity`: String

5. **`problems`**:
   - `slug`: String (Unique index)
   - `title`: String
   - `topicSlug`: String (Index)
   - `patternSlug`: String (Index)
   - `difficulty`: String ('Easy' | 'Medium' | 'Hard')
   - `source`: String
   - `description`: String
   - `constraints`: [String]
   - `sampleTestCases`: [{ input, output, explanation }]
   - `hiddenTestCases`: [{ input, output }]
   - `hints`: [{ level, title, hintText }] (5 Levels)
   - `starterCode`: { cpp, python, java, javascript }
   - `optimalTimeComplexity`: String
   - `optimalSpaceComplexity`: String

6. **`assessments`**:
   - `topicSlug`: String (Index)
   - `difficulty`: String
   - `type`: String ('mcq' | 'complexity' | 'debugging' | 'output_prediction' | 'code_completion' | 'pattern_id')
   - `question`: String
   - `codeSnippet`: String
   - `options`: [{ text }]
   - `correctOptionIndex`: Number
   - `explanation`: String
   - `points`: Number

7. **`assessmentresults`**:
   - `userId`: ObjectId (Ref: User, Unique index)
   - `overallScore`: Number (0-100)
   - `determinedLevel`: String
   - `topicScores`: Map of String -> Number
   - `conceptScore`: Number
   - `codingScore`: Number
   - `complexityScore`: Number
   - `patternScore`: Number
   - `strengths`: [String]
   - `weaknesses`: [String]
   - `priorityTopicSlugs`: [String]
   - `aiSummary`: String

8. **`roadmaps`**:
   - `userId`: ObjectId (Ref: User, Unique index)
   - `phases`: [{ phaseNumber, title, topicSlug, status ('locked'|'active'|'completed'), completionPercentage, masteryScore, problemSlugs }]
   - `currentPhaseNumber`: Number
   - `overallRoadmapCompletion`: Number

9. **`submissions`**:
   - `userId`: ObjectId (Index)
   - `problemSlug`: String (Index)
   - `language`: String
   - `code`: String
   - `status`: String ('Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error')
   - `runtimeMs`: Number
   - `memoryKb`: Number
   - `testCasesPassed`: Number
   - `totalTestCases`: Number
   - `aiReview`: { isCorrect, timeComplexity, spaceComplexity, patternDetected, qualityScore, interviewScore, critique, optimizations, edgeCaseWarnings }

10. **`topicmasteries`**:
    - Compound Index: `{ userId: 1, topicSlug: 1 }` (Unique)
    - `masteryScore`: Number (0-100)
    - `solvedCount`: Number
    - `attemptCount`: Number
    - `accuracyPercentage`: Number
    - `easyCount`: Number, `mediumCount`: Number, `hardCount`: Number
    - `avgSolveTimeSeconds`: Number

11. **`revisionschedules`**:
    - Compound Index: `{ userId: 1, problemSlug: 1 }` (Unique)
    - Index: `dueDate`
    - `repetitionNumber`: Number
    - `easeFactor`: Number
    - `intervalDays`: Number
    - `dueDate`: Date
    - `lastRevisedAt`: Date
    - `recallQualityHistory`: [{ quality, revisedAt, timeTakenSeconds }]

12. **`learningevents`**:
    - Compound Index: `{ userId: 1, timestamp: -1 }`
    - `eventType`: String ('problem_viewed', 'code_submitted', 'code_accepted', 'hint_requested', 'revision_completed', etc.)
    - `metadata`: Object
    - `timestamp`: Date
