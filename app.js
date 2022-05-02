const path = require("path");
const express = require("express");

const viewRouter = require("./routes/viewRoutes");
const pathfindingRouter = require("./routes/pathfindingRoutes");
const sortingRouter = require("./routes/sortingRoutes");

const app = express();

//Serving static files
app.use(express.static(path.join(__dirname,"public")));

//Routes
app.use("/", viewRouter);
app.use("/pathfinding-algorithm", pathfindingRouter);
app.use("/sorting-algorithm", sortingRouter);

module.exports = app;