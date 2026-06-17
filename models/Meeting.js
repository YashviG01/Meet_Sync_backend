const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "active",
        "completed",
        "cancelled",
      ],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

// meetingSchema.index({ roomId: 1 });
// meetingSchema.index({ organizer: 1 });
// meetingSchema.index({ startTime: 1 });

module.exports = mongoose.model(
  "Meeting",
  meetingSchema
);