const express = require("express");
const viewsController = require("../controllers/viewsController");

const router = express.Router();

router.get("/", viewsController.getPathfindingPage);

module.exports = router;