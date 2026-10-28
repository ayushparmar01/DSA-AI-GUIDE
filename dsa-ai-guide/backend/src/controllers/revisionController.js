const spacedRepetitionService = require('../services/spacedRepetitionService');

const getDueRevisions = async (req, res, next) => {
  try {
    const revisions = await spacedRepetitionService.getDueRevisions(req.user._id);
    res.status(200).json({
      success: true,
      data: revisions,
      count: revisions.length
    });
  } catch (error) {
    next(error);
  }
};

const submitRevision = async (req, res, next) => {
  try {
    const { problemSlug, quality, timeTakenSeconds } = req.body;
    if (!problemSlug) {
      return res.status(400).json({ success: false, message: 'Problem slug is required' });
    }

    const schedule = await spacedRepetitionService.recordRevisionResult(req.user._id, problemSlug, {
      quality: quality !== undefined ? quality : 4,
      timeTakenSeconds: timeTakenSeconds || 300
    });

    res.status(200).json({
      success: true,
      data: schedule,
      message: 'Revision recorded and next interval updated.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDueRevisions, submitRevision };
