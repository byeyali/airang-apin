const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth"); // auth.js에서 export한 미들웨어
const applyController = require("../controllers/applies");

router.use(authorization); // 공통 인증 적용

router.post("/", applyController.createJobApply);
router.get("/match/me", applyController.getJobApplyMatch);
router.get("/job/:jobId/apply", applyController.getJobApply);

router.patch("/:id", applyController.updateJobApply);
router.patch("/:id/status", applyController.updateApplyStatus);

module.exports = router;
