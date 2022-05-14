import { EMPTY_NODE_COLOR_CODE, WALL_NODE_COLOR_CODE, START_NODE_COLOR_CODE, END_NODE_COLOR_CODE } from "../config.js";
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
    _continuouslyToggleWallNodeHandler = this.continuouslyToggleWallNode.bind(this);
    _deactivateToggleWallNodeHandler = this.deactivateToggleWallNode.bind(this);
    _placeStartNodeOrEndNodeHandler = this.placeStartNodeOrEndNode.bind(this);
    _initializeMouseEventHandler = this.initializeMouseEvent.bind(this);

    constructor() {
        this.numberOfRows = 20;
        this.numberOfColumns = 60;
        this.boardNodes;
        this.nodeElements;

        this.startNodeId = "16-0";
        this.endNodeId = "12-59";

        this.startNode;
        this.endNode;
        this.startNodeElement;
        this.endNodeElement;
        
        this.initializeBoard();
    }

    initializeBoard() {
        this._parentElement.innerHTML = "";

        this.boardNodes = this._generateBoard();

        this.renderBoard();

        this.nodeElements = this._getAllNodeElements();

        this.startNode = this.getNodeById(this.startNodeId);
        this.endNode = this.getNodeById(this.endNodeId);
        this.startNode.colorCode = START_NODE_COLOR_CODE;
        this.endNode.colorCode = END_NODE_COLOR_CODE;

        this.startNodeElement = this.getNodeElementById(this.startNodeId);
        this.endNodeElement = this.getNodeElementById(this.endNodeId);

        this.renderStartNode();
    
        this.renderEndNode();
        
        this._addEventListeners();
    }

    _addEventListeners() {
        this._parentElement.addEventListener("mouseleave", this._initializeMouseEventHandler);

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

            nodeElement.addEventListener("mouseenter", this._continuouslyToggleWallNodeHandler);
            nodeElement.addEventListener("mouseenter", this._toggleStartNodeOrEndNodeHandler);

            nodeElement.addEventListener("mouseleave", this._toggleStartNodeOrEndNodeHandler);
        }
    }

    _removeEventListeners() {
        this._parentElement.removeEventListener("mouseleave", this._initializeMouseEventHandler);

        this.startNodeElement.removeEventListener("mousedown", this._getStartNodeOrEndNodeInfoHandler);
        this.endNodeElement.removeEventListener("mousedown", this._getStartNodeOrEndNodeInfoHandler);

        for (const nodeElement of this.nodeElements) {
            nodeElement.removeEventListener("mousedown", this._toggleWallNodeHandler);
            nodeElement.removeEventListener("mouseup", this._deactivateToggleWallNodeHandler);
            nodeElement.removeEventListener("mouseup", this._placeStartNodeOrEndNodeHandler);
            nodeElement.removeEventListener("mouseenter", this._continuouslyToggleWallNodeHandler);
            nodeElement.removeEventListener("mouseenter", this._toggleStartNodeOrEndNodeHandler);
            nodeElement.removeEventListener("mouseleave", this._toggleStartNodeOrEndNodeHandler);
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

    continuouslyToggleWallNode(event) {
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
            // if (nodeElement === null) return;

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

    initializeMouseEvent() {
        this.deactivateToggleWallNode();
        this.deactivateRelocateStartNodeOrEndNode();
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

    _getAllNodeElements() {
        return document.querySelectorAll(".board-node");
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

    renderStartNode() {
        this.startNodeElement.classList.toggle("start-node");
    }

    renderEndNode() {
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
}

let board;

if (isPathfindingAlgorithm) {
    board = new Board();
}

export { board }