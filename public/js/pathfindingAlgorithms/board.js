import { EMPTY_NODE_COLOR_CODE, WALL_NODE_COLOR_CODE, START_NODE_COLOR_CODE, END_NODE_COLOR_CODE } from "../config.js";
import { NODE_WIDTH, NODE_HEIGHT } from "../config.js";
import Node from "./node.js";

const isPathfindingAlgorithm = document.getElementById("pathfinding-algorithm-visualizer-container");

class Board {
    _parentElement = document.querySelector("tbody");
    _activeColorCode = WALL_NODE_COLOR_CODE;
    _isTogglingWallNode;
    _isRelocatingStartNodeOrEndNode;

    // Event handlers
    _getStartNodeOrEndNodeInfoHandler = this.getStartNodeOrEndNodeInfo.bind(this);
    _toggleStartNodeOrEndNodeHandler = this.toggleStartNodeOrEndNode.bind(this);
    _toggleWallNodeHandler = this.toggleWallNode.bind(this);
    _toggleWallNodeContinuouslyHandler = this.toggleWallNodeContinuously.bind(this);
    _deactivateToggleWallNodeHandler = this.deactivateToggleWallNode.bind(this);
    _placeStartNodeOrEndNodeHandler = this.placeStartNodeOrEndNode.bind(this);
    _placeStartNodeOrEndNodeToClosestNodeHandler = this.placeStartNodeOrEndNodeToClosestNode.bind(this);
    _updateBoardHandler = this.updateBoard.bind(this);

    constructor() {
        this.numberOfRows = this.calculateNumberOfRows();
        this.numberOfColumns = this.calculateNumberOfColumns();
        this.boardNodes;
        this.nodeElements;

        this.startNodeId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);
        this.endNodeId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);

        this.startNode;
        this.endNode;
        this.startNodeElement;
        this.endNodeElement;
        
        this.updateBoard();
    }

    calculateNumberOfRows() {
        const navBar = document.getElementById("navbar");
        const footer = document.getElementById("footer");
        const navBarHeight = navBar.getBoundingClientRect().height;
        const footerHeight = footer.getBoundingClientRect().height;

        const boardContainerHeight = window.innerHeight - navBarHeight - footerHeight;
        const numberOfRows = Math.floor(boardContainerHeight / NODE_HEIGHT);
 
        return numberOfRows < 20 ? 20 : numberOfRows;
    }

    calculateNumberOfColumns() {
        const numberOfColumns = Math.floor(window.innerWidth / NODE_WIDTH);

        return numberOfColumns < 51 ? 51 : numberOfColumns;
    }

    generateRandomId(numberOfRows, numberOfColumns) {
        const randomRowIdx = Math.floor(Math.random() * numberOfRows);
        const randomColIdx = Math.floor(Math.random() * numberOfColumns);
        const randomId = randomRowIdx.toString() + "-" + randomColIdx.toString();

        if (randomId === this.startNodeId) this.generateRandomId(numberOfRows, numberOfColumns);
        
        return randomId;
    }

    updateBoard() {
        this.recalculateBoardRowsAndColumns();

        this.boardNodes = this._generateBoard();

        this.renderBoard();

        this._addEventListeners();
    }

    clearPath() {
        this.recalculateBoardRowsAndColumns();

        this.boardNodes = this._generateBoardWithExistingWallNodes();

        this.renderBoard();

        this._addEventListeners();
    }

    resetBoard() {
        this.recalculateBoardRowsAndColumns();

        this.boardNodes = this._generateBoard();

        this.startNodeId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);
        this.endNodeId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);

        this.renderBoard();

        this._addEventListeners();
    }

    _generateBoardWithExistingWallNodes() {
        const wallNodesPosition = this.getExistingWallNodesPosition();
        const board = [];

        for (let rowIdx = 0; rowIdx < this.numberOfRows; rowIdx++) {
            const row = [];

            for (let colIdx = 0; colIdx < this.numberOfColumns; colIdx++) {
                const previousNode = this.boardNodes[rowIdx][colIdx];
                const previousNodeId = previousNode.id;
                let newNode;

                if (previousNodeId in wallNodesPosition) {
                    newNode = new Node(rowIdx, colIdx, WALL_NODE_COLOR_CODE)
                } else {
                    newNode = new Node(rowIdx, colIdx, EMPTY_NODE_COLOR_CODE);
                }
            
                row.push(newNode);
            }

            board.push(row);
        }

        return board;
    }

    _generateBoard() {
        const board = [];

        for (let rowIdx = 0; rowIdx < this.numberOfRows; rowIdx++) {
            const row = [];

            for (let colIdx = 0; colIdx < this.numberOfColumns; colIdx++) {
                const node = new Node(rowIdx, colIdx, EMPTY_NODE_COLOR_CODE);
                row.push(node);
            }

            board.push(row);
        }

        return board;
    }

    getExistingWallNodesPosition() {
        const wallNodesPosition = {};

        for (const nodeRow of this.boardNodes) {
            for (const node of nodeRow) {
                if (node.colorCode === WALL_NODE_COLOR_CODE) {
                    const nodeId = node.rowIdx.toString() + "-" + node.colIdx.toString();
                    wallNodesPosition[nodeId] = true;
                }
            }
        }

        return wallNodesPosition;
    }

    recalculateBoardRowsAndColumns() {
        this.numberOfRows = this.calculateNumberOfRows();
        this.numberOfColumns = this.calculateNumberOfColumns();
    }

    _addEventListeners() {
        window.addEventListener("resize", this._updateBoardHandler);
        this._parentElement.addEventListener("mouseleave", this._deactivateToggleWallNodeHandler);
        this._parentElement.addEventListener("mouseleave", this._placeStartNodeOrEndNodeToClosestNodeHandler);

        for (const nodeElement of this.nodeElements) {
            const isStartNodeElement = nodeElement === this.startNodeElement;
            const isEndNodeElement = nodeElement === this.endNodeElement;

            if (isStartNodeElement || isEndNodeElement) {
                this.startNodeElement.addEventListener("mousedown", this._getStartNodeOrEndNodeInfoHandler);
                this.endNodeElement.addEventListener("mousedown", this._getStartNodeOrEndNodeInfoHandler);
            } else {
                nodeElement.addEventListener("mousedown", this._toggleWallNodeHandler);
            }

            nodeElement.addEventListener("mouseup", this._deactivateToggleWallNodeHandler);
            nodeElement.addEventListener("mouseup", this._placeStartNodeOrEndNodeHandler);

            nodeElement.addEventListener("mouseenter", this._toggleWallNodeContinuouslyHandler);
            nodeElement.addEventListener("mouseenter", this._toggleStartNodeOrEndNodeHandler);

            nodeElement.addEventListener("mouseleave", this._toggleStartNodeOrEndNodeHandler);
        }
    }

    _removeEventListeners() {
        window.removeEventListener("resize", this._updateBoardHandler);
        this.startNodeElement.removeEventListener("mousedown", this._getStartNodeOrEndNodeInfoHandler);
        this.endNodeElement.removeEventListener("mousedown", this._getStartNodeOrEndNodeInfoHandler);

        for (const nodeElement of this.nodeElements) {
            nodeElement.removeEventListener("mousedown", this._toggleWallNodeHandler);
            nodeElement.removeEventListener("mouseup", this._deactivateToggleWallNodeHandler);
            nodeElement.removeEventListener("mouseup", this._placeStartNodeOrEndNodeHandler);
            nodeElement.removeEventListener("mouseenter", this._toggleWallNodeContinuouslyHandler);
            nodeElement.removeEventListener("mouseenter", this._toggleStartNodeOrEndNodeHandler);
            nodeElement.removeEventListener("mouseleave", this._toggleStartNodeOrEndNodeHandler);

            nodeElement.classList.toggle("restricted-node");
        }
    }

    toggleWallNode(event) {
        this._isTogglingWallNode = true;

        const nodeElement = event.target;

        const selectedNode = this.getNodeFromNodeElement(nodeElement);

        const isStartNode = selectedNode.colorCode === START_NODE_COLOR_CODE;
        const isEndNode = selectedNode.colorCode === END_NODE_COLOR_CODE;

        if (isStartNode || isEndNode) return;

        if (selectedNode.colorCode === WALL_NODE_COLOR_CODE) this.activeColorCode = EMPTY_NODE_COLOR_CODE;
        else this.activeColorCode = WALL_NODE_COLOR_CODE;

        selectedNode.colorCode = this.activeColorCode;

        nodeElement.classList.toggle("wall-node");
    }

    toggleWallNodeContinuously(event) {
        const nodeElement = event.target;
        const selectedNode = this.getNodeFromNodeElement(nodeElement);

        const isStartNode = selectedNode.colorCode === START_NODE_COLOR_CODE;
        const isEndNode = selectedNode.colorCode === END_NODE_COLOR_CODE;

        if (this._isTogglingWallNode && selectedNode.colorCode !== this.activeColorCode) {
            if (isStartNode || isEndNode) {
                if (!nodeElement.classList.contains("restricted-node")) nodeElement.classList.toggle("restricted-node");
                return;
            }

            selectedNode.colorCode = this.activeColorCode;

            nodeElement.classList.toggle("wall-node");
        }
    }

    deactivateToggleWallNode() {
        this.startNodeElement.classList.remove("restricted-node");
        this.endNodeElement.classList.remove("restricted-node");

        this._isTogglingWallNode = false;
    }

    getStartNodeOrEndNodeInfo(event) {
        this._isRelocatingStartNodeOrEndNode = true;

        const nodeElement = event.target;
        const node = this.getNodeFromNodeElement(nodeElement);

        this._activeColorCode = node.colorCode;

        nodeElement.classList.toggle("relocating-node");

        nodeElement.removeEventListener("mousedown", this._getStartNodeOrEndNodeInfoHandler);
    }

    toggleStartNodeOrEndNode(event) {
        const nodeClassList = this._activeColorCode === START_NODE_COLOR_CODE ? "start-node" : "end-node";
        const nodeElement = event.target;
        const selectedNode = this.getNodeFromNodeElement(nodeElement);

        if (this._isRelocatingStartNodeOrEndNode) {
            nodeElement.classList.toggle("relocating-node");

            if (selectedNode.colorCode === WALL_NODE_COLOR_CODE) nodeElement.classList.toggle("wall-node");

            nodeElement.classList.toggle(nodeClassList);
        }
    }

    placeStartNodeOrEndNode(event) {
        const nodeElement = event.target;
        const selectedNode = this.getNodeFromNodeElement(nodeElement);

        if (this._isRelocatingStartNodeOrEndNode) {
            selectedNode.colorCode = this._activeColorCode;

            if (this._activeColorCode === START_NODE_COLOR_CODE) {
                this.startNodeId = nodeElement.dataset.id;
                this.startNode = selectedNode;
                this.startNodeElement = nodeElement;
            } else if (this._activeColorCode === END_NODE_COLOR_CODE) {
                this.endNodeId = nodeElement.dataset.id;
                this.endNode = selectedNode;
                this.endNodeElement = nodeElement;
            }

            nodeElement.removeEventListener("mousedown", this._toggleWallNodeHandler);
            nodeElement.addEventListener("mousedown", this._getStartNodeOrEndNodeInfoHandler);

            this._activeColorCode = WALL_NODE_COLOR_CODE;

            this.deactivateRelocateStartNodeOrEndNode();
        }  
    }

    deactivateRelocateStartNodeOrEndNode() {
        this.startNodeElement.classList.remove("relocating-node");
        this.endNodeElement.classList.remove("relocating-node");

        this._isRelocatingStartNodeOrEndNode = false;
    }

    placeStartNodeOrEndNodeToClosestNode(event) {
        const cursorHorizontalPosition = event.clientX;
        const cursorVerticalPosition = event.clientY;
        const borderNodes = this.getBorderNodes();
        // console.log(`Horizontal position : ${cursorHorizontalPosition}`);
        // const leftNode = this.getNodeElementById("0-0");
        // const rightNode = this.getNodeElementById("0-59");
        // console.log(`Left node : ${leftNode.getBoundingClientRect().left}`)
        // console.log(`Right node : ${rightNode.getBoundingClientRect().left}`)

        // console.log(`Vertical position : ${cursorHorizontalPosition}`);
        // const topNode = this.getNodeElementById("0-0");
        // const bottomNode = this.getNodeElementById("19-0");
        // console.log(`Top node : ${topNode.getBoundingClientRect().top}`)
        // console.log(`Bottom node : ${bottomNode.getBoundingClientRect().top}`)
        
        for (const borderNode of borderNodes) {
            const nodeElement = this.getNodeElementFromNode(borderNode);
            const nodeElementPosition = nodeElement.getBoundingClientRect();
        }

    }

    getBorderNodes() {
        const borderNodes = [];

        for (const nodeRow of this.boardNodes) {
            for (const node of nodeRow) {
                const isVerticalBorder = node.rowIdx === 0 || node.rowIdx === this.numberOfRows - 1;
                const isHorizontalBorder = node.colIdx === 0 || node.colIdx === this.numberOfColumns - 1;
                const isBorder = isVerticalBorder || isHorizontalBorder;

                if (isBorder) borderNodes.push(node);
            }
        }

        return borderNodes;
    }

    _getAllNodeElements() {
        return document.querySelectorAll(".board-node");
    }

    renderBoard() {
        this._parentElement.innerHTML = "";

        for (let rowIdx = 0; rowIdx < this.numberOfRows; rowIdx++) {
            const rowMarkup = `<tr data-row-idx="${rowIdx}"></tr>`;

            this._parentElement.insertAdjacentHTML("afterbegin", rowMarkup);

            const rowElement = document.querySelector("[data-row-idx]");

            for (let colIdx = 0; colIdx < this.numberOfColumns; colIdx++) {
                const node = this.boardNodes[rowIdx][colIdx];
                let columnMarkup;

                if (node.colorCode === WALL_NODE_COLOR_CODE) {
                    columnMarkup = `<td class="board-node wall-node" data-id=${node.id}></td>`;                  
                } else {
                    columnMarkup = `<td class="board-node" data-id=${node.id}></td>`;                   
                }

                rowElement.insertAdjacentHTML("beforeend", columnMarkup);
            }
        } 

        this.nodeElements = this._getAllNodeElements();

        this.renderStartNodeAndEndNode();
    }

    renderStartNodeAndEndNode() {
        this.startNode = this.getNodeById(this.startNodeId);
        this.endNode = this.getNodeById(this.endNodeId);

        if (!this.startNode) {
            this.startNodeId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);
            this.startNode = this.getNodeById(this.startNodeId);
        }

        if (!this.endNode) {
            this.endNodeId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);
            this.endNode = this.getNodeById(this.endNodeId);
        }

        this.startNode.colorCode = START_NODE_COLOR_CODE;
        this.endNode.colorCode = END_NODE_COLOR_CODE;

        this.startNodeElement = this.getNodeElementById(this.startNodeId);
        this.endNodeElement = this.getNodeElementById(this.endNodeId);

        this.startNodeElement.classList.toggle("start-node");
        this.endNodeElement.classList.toggle("end-node");
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

    getNodeFromNodeElement(nodeElement) {
        const nodeId = nodeElement.dataset.id;

        return this.getNodeById(nodeId);
    }

    getNodeElementFromNode(node) {
        const nodeId = node.id;

        return this.getNodeElementById(nodeId);
    }
}

let board;

if (isPathfindingAlgorithm) {
    board = new Board();
}

export { board }