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
    _updateBoardWithExistingNodesHandler = this.updateBoardWithExistingNodes.bind(this);

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

        this.boardNodes = this._generateBoardNodes();

        this.renderBoard();

        this._addEventListeners();
    }

    updateBoardWithExistingNodes() {
        this.recalculateBoardRowsAndColumns();

        this.boardNodes = this._generateBoardNodesFromExistingBoard();

        this.renderBoard();

        this._addEventListeners();
    }

    resetBoard() {
        this.recalculateBoardRowsAndColumns();

        this.boardNodes = this._generateBoardNodes();

        this.startNodeId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);
        this.endNodeId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);

        this.renderBoard();

        this._addEventListeners();
    }

    _generateBoardNodesFromExistingBoard() {
        const wallNodesPosition = this.getExistingWallNodesPosition();
        const board = [];

        for (let rowIdx = 0; rowIdx < this.numberOfRows; rowIdx++) {
            const row = [];

            for (let colIdx = 0; colIdx < this.numberOfColumns; colIdx++) {
                const currentNodeId = rowIdx.toString() + "-" + colIdx.toString();

                let newNode;

                if (currentNodeId in wallNodesPosition) {
                    newNode = new Node(rowIdx, colIdx, WALL_NODE_COLOR_CODE);
                } else {
                    newNode = new Node(rowIdx, colIdx, EMPTY_NODE_COLOR_CODE);
                }
            
                row.push(newNode);
            }

            board.push(row);
        }

        this.updateStartNode();
        this.updateEndNode();

        return board;
    }

    updateStartNode() {
        this.startNode = this.getNodeById(this.startNodeId);

        if (!this.startNode) {
            this.startNodeId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);
            this.startNode = this.getNodeById(this.startNodeId);
        }

        this.startNodeElement = this.getNodeElementFromNode(this.startNode);
        this.startNode.colorCode = START_NODE_COLOR_CODE;
    }

    updateEndNode() {
        this.endNode = this.getNodeById(this.endNodeId);

        if (!this.endNode) {
            this.endNodeId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);
            this.endNode = this.getNodeById(this.endNodeId);
        }

        this.endNodeElement = this.getNodeElementFromNode(this.endNode);
        this.endNode.colorCode = END_NODE_COLOR_CODE;
    }

    _generateBoardNodes() {
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
        window.addEventListener("resize", this._updateBoardWithExistingNodesHandler);
        this._parentElement.addEventListener("mouseleave", this._placeStartNodeOrEndNodeToClosestNodeHandler);
        this._parentElement.addEventListener("mouseleave", this._deactivateToggleWallNodeHandler);

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
        window.removeEventListener("resize", this._updateBoardWithExistingNodesHandler);
        this._parentElement.removeEventListener("mouseleave", this._placeStartNodeOrEndNodeToClosestNodeHandler);
        this._parentElement.removeEventListener("mouseleave", this._deactivateToggleWallNodeHandler);

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
        if (!this._isRelocatingStartNodeOrEndNode) return;

        const nodeElement = event.target;
        const selectedNode = this.getNodeFromNodeElement(nodeElement);

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

    deactivateRelocateStartNodeOrEndNode() {
        this.startNodeElement.classList.remove("relocating-node");
        this.endNodeElement.classList.remove("relocating-node");

        this._isRelocatingStartNodeOrEndNode = false;
    }

    placeStartNodeOrEndNodeToClosestNode(event) {
        if (!this._isRelocatingStartNodeOrEndNode) return;

        const cursorHorizontalPosition = Math.abs(event.clientX);
        const cursorVerticalPosition = Math.abs(event.clientY);

        const closestNode = this.getClosestNodeToBorder(cursorHorizontalPosition, cursorVerticalPosition);
        const closestNodeElement = this.getNodeElementFromNode(closestNode);

        closestNode.colorCode = this._activeColorCode;

        if (this._activeColorCode === START_NODE_COLOR_CODE) {
            this.startNodeId = closestNodeElement.dataset.id;
            this.startNode = closestNode;
            this.startNodeElement = closestNodeElement;
            closestNodeElement.classList.toggle("start-node");
        } else if (this._activeColorCode === END_NODE_COLOR_CODE) {
            this.endNodeId = closestNodeElement.dataset.id;
            this.endNode = closestNode;
            this.endNodeElement = closestNodeElement;
            closestNodeElement.classList.toggle("end-node");
        }

        console.log(this.startNodeId);

        closestNodeElement.removeEventListener("mousedown", this._toggleWallNodeHandler);
        closestNodeElement.addEventListener("mousedown", this._getStartNodeOrEndNodeInfoHandler);

        this._activeColorCode = WALL_NODE_COLOR_CODE;

        this.deactivateRelocateStartNodeOrEndNode();
    }

    getClosestNodeToBorder(cursorHorizontalPosition, cursorVerticalPosition) {
        const borderNodes = this.getBorderNodes();
        let closestNode = null;
        let minDistance = Infinity;
        
        for (const borderNode of borderNodes) {
            const borderNodeElement = this.getNodeElementFromNode(borderNode);
            const currentNodeVerticalPosition = borderNodeElement.getBoundingClientRect().top;
            const currentNodeHorizontalPosition = borderNodeElement.getBoundingClientRect().left;

            const horizontalDistance = Math.abs(currentNodeHorizontalPosition - cursorHorizontalPosition);
            const verticalDistance = Math.abs(currentNodeVerticalPosition - cursorVerticalPosition);

            const currentNodeMinDistance = horizontalDistance + verticalDistance;

            if (currentNodeMinDistance < minDistance) {
                minDistance = currentNodeMinDistance;
                closestNode = borderNode;
            }
        }

        return closestNode;
    }
    
    // getClosestNodeToBorder(cursorHorizontalPosition, cursorVerticalPosition) {
    //     const borderNodes = this.getBorderNodes();
    //     let closestNode = null;
    //     let minDistance = Infinity;
    //     const borderPosition = this.getBorderPosition(cursorHorizontalPosition, cursorVerticalPosition);

    //     for (const borderNode of borderNodes[borderPosition]) {
    //         if (cursorVerticalPosition) {
    //             const currentNodeVerticalPosition = borderNode.getBoundingClientRect().top;
    //             const currentNodeToCursorDistance = Math.abs(currentNodeVerticalPosition - cursorVerticalPosition);

    //             if (currentNodeToCursorDistance < minDistance) {
    //                 minDistance = currentNodeToCursorDistance;
    //                 closestNode = borderNode;
    //             }
    //         } 
            
    //         if (cursorHorizontalPosition) {
    //             const currentNodeHorizontalPosition = borderNode.getBoundingClientRect().left;
    //             const currentNodeToCursorDistance = Math.abs(currentNodeHorizontalPosition - cursorHorizontalPosition);

    //             if (currentNodeToCursorDistance < minDistance) {
    //                 minDistance = currentNodeToCursorDistance;
    //                 closestNode = borderNode;
    //             }
    //         }
    //     }

    //     return closestNode;

        // let closestNode;
        
        // for (const borderNode of borderNodes[border]) {
        //     const nodeElement = this.getNodeElementFromNode(borderNode);
        //     const nodeElementPosition = nodeElement.getBoundingClientRect();

        //     if (Math.abs(nodeElementPosition[direction] - cursorPosition) < 20) {
        //         console.log(nodeElementPosition[direction]);
        //         console.log(cursorPosition);
        //         closestNode = nodeElement;
        //         console.log(closestNode);
        //     }
        // }
    // }

    // getBorderPosition(cursorHorizontalPosition, cursorVerticalPosition) {
    //     if (cursorHorizontalPosition < 0) return "left";
    // }

    getBorderNodes() {
        const borderNodes = [];

        for (const nodeRow of this.boardNodes) {
            for (const node of nodeRow) {
                const isTopBorderNode = node.rowIdx === 0 
                const isBottomBorderNode = node.rowIdx === this.numberOfRows - 1;
                const isLeftBorderNode = node.colIdx === 0;
                const isRightBorderNode = node.colIdx === this.numberOfColumns - 1;

                const isBorderNode = isTopBorderNode || isBottomBorderNode || isLeftBorderNode || isRightBorderNode;

                if (isBorderNode) borderNodes.push(node);
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

            this._parentElement.insertAdjacentHTML("beforeend", rowMarkup);

            const rowElement = document.querySelector(`tr[data-row-idx="${rowIdx}"]`);

            for (let colIdx = 0; colIdx < this.numberOfColumns; colIdx++) {
                const node = this.boardNodes[rowIdx][colIdx];
                const columnMarkup = this.generateNodeMarkup(node);

                rowElement.insertAdjacentHTML("beforeend", columnMarkup);
            }
        } 

        this.nodeElements = this._getAllNodeElements();

        this.renderStartNodeAndEndNode();
    }

    generateNodeMarkup(node) {
        let columnMarkup;

        if (node.colorCode === EMPTY_NODE_COLOR_CODE) {
            columnMarkup = `<td class="board-node" data-id=${node.id}></td>`;                   
        }

        if (node.colorCode === WALL_NODE_COLOR_CODE) {
            columnMarkup = `<td class="board-node wall-node" data-id=${node.id}></td>`;                  
        } 

        if (node.colorCode === START_NODE_COLOR_CODE) {
            columnMarkup = `<td class="board-node start-node" data-id=${node.id}></td>`; 
        }

        if (node.colorCode === START_NODE_COLOR_CODE) {
            columnMarkup = `<td class="board-node end-node" data-id=${node.id}></td>`; 
        }

        return columnMarkup;
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