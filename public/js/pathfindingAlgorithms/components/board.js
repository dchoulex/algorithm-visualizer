// Import node properties
import { EMPTY_NODE_COLOR_CODE, WALL_NODE_COLOR_CODE, START_NODE_COLOR_CODE, END_NODE_COLOR_CODE } from "../../config.js";
import { NODE_WIDTH, NODE_HEIGHT, MIN_NUMBER_OF_ROWS, MIN_NUMBER_OF_COLS } from "../../config.js";

// Import node 
import Node from "./node.js";

const isPathfindingAlgorithm = document.getElementById("pathfinding-algorithm-visualizer-container");

class Board {
    _parentElement = document.querySelector("tbody");
    _activeColorCode = WALL_NODE_COLOR_CODE;
    _isTogglingWallNode;
    _isRelocatingStartNodeOrEndNode;
    _previousNodeElementForRelocation;

    // Event handlers
    _getNodeInfoHandler = this.getNodeInfo.bind(this);
    _toggleStartNodeOrEndNodeHandler = this.toggleStartNodeOrEndNode.bind(this);
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
 
        return numberOfRows < MIN_NUMBER_OF_ROWS ? MIN_NUMBER_OF_ROWS : numberOfRows;
    }

    calculateNumberOfColumns() {
        const numberOfColumns = Math.floor(window.innerWidth / NODE_WIDTH);

        return numberOfColumns < MIN_NUMBER_OF_COLS ? MIN_NUMBER_OF_COLS : numberOfColumns;
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

        this.boardNodes = this._generateBoardNodes(true);

        this.renderBoard();

        this._addEventListeners();
    }

    resetBoard() {
        this.recalculateBoardRowsAndColumns();

        this.startNodeId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);
        this.endNodeId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);

        this.boardNodes = this._generateBoardNodes();

        this.renderBoard();

        this._addEventListeners();
    }

    updateStartNode(id) {
        this.startNodeId = id;
        this.startNode = this.getNodeById(id);

        // Generate new start node when previous start node is outbound current window size (resizing event)
        if (!this.startNode) {
            const newId = this.generateRandomId(this.numberOfRows, this.numberOfColumns);
            this.startNodeId = newId;
            this.startNode = this.getNodeById(newId);
        }

        this.startNode.colorCode = START_NODE_COLOR_CODE;

        this.startNodeElement = this.getNodeElementFromNode(this.startNode);

        if (!this.startNodeElement.classList.contains("start-node")) this.startNodeElement.classList.toggle("start-node");
    }

    updateEndNode(id) {
        this.endNodeId = id;
        this.endNode = this.getNodeById(id);

        // Generate new end node when previous end node is outbound current window size (resizing event)
        if (!this.endNode) {
            const newId = this.generateRandomId(this.numberOfRows, this.numberOfColumns)
            this.endNodeId = newId;
            this.endNode = this.getNodeById(newId);
        }

        this.endNode.colorCode = END_NODE_COLOR_CODE;

        this.endNodeElement = this.getNodeElementFromNode(this.endNode);

        if (!this.endNodeElement.classList.contains("end-node")) this.endNodeElement.classList.toggle("end-node");
    }

    _generateBoardNodes(useExistingNodes = false) {
        const board = [];
        let wallNodeIds;

        if (useExistingNodes) {
            wallNodeIds = this.getExistingWallNodeIds();
        }

        for (let rowIdx = 0; rowIdx < this.numberOfRows; rowIdx++) {
            const row = [];

            for (let colIdx = 0; colIdx < this.numberOfColumns; colIdx++) {
                let nodeId = rowIdx.toString() + "-" + colIdx.toString();
                let node;

                if (nodeId === this.startNodeId) {
                    node = new Node(rowIdx, colIdx, START_NODE_COLOR_CODE);
                } else if (nodeId === this.endNodeId) {
                    node = new Node(rowIdx, colIdx, END_NODE_COLOR_CODE);
                } else if (useExistingNodes && nodeId in wallNodeIds) {
                    node = new Node(rowIdx, colIdx, WALL_NODE_COLOR_CODE);
                } else {
                    node = new Node(rowIdx, colIdx, EMPTY_NODE_COLOR_CODE)
                }

                row.push(node);
            }

            board.push(row);
        }

        return board;
    }

    getExistingWallNodeIds() {
        const wallNodeIds = {};

        for (const nodeRow of this.boardNodes) {
            for (const node of nodeRow) {
                if (node.colorCode === WALL_NODE_COLOR_CODE) {
                    const nodeId = node.rowIdx.toString() + "-" + node.colIdx.toString();
                    wallNodeIds[nodeId] = true;
                }
            }
        }

        return wallNodeIds;
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
            nodeElement.addEventListener("mousedown", this._getNodeInfoHandler);

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

        for (const nodeElement of this.nodeElements) {
            nodeElement.removeEventListener("mousedown", this._getNodeInfoHandler);
            nodeElement.removeEventListener("mouseup", this._deactivateToggleWallNodeHandler);
            nodeElement.removeEventListener("mouseup", this._placeStartNodeOrEndNodeHandler);
            nodeElement.removeEventListener("mouseenter", this._toggleWallNodeContinuouslyHandler);
            nodeElement.removeEventListener("mouseenter", this._toggleStartNodeOrEndNodeHandler);
            nodeElement.removeEventListener("mouseleave", this._toggleStartNodeOrEndNodeHandler);
            
            if (!nodeElement.classList.contains("restricted-node"))nodeElement.classList.toggle("restricted-node");
        }
    }

    toggleWallNodeContinuously(event) {
        const nodeElement = event.target;
        const selectedNode = this.getNodeFromNodeElement(nodeElement);

        const isStartNodeOrEndNode = this.validateStartNodeOrEndNode(selectedNode);

        if (this._isTogglingWallNode && selectedNode.colorCode !== this._activeColorCode) {
            if (isStartNodeOrEndNode && !nodeElement.classList.contains("restricted-node")) {
                nodeElement.classList.toggle("restricted-node");
                return;
            }

            selectedNode.colorCode = this._activeColorCode;

            nodeElement.classList.toggle("wall-node");
        }
    }

    deactivateToggleWallNode() {
        this.startNodeElement.classList.remove("restricted-node");
        this.endNodeElement.classList.remove("restricted-node");

        this._isTogglingWallNode = false;
    }

    getNodeInfo(event) {
        const nodeElement = event.target;
        const node = this.getNodeFromNodeElement(nodeElement);
        const isStartNodeOrEndNode = this.validateStartNodeOrEndNode(node);
        this._previousNodeElementForRelocation = nodeElement;

        if (isStartNodeOrEndNode) {
            this._isRelocatingStartNodeOrEndNode = true;

            this._activeColorCode = node.colorCode;
    
            nodeElement.classList.toggle("relocating-node");

        } else if (node.colorCode === EMPTY_NODE_COLOR_CODE) {
            this._isTogglingWallNode = true;

            this._activeColorCode = WALL_NODE_COLOR_CODE;

            node.colorCode = this._activeColorCode;

            if (!nodeElement.classList.contains("wall-node")) nodeElement.classList.toggle("wall-node");

        } else if (node.colorCode === WALL_NODE_COLOR_CODE) {
            this._isTogglingWallNode = true;

            this._activeColorCode = EMPTY_NODE_COLOR_CODE;

            node.colorCode = this._activeColorCode;

            if (nodeElement.classList.contains("wall-node")) nodeElement.classList.remove("wall-node");
        }
    }

    validateStartNodeOrEndNode(node) {
        return node.colorCode === START_NODE_COLOR_CODE || node.colorCode === END_NODE_COLOR_CODE;
    }

    toggleStartNodeOrEndNode(event) {
        if (!this._isRelocatingStartNodeOrEndNode) return;
        
        const nodeElement = event.target;
        const selectedNode = this.getNodeFromNodeElement(nodeElement);
        const selectedNodeClassList = this._activeColorCode === START_NODE_COLOR_CODE ? "start-node" : "end-node";
        const isOppositeNode = this._activeColorCode === START_NODE_COLOR_CODE && nodeElement.classList.contains("end-node") || this._activeColorCode === END_NODE_COLOR_CODE && nodeElement.classList.contains("start-node");

        if (isOppositeNode) {
            this._previousNodeElementForRelocation.classList.toggle("relocating-node");
            this._previousNodeElementForRelocation.classList.toggle(selectedNodeClassList);
            return;
        };

        nodeElement.classList.toggle("relocating-node");

        if (selectedNode.colorCode === WALL_NODE_COLOR_CODE) nodeElement.classList.toggle("wall-node");

        nodeElement.classList.toggle(selectedNodeClassList);

        this._previousNodeElementForRelocation = nodeElement;
    }

    placeStartNodeOrEndNode(event) {
        if (!this._isRelocatingStartNodeOrEndNode) return;

        let nodeElement = event.target;

        const isOppositeNode = this._activeColorCode === START_NODE_COLOR_CODE && nodeElement.classList.contains("end-node") || this._activeColorCode === END_NODE_COLOR_CODE && nodeElement.classList.contains("start-node");

        if (isOppositeNode) {
            this._previousNodeElementForRelocation.classList.toggle("relocating-node");
            nodeElement = this._previousNodeElementForRelocation;
        };

        this.placeStartNodeOrEndNodeHelper(nodeElement);
    }

    placeStartNodeOrEndNodeHelper(nodeElement) {
        if (this.startNodeElement.classList.contains("restricted-node")) this.startNodeElement.classList.remove("restricted-node");
        if (this.endNodeElement.classList.contains("restricted-node")) this.endNodeElement.classList.remove("restricted-node");

        if (this._activeColorCode === START_NODE_COLOR_CODE) {
            this.startNode.colorCode = EMPTY_NODE_COLOR_CODE;

            console.log(this.startNodeId);
            console.log(nodeElement.dataset.id)

            this.updateStartNode(nodeElement.dataset.id);

            console.log(this.startNodeId)

        } else if (this._activeColorCode === END_NODE_COLOR_CODE) {
            this.endNode.colorCode = EMPTY_NODE_COLOR_CODE;

            this.updateEndNode(nodeElement.dataset.id);
        }

        if (this.startNodeElement.classList.contains("relocating-node")) this.startNodeElement.classList.remove("relocating-node");
        if (this.endNodeElement.classList.contains("relocating-node")) this.endNodeElement.classList.remove("relocating-node");

        this._isRelocatingStartNodeOrEndNode = false;
    }

    placeStartNodeOrEndNodeToClosestNode(event) {
        if (!this._isRelocatingStartNodeOrEndNode) return;

        const cursorHorizontalPosition = event.clientX;
        const cursorVerticalPosition = event.clientY;

        let closestNodeElement = this.getClosestNodeElementToBorder(cursorHorizontalPosition, cursorVerticalPosition);

        const isTheOtherNode = this._activeColorCode === START_NODE_COLOR_CODE && closestNodeElement.classList.contains("end-node") || this._activeColorCode === END_NODE_COLOR_CODE && closestNodeElement.classList.contains("start-node");

        if (isTheOtherNode) {
            this._previousNodeElementForRelocation.classList.toggle("relocating-node");
            closestNodeElement = this._previousNodeElementForRelocation;
        };

        this.placeStartNodeOrEndNodeHelper(closestNodeElement);

    }

    getClosestNodeElementToBorder(cursorHorizontalPosition, cursorVerticalPosition) {
        const borderNodes = this.getBorderNodes();
        let closestNode = null;
        let minDistance = Infinity;
        
        for (const borderNode of borderNodes) {
            const borderNodeElement = this.getNodeElementFromNode(borderNode);
            const currentNodeVerticalPosition = borderNodeElement.getBoundingClientRect().top;
            const currentNodeHorizontalPosition = borderNodeElement.getBoundingClientRect().left;

            const horizontalDistance = currentNodeHorizontalPosition - cursorHorizontalPosition;
            const verticalDistance = currentNodeVerticalPosition - cursorVerticalPosition;

            const currentNodeMinDistance = Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2);

            if (currentNodeMinDistance < minDistance) {
                minDistance = currentNodeMinDistance;
                closestNode = borderNode;
            }
        }

        return this.getNodeElementFromNode(closestNode);
    }

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
                const columnMarkup = this._generateNodeMarkup(node);

                rowElement.insertAdjacentHTML("beforeend", columnMarkup);
            }
        } 

        this.nodeElements = this._getAllNodeElements();

        this.updateStartNode(this.startNodeId);

        this.updateEndNode(this.endNodeId);
    }

    _generateNodeMarkup(node) {
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

        if (node.colorCode === END_NODE_COLOR_CODE) {
            columnMarkup = `<td class="board-node end-node" data-id=${node.id}></td>`; 
        }

        return columnMarkup;
    }

    getNodeById(id) {
        for (const nodeRow of this.boardNodes) {
            for (const node of nodeRow) {
                if (node.id === id) return node;
            }
        }
    }
    
    getNodeElementById(id) {
        return document.querySelector(`td[data-id='${id}']`);
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