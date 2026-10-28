const promptManager = require('../ai/promptManager');
const Problem = require('../models/Problem');

const analyzeCode = async (req, res, next) => {
  try {
    const { problemSlug, language, code } = req.body;

    let problem = null;
    if (problemSlug) {
      problem = await Problem.findOne({ slug: problemSlug });
    }

    const review = await promptManager.reviewCode({
      problemTitle: problem?.title || 'Custom Algorithm',
      problemDescription: problem?.description || '',
      language: language || 'cpp',
      code,
      constraints: problem?.constraints || [],
      optimalTime: problem?.optimalTimeComplexity || 'O(N)',
      optimalSpace: problem?.optimalSpaceComplexity || 'O(1)'
    });

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

const getProgressiveHint = async (req, res, next) => {
  try {
    const { problemSlug, level = 1, currentCode = '' } = req.body;
    const problem = await Problem.findOne({ slug: problemSlug });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    // Check if pre-seeded static progressive hint exists
    const staticHint = problem.hints?.find(h => h.level === level);
    let hintText = staticHint?.hintText;

    if (!hintText) {
      hintText = await promptManager.getProgressiveHint({
        problemTitle: problem.title,
        problemDescription: problem.description,
        currentHintLevel: level,
        currentCode
      });
    }

    res.status(200).json({
      success: true,
      data: {
        level,
        title: staticHint?.title || `Hint Level ${level}`,
        hintText
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeCode, getProgressiveHint };
