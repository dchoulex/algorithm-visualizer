import { board } from "./pathfindingAlgorithms/board.js";

const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");
const chooseAlgorithmButton = document.getElementById("choose-algorithm-btn");
const generateMazeButtonText = document.getElementById("generate-maze-btn-text");
const generateMazeButton = document.getElementById("generate-maze-btn");
const findPathButton = document.getElementById("find-path-btn");
const restartBoardButton = document.getElementById("restart-board-btn");


export function restartBoard() {
    board.restartBoard();

    initializeButtons();
}

function initializeButtons() {
    chooseAlgorithmButtonText.innerText = "Choose algorithm";

    chooseAlgorithmButton.disabled = false;
    chooseAlgorithmButtonText.disabled = false;
    generateMazeButton.disabled = false;
    generateMazeButtonText.disabled = false;

    restartBoardButton.classList.toggle("hidden");
    findPathButton.classList.toggle("hidden");
}