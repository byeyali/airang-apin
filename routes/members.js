const express = require("express");
const router = express.Router();
const memberController = require("../controllers/members");

router.post("/", memberController.createMember);
router.put("/:id", memberController.updateMember);
router.get("/", memberController.getMemberList);
router.get("/:id", memberController.getMemberById);
router.delete("/:id", memberController.deleteMember);

module.exports = router;
