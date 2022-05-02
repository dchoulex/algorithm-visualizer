const express = require("express");
const viewsController = require("../controllers/viewsController");

const router = express.Router();

router.get("/", viewsController.getOverviewPage);

module.exports = router;