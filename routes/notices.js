const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth"); // auth.js에서 export한 미들웨어
const noticeController = require("../controllers/notices");

router.post("/", authorization, noticeController.createNotice);
router.put("/:id", noticeController.updateNotice);
router.get("/", noticeController.getNoticeList);
router.get("/:id", noticeController.getNoticeById);
router.delete("/:id", noticeController.deleteNotice);

module.exports = router;
