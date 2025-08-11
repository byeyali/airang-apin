const { registerSchema } = require("../utils/validation");

const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error,
    });
  }
  next(); // 다음 미들웨어나 컨트롤러로 이동합니다.
};

module.exports = {
  validateRegister,
};
