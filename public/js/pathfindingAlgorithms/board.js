import Node from "./node.js";

const isPathfindingAlgorithm = document.getElementById("pathfinding-algorithm-visualizer-container");

class Board {
    _parentElement = document.querySelector("tbody");

    constructor() {
        this.numberOfRows = 20;
        this.numberOfColumns = 60;
        this.board = this._generateBoard();
        this.renderBoard(this.board);
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

    renderBoard(board) {
        for (let rowIdx = 0; rowIdx < this.numberOfRows; rowIdx++) {
            const rowMarkup = `<tr data-row-idx="${rowIdx}"></tr>`;

            this._parentElement.insertAdjacentHTML("afterbegin", rowMarkup);

            const rowElement = document.querySelector("[data-row-idx]");

            for (let colIdx = 0; colIdx < this.numberOfColumns; colIdx++) {
                const node = board[rowIdx][colIdx];

                const columnMarkup = `<td class="board-node" data-id=${node.id}"></td>`;

                rowElement.insertAdjacentHTML("afterbegin", columnMarkup);
            }
        } 
    }
}

let board;

if (isPathfindingAlgorithm) {
    board = new Board();
}

export { board }