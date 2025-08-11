const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locations");

router.get("/search", locationController.getAddress);
router.get("/area", locationController.getAddressArea);
router.get("/region", locationController.getRegionFromAddress);

module.exports = router;
