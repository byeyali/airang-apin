const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth"); // auth.js에서 export한 미들웨어
const jobController = require("../controllers/jobs");

router.post("/", authorization, jobController.createTutorJob);
router.put("/:id", authorization, jobController.updateTutorJob);
router.get("/:id", jobController.getTutorJobById);
router.delete("/:id", authorization, jobController.deleteTutorJob);
router.post("/:id/category", authorization, jobController.addTutorJobCategory);
router.delete("/:id/category", authorization, jobController.deleteTutorJobCategory);

module.exports = router;
