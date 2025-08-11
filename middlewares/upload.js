// 업로드 관련 미들웨어
const multer = require("multer");
const path = require("path");
const uploadDir = process.env.UPLOAD_DIR || "public/uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", uploadDir));
  },
  filename: function (req, file, cb) {
    let originalName = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    const fname = originalName + "-" + Date.now() + path.extname(originalName);
    cb(null, fname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
const uploadSingle = upload.single("photo");
const uploadMultiple = upload.array("files", 5); // 최대 5개 파일까지 업로드 가능
module.exports = {
  uploadSingle,
  uploadMultiple,
};
