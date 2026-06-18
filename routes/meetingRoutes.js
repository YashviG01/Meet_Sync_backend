const express = require("express");

const router = express.Router();

const { protectRoute } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");
const {
  createMeetingValidation,
} = require("../validations/createMeetingValidation");
const {
  createMeeting,
  getMyMeetings,
  getMeetingById,
  joinMeeting,
  startMeeting,
  endMeeting,
  deleteMeeting,
} = require("../controllers/meetingController");


router.post(
  "/scheduleMeeting",
  protectRoute,
  createMeetingValidation,
  validate,
  createMeeting,
);
//for dashboard
router.get("/", protectRoute, getMyMeetings);

//dashboard
 router.get(
  "/:meetingId",
  protectRoute,
  getMeetingById
);

//start an instant meeting on clicking start meeting button on homepage
// router.post(
//   "/start-instant",
//   protectRoute,
//   startInstantMeeting
// );


// Join meeting
//router.post("/:meetingId/join", protectRoute, joinMeeting);


//leave meeting
// router.post(
//   "/:meetingId/leave",
//   protectRoute,
//   leaveMeeting
// );


//update the meet(host only)
// router.patch(
//   "/:meetingId",
//   protectRoute,
//   createMeetingValidation,
//   validate,
//   updateMeeting
// );


//delete meet(host only)
// router.delete( "/:meetingId", protectRoute, deleteMeeting);


// Start meeting (host)
// router.post("/:meetingId/start", protectRoute, startMeeting);

//end meet(host only)
// router.post(
//   "/:meetingId/end",
//   protectRoute,
//   endMeeting
// );

//cancel scheduled meets(host only)
// router.post(
//   "/:meetingId/cancel",
//   protectRoute,
//   cancelMeeting
// );



module.exports = router;
