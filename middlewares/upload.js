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
    return `${Date.now()}-${file.originalname}`;
  },
  contentType: (req, file) => file.mimetype,
  metadata: (req, file) => ({ fieldName: file.fieldname }),
  // SAS 토큰 설정 추가
  sasOptions: {
    startsOn: new Date(), // 현재 시간으로 설정 (중요!)
    expiresOn: new Date(new Date().valueOf() + 24 * 60 * 60 * 1000), // 24시간 후 만료
    permissions: "r", // 읽기 권한만
  },
});

// multer 인스턴스 생성
const upload = multer({ storage: azureStorage });

// 단일파일 upload용, 다중파일 upload용
const uploadSingle = upload.single("file"); // 단일 파일 (field name: "file")
const uploadMultiple = upload.array("files", 10); // 다중 파일 (field name: "files", 최대 10개)

module.exports = {
  uploadSingle,
  uploadMultiple,
};
