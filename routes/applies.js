const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth"); // auth.js에서 export한 미들웨어
const applyController = require("../controllers/applies");

router.post("/", authorization, applyController.createJobApply);
router.get("/match/me", authorization, applyController.getJobApplyMatch);
router.get("/:jobId/apply", authorization, applyController.getJobApply);

router.put("/:id", authorization, applyController.updateJobApply);
router.put(
  "/:jobId/:id/accept",
  authorization,
  applyController.updateApplyAccept
);

module.exports = router;
