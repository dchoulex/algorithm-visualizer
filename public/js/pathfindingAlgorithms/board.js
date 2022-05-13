import Node from "./node.js";

const isPathfindingAlgorithm = document.getElementById("pathfinding-algorithm-visualizer-container");

class Board {
    _parentElement = document.querySelector("tbody");

    constructor() {
        this.numberOfRows = 20;
        this.numberOfColumns = 60;
        this.boardNodes = this._generateBoard();

        this.renderBoard();

        this.nodeElements = this._getAllNodeElements();
        
        this.startNodeId = "16-0";
        this.endNodeId = "12-59";

        this.startNodeElement = this.getNodeElementById(this.startNodeId);
        this.endNodeElement = this.getNodeElementById(this.endNodeId);
        
        this._initializeBoard();
    }

    _initializeBoard(){    
        this.renderStartNode();
    
        this.renderEndNode();
        
        this._addEventListeners();
    }

    _addEventListeners() {
        for (const nodeElement of this.nodeElements) {
            const isStartNodeElement = nodeElement === this.startNodeElement;
            const isEndNodeElement = nodeElement === this.endNodeElement

            if (isStartNodeElement || isEndNodeElement) continue;

            // nodeElement.addEventListener("click", changeColor);
            // nodeElement.addEventListener("mouse")
        }

        this.startNodeElement.addEventListener("dragstart", () => {
            console.log("I got dragged")
        }, false);

        this.endNodeElement.addEventListener("dragend", () => {

        })

        document.addEventListener("drop", event => {
            console.log("I got dropped");
        }, false)
    }
    
    renderStartNode() {
        this.startNodeElement.classList.toggle("start-node");
    }

    renderEndNode() {
        this.endNodeElement.classList.toggle("end-node");
    }

    _generateBoard() {
        const board = [];

        for (let rowIdx = 0; rowIdx < this.numberOfRows; rowIdx++) {
            const row = [];

            for (let colIdx = 0; colIdx < this.numberOfColumns; colIdx++) {
                const node = new Node(rowIdx, colIdx, 0);
                row.push(node);
            }

            board.push(row);
        }

        return board;
    }

    renderBoard() {
        for (let rowIdx = 0; rowIdx < this.numberOfRows; rowIdx++) {
            const rowMarkup = `<tr data-row-idx="${rowIdx}"></tr>`;

            this._parentElement.insertAdjacentHTML("afterbegin", rowMarkup);

            const rowElement = document.querySelector("[data-row-idx]");

            for (let colIdx = 0; colIdx < this.numberOfColumns; colIdx++) {
                const node = this.boardNodes[rowIdx][colIdx];

                const columnMarkup = `<td class="board-node" data-id=${node.id}></td>`;

                rowElement.insertAdjacentHTML("beforeend", columnMarkup);
            }
        } 
    }

    _getAllNodeElements() {
        return document.querySelectorAll(".board-node");
    }

    getNodeById(id) {
        for (const nodeRow of this.boardNodes) {
            for (const node of nodeRow) {
                if (node.id === id) return node;
            }
        }
    }
    
    getNodeElementById(id) {
        return document.querySelector(`td[data-id='${id}']`)
    }
}

let board;

if (isPathfindingAlgorithm) {
    board = new Board();
}

export { board }