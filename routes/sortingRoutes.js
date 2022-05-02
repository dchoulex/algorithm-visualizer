const express = require("express");
const viewsController = require("../controllers/viewsController");

const router = express.Router();

router.get("/", viewsController.getSortingPage);

module.exports = router;