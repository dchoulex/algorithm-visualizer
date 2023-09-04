// Import callback function for sorting algorithm
import { changeSpeed } from "./sortingAlgorithms/handlers/changeSpeed.js";
import { changeDataRange } from "./sortingAlgorithms/handlers/changeDataRange.js";
import { changeAlgorithm } from "./changeAlgorithm.js";
import { sort } from "./sortingAlgorithms/handlers/sort.js";
import { restartBarGraph } from "./sortingAlgorithms/handlers/restartBarGraph.js";

// Import callback function for pathfinding algorithm 
import { search } from "./pathfindingAlgorithms/handlers/search.js";
import { clearBoard, clearPath, resetBoard } from "./pathfindingAlgorithms/handlers/clearBoard.js"

// Overall DOM elements 
const closeModalButton = document.querySelector(".close-modal");
const algorithmSelectorButtons = document.querySelectorAll(".dropdown-item");
const errorMessage = document.getElementById("error-message");
const closeErrorMessageButton = document.getElementById("error-message-close-btn");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const modalPreviousButton = document.querySelector(".carousel-control-prev");
const modalNextButton = document.querySelector(".carousel-control-next");

// Sorting algorithm DOM elements 
const dataRangeSlider = document.getElementById("data-range-slider");
const speedButtons = document.querySelectorAll(".speed-btn");
const sortButton = document.getElementById("sort-btn");
const restartBarGraphButton = document.getElementById("restart-bar-graph-btn");

// Pathfinding algorithm DOM elements
const clearBoardButton = document.getElementById("clear-board-btn");
const clearPathButton = document.getElementById("clear-path-btn");
const resetBoardButton = document.getElementById("reset-board-btn");
const findPathButton = document.getElementById("find-path-btn");
const helpButton = document.getElementById("help-btn");
const createWallsVideo = document.getElementById("create-walls-video");
const deleteWallsVideo = document.getElementById("delete-walls-video");

if (closeModalButton) {
    closeModalButton.addEventListener("click", () => {
        if (!modal.classList.contains("hidden")) modal.classList.toggle("hidden");
        if (!overlay.classList.contains("hidden")) overlay.classList.toggle("hidden");
    })
};

if (speedButtons){
    speedButtons.forEach(button => {
        button.addEventListener("click", changeSpeed);
    })
};

if (dataRangeSlider) {
    dataRangeSlider.addEventListener("change", changeDataRange);
};

if (algorithmSelectorButtons) {
    algorithmSelectorButtons.forEach(button => {
        button.addEventListener("click", changeAlgorithm)
    });
};

if (sortButton) {
    sortButton.addEventListener("click", sort)
};

if (restartBarGraphButton) {
    restartBarGraphButton.addEventListener("click", restartBarGraph)
};

if (closeErrorMessageButton) {
    closeErrorMessageButton.addEventListener("click", () => {
        errorMessage.classList.remove("show");
        errorMessage.classList.toggle("hidden");
    })
};

if (findPathButton) {
    findPathButton.addEventListener("click", search);
}

if (clearBoardButton) {
    clearBoardButton.addEventListener("click", clearBoard);
}

if (clearPathButton) {
    clearPathButton.addEventListener("click", clearPath);
}

if (resetBoardButton) {
    resetBoardButton.addEventListener("click", resetBoard)
}

if (helpButton) {
    helpButton.addEventListener("click", () => {
        if (modal.classList.contains("hidden")) modal.classList.remove("hidden");
        if (overlay.classList.contains("hidden")) overlay.classList.remove("hidden");
    })
}

if (modalPreviousButton) {
    modalPreviousButton.addEventListener("click", () => {
        const activeModalTitle = document.querySelector(".carousel-item.active .modal-title").textContent;

        if (activeModalTitle === "Delete walls") createWallsVideo.play();
        if (activeModalTitle === "Clear the board") deleteWallsVideo.play();
    });
}

if (modalNextButton) {
    modalNextButton.addEventListener("click", () => {
        const activeModalTitle = document.querySelector(".carousel-item.active .modal-title").textContent;

        if (activeModalTitle === "Pathfinding Algorithm Visualizer") createWallsVideo.play();
        if (activeModalTitle === "Create walls") deleteWallsVideo.play();
    });
}