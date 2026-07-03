const Meeting = require("../models/Meeting");

const completeMeeting = async (roomId) => {
  try {
//find the meet by the specific roomid
    const meeting =
      await Meeting.findOne({
        roomId,
      });
//not found case
    if (!meeting) {
      console.log(
        `Meeting not found for room ${roomId}`
      );
      return;
    }
//if already completed ,return
    if (
      meeting.status === "completed"
    ) {
      return;
    }
//else set it to complete
    meeting.status = "completed";
//setting the time at which it ended
    meeting.endedAt =
      new Date();
//saving
    await meeting.save();

    console.log(
      `Meeting ${roomId} completed`
    );

  } catch (err) {

    console.error(
      "Meeting completion error",
      err
    );

  }
};

module.exports =
  completeMeeting;