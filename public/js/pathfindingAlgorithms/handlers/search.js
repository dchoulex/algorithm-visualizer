// Import board
import { board } from "../components/board.js";

// Import pathfinding algorithms
import DepthFirstSearch from "../depthFirstSearch.js";
import BreadthFirstSearch from "../breadthFirstSearch.js";
import Dijkstra from "../dijkstra.js";
import AStar from "../aStar.js";

// DOM elements
const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");
const chooseAlgorithmButton = document.getElementById("choose-algorithm-btn");
// const generateMazeButtonText = document.getElementById("generate-maze-btn-text");
// const generateMazeButton = document.getElementById("generate-maze-btn");
const findPathButton = document.getElementById("find-path-btn");
const errorMessage = document.getElementById("error-message");

export function search() {
    const algorithmChose = chooseAlgorithmButtonText.innerText;

    switch (algorithmChose) {
        case "Choose algorithm":
            if (errorMessage.classList.contains("show")) break;

            if (errorMessage.classList.contains("hidden")) errorMessage.classList.toggle("hidden");
            
            errorMessage.classList.toggle("show");

            break;

        case "Depth first search":
            const depthFirstSearch = new DepthFirstSearch(board);

            depthFirstSearch.search();

            break;

        case "Breadth first search":
            const breadthFirstSearch = new BreadthFirstSearch(board);

            breadthFirstSearch.search();

            break;

        case "Dijkstra's algorithm":
            const dijkstra = new Dijkstra(board);

            dijkstra.search();

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
    // generateMazeButton.disabled = true;
    // generateMazeButtonText.disabled = true;
    findPathButton.disabled = true;
}