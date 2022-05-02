const path = require("path");

exports.getOverviewPage = function(req, res) {
    res.sendFile(path.resolve("public/overview.html"));
};

exports.getPathfindingPage = function(req, res) {
    res.sendFile(path.resolve("public/pathfindingAlgorithm.html"));
};

exports.getSortingPage = function(req, res) {
    res.sendFile(path.resolve("public/sortingAlgorithm.html"));
};