import { barGraph } from "../components/barGraph.js";

const speedButtons = document.querySelectorAll(".speed-btn");
const mediumSpeedButton = document.getElementById("medium-speed-btn");
const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");
const chooseAlgorithmButton = document.getElementById("choose-algorithm-btn");
const dataRangeSlider = document.getElementById("data-range-slider");
const sortButton = document.getElementById("sort-btn");
const restartBarGraphButton = document.getElementById("restart-bar-graph-btn");

export function restartBarGraph() {
    dataRangeSlider.value = 10;
    barGraph.update(dataRangeSlider.value);

    initializeButtons();
}

function initializeButtons() {
    chooseAlgorithmButtonText.innerText = "Choose algorithm";

    chooseAlgorithmButton.disabled = false;
    chooseAlgorithmButtonText.disabled = false;
    dataRangeSlider.disabled = false;

    sortButton.classList.toggle("hidden");
    restartBarGraphButton.classList.toggle("hidden");
    
    speedButtons.forEach(speedButton => {
        speedButton.style.backgroundColor = "#fff";
        speedButton.style.color = "#000";
    });

    mediumSpeedButton.style.backgroundColor = "#525252"
    mediumSpeedButton.style.color = "#fff";
}