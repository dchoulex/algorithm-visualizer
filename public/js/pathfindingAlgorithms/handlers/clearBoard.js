import { board } from "../components/board.js";

const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");
const chooseAlgorithmButton = document.getElementById("choose-algorithm-btn");
// const generateMazeButtonText = document.getElementById("generate-maze-btn-text");
// const generateMazeButton = document.getElementById("generate-maze-btn");
const findPathButton = document.getElementById("find-path-btn");

let stopAlgorithm;

export function clearBoard() {
    stopAlgorithm = true;

    board.updateBoard();

    initializeButtons();
}

export function clearPath() {
    stopAlgorithm = true;

    board.updateBoardWithExistingNodes();

    initializeButtons();
}

export function resetBoard() {
    stopAlgorithm = true;

    board.resetBoard();

    initializeButtons();
}

export function changeStopAlgorithm(value) {
    stopAlgorithm = value;
}

function initializeButtons() {
    chooseAlgorithmButton.disabled = false;
    chooseAlgorithmButtonText.disabled = false;
    // generateMazeButton.disabled = false;
    // generateMazeButtonText.disabled = false;
    findPathButton.disabled = false;
}

export { stopAlgorithm }