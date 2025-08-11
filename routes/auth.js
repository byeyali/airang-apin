const authController = require("../controllers/auth");
const authorizationToken = require("../middlewares/auth");
const express = require("express");
const router = express.Router(); // ✅ 반드시 Router()를 호출해야 합니다

const { Member } = require("../models");

// 로그인
router.post("/login", authController.login);

router.get("/me", authorizationToken, async (req, res) => {
  try {
    const member = await Member.findByPk(req.member.id);

    if (!member) {
      return res
        .status(404)
        .json({ message: "사용자 정보를 찾을 수 없습니다." });
    }
    res.json(member); // 회원 정보 반환
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

// 로그아웃 (선택적 - 클라이언트에서 토큰 삭제 방식)
router.post("/logout", authorizationToken, authController.logout);

module.exports = router;
