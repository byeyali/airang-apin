const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth"); // auth.js에서 export한 미들웨어
const applyController = require("../controllers/applies");

router.post("/", authorization, applyController.createJobApply);
router.put("/:id", authorization, applyController.updateJobApply);
router.post("/:id", authorization, applyController.createContract);

module.exports = router;
