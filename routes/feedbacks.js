const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth"); // auth.js에서 export한 미들웨어
const feedbackController = require("../controllers/feedbacks");

router.post("/", authorization, feedbackController.createTutorFeedback);
router.put("/:id", authorization, feedbackController.updateTutorFeedback);
router.get("/", authorization, feedbackController.getTutorFeedbackList);
router.get("/:id", authorization, feedbackController.getTutorFeedbackList);
router.delete("/:id", authorization, feedbackController.deleteTutorFeedback);

module.exports = router;
