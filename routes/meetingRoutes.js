const express = require("express");
const router = express.Router();

//middlewares
const { protectRoute } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");

//validations
const {createMeetingValidation} = require("../validations/createMeetingValidation");
const {joinMeetingValidation} = require("../validations/joinMeetingValidation");
const { meetingValidation } = require("../validations/meetingValidation");

//controllers
const {
  createMeeting,
  getMyMeetings,
  getMeetingById,
  joinMeeting,
  startMeeting,
  endMeeting,
  deleteMeeting,
} = require("../controllers/meetingController");


//routes for meeting management

//schedule meeting
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
router.get("/:meetingId", protectRoute, getMeetingById);

//Join meeting(would function for join button  on the homepage as well as the details page)
router.post(
  "/:meetingId/join",
  protectRoute,
  joinMeetingValidation,
  validate,
  joinMeeting,
);

//end meet(host only)
router.post(
  "/:meetingId/end",
  protectRoute,
  meetingValidation,
  validate,
  endMeeting,
);


//delete meet(host only)
router.delete( "/:meetingId", protectRoute,meetingValidation ,validate, deleteMeeting);



//start an instant meeting on clicking start meeting button on homepage
router.post(
  "/start-instant",
  protectRoute,
  startMeeting
);

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



// Start meeting (host)
// router.post("/:meetingId/start", protectRoute, startMeeting);

//cancel scheduled meets(host only)
// router.post(
//   "/:meetingId/cancel",
//   protectRoute,
//   cancelMeeting
// );

module.exports = router;
