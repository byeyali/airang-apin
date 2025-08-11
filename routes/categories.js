const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categories");

router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.get("/", categoryController.getCategoryList);
router.get("/:id", categoryController.getCategoryById);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
