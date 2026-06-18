const Meeting = require("../models/Meeting");
const crypto = require("crypto");

const Meeting = require("../models/Meeting");
const crypto = require("crypto");

//schedule a meet
const createMeeting = async (req, res, next) => {
  try {
    const { title, description, startTime, endTime } = req.body;

    const organizer = req.user._id;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // validation
    if (start < now) {
      return res.status(400).json({
        success: false,
        message: "Start time cannot be in the past",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // generate roomId (IMPORTANT FOR YOUR SCHEMA)
    const roomId = crypto.randomBytes(6).toString("hex");

    const meeting = await Meeting.create({
      title,
      description,
      organizer,
      roomId,
      startTime: start,
      endTime: end,
      participants: [organizer],
      status: "scheduled",
    });

    const joinLink = `${process.env.CLIENT_URL}/meeting/join/${roomId}`;

    return res.status(201).json({
      success: true,
      meeting,
      joinLink,
    });
  } catch (error) {
    next(error);
  }
};

// GET    /api/meetings        → get my meetings
const getMyMeetings = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    //collect all the meetings
    //it would appear in the participants dashboard after the person has joined the meet.it would appear from the start in the dashboard of the person who is the host
    const meetings = await Meeting.find({
      $or: [{ organizer: userId }, { participants: userId }],
    })
      .populate("organizer", "name email")
      .populate("participants", "name email")
      .sort({ startTime: 1 }); // upcoming first

    if (!meetings || meetings.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No meetings found",
        meetings: [],
      });
    }

    //transforming raw to frontend friendly data for each meeting details
    const enrichedMeetings = meetings.map((m) => {
      return {
        _id: m._id,
        title: m.title,
        description: m.description,
        meetingId: m.roomId,
        organizer: m.organizer,
        participants: m.participants,
        startTime: m.startTime,
        endTime: m.endTime,
        status: m.status,

        isHost: m.organizer._id.toString() === userId.toString(),
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedMeetings.length,
      meetings: enrichedMeetings,
    });
  } catch (error) {
    next(error);
  }
};

// GET    /api/meetings/:id    → get meeting details
const getMeetingById = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const userId = req.user.userId;

    const meeting = await Meeting.findOne({
      roomId: meetingId,
    })
      .populate("organizer", "name email")
      .populate("participants", "name email");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }
    //useful for frontend may use it to show edit meeting, delete meeting,cancel meeting that are host specific opertions
    const isHost = meeting.organizer._id.toString() === userId.toString();

    //enriching for frontend for better display
    const now = new Date();

    const meetingDetails = {
      id: meeting._id,
      meetingId: meeting.roomId,
      roomId: meeting.roomId,

      title: meeting.title,
      description: meeting.description,

      organizer: meeting.organizer,
      participants: meeting.participants,

      participantCount: meeting.participants.length,

      startTime: meeting.startTime,
      endTime: meeting.endTime,
      durationInMinutes: Math.floor(
        (meeting.endTime - meeting.startTime) / (1000 * 60),
      ),

      status: meeting.status,

      isHost,

      joinLink: `${process.env.CLIENT_URL}/meeting/${meeting.roomId}`,

      canJoin: !["cancelled", "completed"].includes(meeting.status),

      isUpcoming:
        meeting.status === "scheduled" && new Date(meeting.startTime) > now,

      isActive: meeting.status === "active",

      isCompleted: meeting.status === "completed",

      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    };

    return res.status(200).json({
      success: true,
      meeting: meetingDetails,
    });
  } catch (error) {
    next(error);
  }
};

//join button(both the flows covered)

const joinMeeting = async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user.userId;

    const meeting = await Meeting.findOne({
      roomId: meetingId,
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Meeting cancelled
    if (meeting.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This meeting has been cancelled",
      });
    }

    // Meeting ended
    if (meeting.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "This meeting has already ended",
      });
    }

    const isHost = meeting.organizer.toString() === userId.toString();

    //   If host joins a scheduled meeting,
    //   automatically start it.

    if (isHost && meeting.status === "scheduled") {
      meeting.status = "active";
    }

    const alreadyJoined = meeting.participants.some(
      (participant) => participant.toString() === userId.toString(),
    );

    if (!alreadyJoined) {
      meeting.participants.push(userId);
    }

    await meeting.save();

    return res.status(200).json({
      success: true,
      message: alreadyJoined
        ? "You have already joined this meeting"
        : "Joined meeting successfully",

      roomId: meeting.roomId,

      meetingStatus: meeting.status,

      isHost,
    });
  } catch (error) {
    next(error);
  }
};

//(host only)

const endMeeting = async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user.userId;

    const meeting = await Meeting.findOne({
      roomId: meetingId,
    });

    // Meeting doesn't exist
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Only organizer can end meeting
    if (meeting.organizer.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the host can end this meeting",
      });
    }

    // Already ended
    if (meeting.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Meeting has already been ended",
      });
    }

    // Already cancelled
    if (meeting.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled meeting cannot be ended",
      });
    }

    // End meeting
    meeting.status = "completed";

    await meeting.save();

    return res.status(200).json({
      success: true,
      message: "Meeting ended successfully",

      meeting: {
        roomId: meeting.roomId,
        status: meeting.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

//(host only)
const deleteMeeting = async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user.userId;

    const meeting = await Meeting.findOne({
      roomId: meetingId,
    });

    // Meeting not found
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Only host can delete
    if (meeting.organizer.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the host can delete this meeting",
      });
    }

    // Optional safety check
    if (meeting.status === "active") {
      return res.status(400).json({
        success: false,
        message: "End the meeting before deleting it",
      });
    }

    await Meeting.deleteOne({
      _id: meeting._id,
    });

    return res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

//start meeting instantly on clicking start button on the home page

const startMeeting = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Generate unique room id
    //avoid roomid collision
    let roomId;
    let exists = true;

    while (exists) {
      roomId = crypto.randomBytes(8).toString("hex");

      exists = await Meeting.exists({
        roomId,
      });
    }

    const now = new Date();

    // Temporary duration
    const endTime = new Date(now.getTime() + 60 * 60 * 1000);

    const meeting = await Meeting.create({
      title: "Instant Meeting",
      description: "Started instantly",

      organizer: userId,

      participants: [userId],

      roomId,

      startTime: now,

      endTime,

      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Instant meeting started successfully",

      meeting: {
        id: meeting._id,
        roomId: meeting.roomId,
        status: meeting.status,

        joinLink: `${process.env.CLIENT_URL}/meeting/${meeting.roomId}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

// const inviteParticipant = async () => {}

// const removeParticipant = async () => {}
// PATCH  /api/meetings/:id    → update meeting (time, title, etc.)
// const updateMeeting = async () => {}

// module.exports = {
//   createMeeting,
//   getMyMeetings,
//   getMeetingById,
//   updateMeeting,
//   deleteMeeting,
//   inviteParticipant,
//   removeParticipant,
//   joinRoom,
//   startMeeting,
//   endMeeting,
// };

module.exports = {
  createMeeting,
  getMyMeetings,
  getMeetingById,
  joinMeeting,
  endMeeting,
  deleteMeeting,
  startMeeting,
};
