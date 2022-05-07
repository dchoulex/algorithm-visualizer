import { MEDIUM_SPEED_DELAY } from "./config.js";
import { barGraph } from "./sortingAlgorithms/barGraph.js";

const speedButtons = document.querySelectorAll(".speed-btn");
const mediumSpeedButton = document.getElementById("medium-speed-btn");
const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");
const chooseAlgorithmButton = document.getElementById("choose-algorithm-btn");
const dataRangeSlider = document.getElementById("data-range-slider");
const sortButton = document.getElementById("sort-btn");
const restartButton = document.getElementById("restart-btn");

export function init() {
    let delay = MEDIUM_SPEED_DELAY;

    dataRangeSlider.value = 10;
    barGraph.update(dataRangeSlider.value);

    chooseAlgorithmButtonText.innerText = "Choose algorithm";

    enableButtons()

    speedButtons.forEach(speedButton => {
        speedButton.style.backgroundColor = "#fff";
        speedButton.style.color = "#000";
    });

    mediumSpeedButton.style.backgroundColor = "#525252"
    mediumSpeedButton.style.color = "#fff";
}

function enableButtons() {
    chooseAlgorithmButton.disabled = false;
    chooseAlgorithmButtonText.disabled = false;
    dataRangeSlider.disabled = false;

    sortButton.classList.toggle("hidden");
    restartButton.classList.toggle("hidden");
}