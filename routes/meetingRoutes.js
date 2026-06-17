const express = require("express");

const router = express.Router();

const { protectRoute } = require("../middlewares/authMiddleware");
const validate=require("../middlewares/validationMiddleware")
const {createMeetingValidation}=require("../validations/createMeetingValidation")
const {
  createMeeting,
  getMyMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  inviteParticipant,
  removeParticipant,
  joinRoom,
  startMeeting,
  endMeeting,
} = require("../controllers/meetingController");


console.log(typeof(protectRoute),
 typeof( createMeetingValidation),
  typeof(validate),
  typeof(createMeeting))

router.post(
  "/createMeeting",
  protectRoute,
  createMeetingValidation,
  validate,
  createMeeting,
);

// router.get("/getMyMeetings", protectRoute, getMyMeetings);

// router.get("/getMeetingById:meetingId", protectRoute, getMeetingById);

// router.put("/updateMeeting:meetingId", protectRoute, updateMeeting);

// router.delete("/:meetingId", protectRoute, deleteMeeting);

// router.post("/:meetingId/invite", protectRoute, inviteParticipant);

// router.delete(
//   "/:meetingId/participants/:userId",
//   protectRoute,
//   removeParticipant,
// );

// router.get("/room/:roomId", protectRoute, joinRoom);

// router.patch("/:meetingId/start", protectRoute, startMeeting);

// router.patch("/:meetingId/end", protectRoute, endMeeting);

module.exports = router;
