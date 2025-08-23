// const multer = require("multer");
// const { MulterAzureStorage } = require("multer-azure-blob-storage");
// require("dotenv").config();

// // Azure Storage 설정
// const azureStorage = new MulterAzureStorage({
//   connectionString: `DefaultEndpointsProtocol=https;AccountName=${process.env.AZURE_STORAGE_ACCOUNT_NAME};AccountKey=${process.env.AZURE_STORAGE_ACCOUNT_KEY};EndpointSuffix=core.windows.net`,
//   containerName: process.env.AZURE_CONTAINER_NAME,
//   blobName: (req, file) => {
//     return `${Date.now()}-${file.originalname}`;
//   },
//   contentType: (req, file) => file.mimetype,
//   metadata: (req, file) => ({ fieldName: file.fieldname }),
// });

// // multer 인스턴스 생성
// const upload = multer({ storage: azureStorage });

// // 단일파일 upload용, 다중파일 upload용
// const uploadSingle = upload.single("file"); // 단일 파일 (field name: "file")
// const uploadMultiple = upload.array("files", 10); // 다중 파일 (field name: "files", 최대 10개)

// module.exports = {
//   uploadSingle,
//   uploadMultiple,
// };

const multer = require("multer");
const { MulterAzureStorage } = require("multer-azure-blob-storage");
require("dotenv").config();

// Azure Storage 설정
const azureStorage = new MulterAzureStorage({
  connectionString: `DefaultEndpointsProtocol=https;AccountName=${process.env.AZURE_STORAGE_ACCOUNT_NAME};AccountKey=${process.env.AZURE_STORAGE_ACCOUNT_KEY};EndpointSuffix=core.windows.net`,
  containerName: process.env.AZURE_CONTAINER_NAME,
  blobName: (req, file) => {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    return `uploads/${timestamp}-${originalName}`;
  },
  contentType: (req, file) => file.mimetype,
  metadata: (req, file) => ({
    fieldName: file.fieldname,
    uploadedAt: new Date().toISOString(),
  }),
  url: (req, file) => {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const blobName = `uploads/${timestamp}-${originalName}`;
    return `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/${blobName}`;
  },
});

// multer 인스턴스 생성
const upload = multer({
  storage: azureStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("이미지 파일만 업로드 가능합니다."), false);
    }
  },
});

// 단일파일 upload용, 다중파일 upload용
const uploadSingle = upload.single("file");
const uploadMultiple = upload.array("files", 10);

module.exports = {
  uploadSingle,
  uploadMultiple,
};
