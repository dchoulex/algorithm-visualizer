// Import button callback function 
import { changeSpeed } from "./speed.js";
import { closeModal } from "./modal.js";
import { changeDataRange } from "./dataRange.js";
import { changeAlgorithm } from "./algorithmSelector.js";
import { sort } from "./sort.js";
import { init } from "./init.js";




const closeModalButton = document.querySelector(".close-modal");
const algorithmSelectorButtons = document.querySelectorAll(".dropdown-item");
const dataRangeSlider = document.getElementById("data-range-slider");
const speedButtons = document.querySelectorAll(".speed-btn");
const sortButton = document.getElementById("sort-btn");
const restartButton = document.getElementById("restart-btn");
const errorMessage = document.getElementById("error-message");
const closeErrorMessageButton = document.getElementById("error-message-close-btn");

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

if (restartButton) {
    restartButton.addEventListener("click", init)
};

if (closeErrorMessageButton) {
    closeErrorMessageButton.addEventListener("click", () => {
        errorMessage.classList.toggle("show");
    })
};


import { board } from "./pathfindingAlgorithms/board.js"

import AStar from "./pathfindingAlgorithms/AStar.js";

const aStar = new AStar(board);
aStar.search();