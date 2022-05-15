// Import callback function for sorting algorithm
import { changeSpeed } from "./speed.js";
import { closeModal } from "./modal.js";
import { changeDataRange } from "./dataRange.js";
import { changeAlgorithm } from "./algorithmSelector.js";
import { sort } from "./sort.js";
import { restartBarGraph } from "./restartBarGraph.js";

// Import callback function for pathfinding algorithm 
import { search } from "./search.js";
import { clearBoard, clearPath, resetBoard } from "./pathfindingAlgorithms/handlers/clearAndResetBoard.js"


// Overall DOM elements 
const closeModalButton = document.querySelector(".close-modal");
const algorithmSelectorButtons = document.querySelectorAll(".dropdown-item");
const errorMessage = document.getElementById("error-message");
const closeErrorMessageButton = document.getElementById("error-message-close-btn");

// Sorting algorithm DOM elements 
const dataRangeSlider = document.getElementById("data-range-slider");
const speedButtons = document.querySelectorAll(".speed-btn");
const sortButton = document.getElementById("sort-btn");
const restartBarGraphButton = document.getElementById("restart-bar-graph-btn");

// Pathfinding algorithm DOM elements
const findPathButton = document.getElementById("find-path-btn");
const clearBoardText = document.getElementById("clear-board-text");
const clearPathText = document.getElementById("clear-path-text");
const resetBoardText = document.getElementById("reset-board-text");

if (closeModalButton) {
    closeModalButton.addEventListener("click", closeModal)
};

if (speedButtons){
    speedButtons.forEach(button => {
        button.addEventListener("click", changeSpeed);
    })
};

if (dataRangeSlider) {
    dataRangeSlider.addEventListener("change", changeDataRange)
};

if (algorithmSelectorButtons) {
    algorithmSelectorButtons.forEach(button => {
        button.addEventListener("click", changeAlgorithm)
    })
};

if (sortButton) {
    sortButton.addEventListener("click", sort)
};

if (restartBarGraphButton) {
    restartBarGraphButton.addEventListener("click", restartBarGraph)
};

if (closeErrorMessageButton) {
    closeErrorMessageButton.addEventListener("click", () => {
        errorMessage.classList.toggle("show");
        errorMessage.classList.toggle("hidden");
    })
};

if (findPathButton) {
    findPathButton.addEventListener("click", search);
}

if (clearBoardText) {
    clearBoardText.addEventListener("click", clearBoard);
}

if (clearPathText) {
    clearPathText.addEventListener("click", clearPath);
}

if (resetBoardText) {
    resetBoardText.addEventListener("click", resetBoard)
}