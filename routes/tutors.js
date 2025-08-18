const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth");
const { uploadSingle, uploadMultiple } = require("../middlewares/upload"); // 구조분해 할당
const {
  createTutor,
  getTutorByMemberId,
  updateTutor,
  getTutorList,
  addTutorCategory,
  getTutorCategoryList,
  deleteTutorCategory,
  addTutorRegion,
  getTutorRegionList,
  deleteTutorRegion,
  addTutorFile,
  deleteTutorFile,
  deleteTutor,
} = require("../controllers/tutors");

router.post("/", authorization, uploadSingle, createTutor);
router.get("/", authorization, getTutorByMemberId);
router.put("/:id", authorization, uploadSingle, updateTutor);
router.get("/list", authorization, getTutorList);
router.delete("/:id", authorization, deleteTutor);
router.post("/:id/category", authorization, addTutorCategory);
router.get("/:id/category", authorization, getTutorCategoryList);
router.delete("/:id/category", authorization, deleteTutorCategory);
router.post("/:id/region", authorization, addTutorRegion);
router.get("/:id/region", authorization, getTutorRegionList);
router.delete("/:id/region", authorization, deleteTutorRegion);
router.post("/:id/files", authorization, uploadMultiple, addTutorFile);
router.delete("/:id/files", authorization, deleteTutorFile);

module.exports = router;
