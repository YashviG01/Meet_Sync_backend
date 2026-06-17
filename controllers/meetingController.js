const Meeting = require("../models/Meeting");
const crypto = require("crypto");

const createMeeting = async (req, res, next) => {
  try {
    const { title, description, startTime, endTime } = req.body;//extract

    // if (!req.user) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Unauthorized",
    //   });
    // }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start time",
      });
    }

    if (isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid end time",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    let roomId;
    let existingRoom;
//create a room and room id
    do {
        //id created
      roomId = "meetsync-" + crypto.randomBytes(4).toString("hex");

      existingRoom = await Meeting.findOne({
        roomId,//find if a room existes with this id
      });
    } while (existingRoom);//if exists then find another one else breal out



    const meeting = await Meeting.create({
      title,
      description,
      organizer: req.user._id,
//right now,the participant is the owner itself
      participants: [req.user._id],

      roomId,

      startTime: start,
      endTime: end,

      status: "scheduled",
    });

    return res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",

      meeting,

      meetingLink: `${process.env.CLIENT_URL}/room/${roomId}`,
    });
  } catch (error) {
    console.error("Create Meeting Error:", error);

    next(error);
  }
};

module.exports = {
  createMeeting,
};

// const getMyMeetings = async () => {}



// const getMeetingById = async () => {}


// const updateMeeting = async () => {}

// const deleteMeeting = async () => {}

// const inviteParticipant = async () => {}

// const removeParticipant = async () => {}

// const joinRoom = async () => {}

// const startMeeting = async () => {}

// const endMeeting = async () => {}

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
