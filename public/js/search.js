// Import board
import { board } from "./pathfindingAlgorithms/board.js";

// Import pathfinding algorithms
import AStar from "./pathfindingAlgorithms/AStar.js";

// DOM elements
const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");
const chooseAlgorithmButton = document.getElementById("choose-algorithm-btn");
const generateMazeButtonText = document.getElementById("generate-maze-btn-text");
const generateMazeButton = document.getElementById("generate-maze-btn");
const findPathButton = document.getElementById("find-path-btn");
const restartBoardButton = document.getElementById("restart-board-btn");
const errorMessage = document.getElementById("error-message");

export function search() {
    const algorithmChose = chooseAlgorithmButtonText.innerText;

    switch (algorithmChose) {
        case "Choose algorithm":
            if (errorMessage.classList.contains("show")) break;

            errorMessage.classList.toggle("show");

            break;

        case "A* algorithm":
            const aStar = new AStar(board);

            aStar.search();

            break;
    }

    if (algorithmChose === "Choose algorithm") return;

    disableButtons();

    board._removeEventListeners();
}

function disableButtons() {
    chooseAlgorithmButton.disabled = true;
    chooseAlgorithmButtonText.disabled = true;
    generateMazeButton.disabled = true;
    generateMazeButtonText.disabled = true;

    findPathButton.classList.toggle("hidden");
    restartBoardButton.classList.toggle("hidden");
}
