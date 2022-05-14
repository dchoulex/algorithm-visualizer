const path = require("path");

exports.getOverviewPage = function(_, res) {
    res.status(200).sendFile(path.resolve("public/overview.html"));
};

exports.getPathfindingPage = function(_, res) {
    res.status(200).sendFile(path.resolve("public/pathfindingAlgorithm.html"));
};

exports.getSortingPage = function(_, res) {
    res.status(200).sendFile(path.resolve("public/sortingAlgorithm.html"));
};