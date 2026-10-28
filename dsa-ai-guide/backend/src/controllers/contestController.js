const Contest = require('../models/Contest');
const Problem = require('../models/Problem');

const getContests = async (req, res, next) => {
  try {
    const contests = await Contest.find({}).sort({ startTime: -1 });
    res.status(200).json({ success: true, data: contests });
  } catch (error) {
    next(error);
  }
};

const getContestBySlug = async (req, res, next) => {
  try {
    const contest = await Contest.findOne({ slug: req.params.slug });
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    const problems = await Problem.find({ slug: { $in: contest.problemSlugs } }).select('-hiddenTestCases');
    res.status(200).json({
      success: true,
      data: { contest, problems }
    });
  } catch (error) {
    next(error);
  }
};

const submitContestProblem = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { problemSlug, status, timeSeconds } = req.body;

    const contest = await Contest.findOne({ slug });
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    let participant = contest.leaderboard.find(p => p.userId.toString() === req.user._id.toString());
    if (!participant) {
      contest.leaderboard.push({
        userId: req.user._id,
        userName: req.user.name,
        problemsSolvedCount: 0,
        totalScore: 0,
        finishTimeSeconds: 0,
        submissions: []
      });
      participant = contest.leaderboard[contest.leaderboard.length - 1];
    }

    participant.submissions.push({
      problemSlug,
      status,
      timeSeconds: timeSeconds || 120,
      attempts: 1
    });

    if (status === 'Accepted') {
      participant.problemsSolvedCount += 1;
      participant.totalScore += 100;
      participant.finishTimeSeconds = Math.max(participant.finishTimeSeconds, timeSeconds || 120);
    }

    // Sort leaderboard by score desc, time asc
    contest.leaderboard.sort((a, b) => b.totalScore - a.totalScore || a.finishTimeSeconds - b.finishTimeSeconds);

    await contest.save();

    res.status(200).json({
      success: true,
      data: contest.leaderboard,
      message: 'Contest submission recorded!'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getContests, getContestBySlug, submitContestProblem };
