const express = require("express");
const userRoute = require("./userRoute.js");
const beritaRoute = require("./beritaRoute.js");
const uploadRoute = require("../cloudinary/routeUpload.js");

const router = express.Router();

router.use("/user", userRoute);
router.use("/berita", beritaRoute);
router.use("/cloudinary", uploadRoute);

module.exports = router;
