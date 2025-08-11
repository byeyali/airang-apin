const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { error } = require("console");
require("dotenv").config();

const { Member } = require("../models");

// 로그인
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await Member.findOne({
      where: { email },
    });

    // 회원 검증
    if (!member) {
      return res.status(401).json({ message: "미가입 회원입니다." });
    }

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, member.password);

    if (!isMatch) {
      return res.status(401).json({ message: "비밀번호가 맞지 않습니다." });
    }

    // 토큰 발급
    const token = jwt.sign(
      { id: member.id, email: member.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  // 또는 DB에서 리프레시 토큰 삭제 (DB에서 토큰을 관리하는 경우)
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    // DB에서 해당 리프레시 토큰 삭제
    await RefreshToken.destroy({ where: { token: refreshToken } });
  }

  return res.status(200).json({ message: "로그아웃 성공" });
};

module.exports = {
  login,
  logout,
};
