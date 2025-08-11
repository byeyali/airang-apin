const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요합니다."});
    }
    // 토근 검증
    jwt.verify(token, process.env.JWT_SECRET, (err, member) => {
      if (err) {
        return res.status(401).json({ message: "토큰이 유효하지 않습니다." });
      }
      req.member = member;
      next(); // 다음으로 이동
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = authorization;
