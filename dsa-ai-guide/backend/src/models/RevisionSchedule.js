const mongoose = require('mongoose');

const revisionScheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    problemSlug: {
      type: String,
      required: true,
      index: true
    },
    topicSlug: {
      type: String,
      required: true
    },
    repetitionNumber: {
      type: Number,
      default: 1
    },
    easeFactor: {
      type: Number,
      default: 2.5
    },
    intervalDays: {
      type: Number,
      default: 1
    },
    dueDate: {
      type: Date,
      required: true,
      index: true
    },
    lastRevisedAt: {
      type: Date,
      default: Date.now
    },
    recallQualityHistory: [
      {
        quality: Number, // 0 - 5
        revisedAt: { type: Date, default: Date.now },
        timeTakenSeconds: Number
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'completed', 'overdue'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

revisionScheduleSchema.index({ userId: 1, problemSlug: 1 }, { unique: true });

module.exports = mongoose.model('RevisionSchedule', revisionScheduleSchema);
