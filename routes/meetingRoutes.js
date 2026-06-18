const express = require("express");

const router = express.Router();

const { protectRoute } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");
const {
  createMeetingValidation,
} = require("../validations/createMeetingValidation");
const{joinMeetingValidation}=require("../validations/joinMeetingValidation")
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


//Join meeting(would function for join button  on the homepage as well as the details page)
router.post(
  "/:meetingId/join",
  protectRoute,
  joinMeetingValidation,
  validate,
  joinMeeting
);


//end meet(host only)
router.post(
  "/:meetingId/end",
  protectRoute,
  endMeeting
);

//start an instant meeting on clicking start meeting button on homepage
// router.post(
//   "/start-instant",
//   protectRoute,
//   startInstantMeeting
// );




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



//cancel scheduled meets(host only)
// router.post(
//   "/:meetingId/cancel",
//   protectRoute,
//   cancelMeeting
// );



module.exports = router;
