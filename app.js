// app.js
require("dotenv").config(); // .env 환경변수 로드

const express = require("express");
const app = express();
const cors = require("cors");
// cors 허용
const allowedOrigins = [
  "http://localhost:3000",
  "https://witty-sand-004399200.1.azurestaticapps.net",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // 필요한 경우
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
  .sync({ alter: false }) // 첫 실행 시 alter:true 또는 force:true 사용 가능
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
