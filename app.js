// app.js
require("dotenv").config(); // .env 환경변수 로드

const express = require("express");
const app = express();
const cors = require("cors");
// cors 모든 출처 허용 옵션
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 주소를 명시적으로 설정
    credentials: true,
  })
);

const db = require("./models");
const membersRoutes = require("./routes/members");
const authRoutes = require("./routes/auth");
const categoriesRoutes = require("./routes/categories");
const noticesRoutes = require("./routes/notices");
const tutorsRoutes = require("./routes/tutors");
const jobsRoutes = require("./routes/jobs");
const appliesRoutes = require("./routes/applies");
const feedbacksRoutes = require("./routes/feedbacks");
const locationsRoutes = require("./routes/locations");

const port = process.env.PORT || 3001;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

app.use("/members", membersRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/notices", noticesRoutes);
app.use("/tutors", tutorsRoutes);
app.use("/jobs", jobsRoutes);
app.use("/applies", appliesRoutes);
app.use("/feedbacks", feedbacksRoutes);
app.use("/locations", locationsRoutes);

// DB 동기화 후 서버 시작
console.log("📦 Sequelize: DB 동기화 시도 중...");
db.sequelize
  .sync({ alter: true }) // 첫 실행 시 alter:true 또는 force:true 사용 가능
  .then(() => {
    console.log("✅ Sequelize: 테이블 동기화 완료");
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Sequelize sync 실패:", err);
    process.exit(1); // 서버 시작 실패 시 종료
  });
