import { board } from "../board.js";

const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");
const chooseAlgorithmButton = document.getElementById("choose-algorithm-btn");
const generateMazeButtonText = document.getElementById("generate-maze-btn-text");
const generateMazeButton = document.getElementById("generate-maze-btn");
const findPathButton = document.getElementById("find-path-btn");

export function clearBoard() {
    board.updateBoard();

    initializeButtons();
}

export function clearPath() {
    board.updateBoardWithExistingNodes();

    initializeButtons();
}

export function resetBoard() {
    board.resetBoard();

    initializeButtons();
}

function initializeButtons() {
    chooseAlgorithmButton.disabled = false;
    chooseAlgorithmButtonText.disabled = false;
    generateMazeButton.disabled = false;
    generateMazeButtonText.disabled = false;
    findPathButton.disabled = false;
}