import { SEARCH_DELAY } from "./../config.js"

class PathfindingAlgorithm {
    constructor(board) {
        this.board = board;
        this.boardNodes = board.boardNodes;
        this.nodeElements = board.nodeElements;

        this.startNode = board.startNode;
        this.endNode = board.endNode;
        this.startNodeElement = board.startNodeElement;
        this.endNodeElement = board.endNodeElement;
    }

    getNeighboringNodes(node, nodes) {
        const neighbors = [];

        const numRow = nodes.length;
        const numCol = nodes[0].length;

        const row = node.rowIdx;
        const col = node.colIdx;

        if (row + 1 < numRow) neighbors.push(nodes[row + 1][col]);
        if (row - 1 >= 0) neighbors.push(nodes[row - 1][col]);
        if (col + 1 < numCol) neighbors.push(nodes[row][col + 1]);
        if (col - 1 >= 0) neighbors.push(nodes[row][col - 1]);

        return neighbors;
    }

    async showNeighborNode(node) {
        const nodeId = node.id;
        const nodeElement = this.board.getNodeElementById(nodeId);

        if (nodeElement.classList.contains("running-node")) return;

        nodeElement.classList.toggle("neighbor-node");

        await this.wait();
    }

    reconstructPath(endNode) {
        if (!endNode.cameFrom) return [];

        let currentNode = endNode;
        const path = [];

        while (currentNode) {
            path.push([currentNode.rowIdx, currentNode.colIdx]);

            currentNode = currentNode.cameFrom;
        }

        path.reverse();

        return path;
    }

    async showShortestPathNodes(path) {
        for (const coordinate of path) {
            const nodeId = coordinate[0].toString() + "-" + coordinate[1].toString();

            const nodeElement = this.board.getNodeElementById(nodeId);

            const isStartNodeElement = nodeElement === this.startNodeElement;
            const isEndNodeElement = nodeElement === this.endNodeElement;

            if (isStartNodeElement || isEndNodeElement) {
                // nodeElement.style.backgroundColor = "#FFF";
                continue;
            }

            if (nodeElement.classList.contains("running-node")) nodeElement.classList.toggle("running-node");

            nodeElement.classList.toggle("shortest-path-node");

            await this.wait();
        }
    }

    async showRunningNode(node) {
        const nodeId = node.id;
        const nodeElement = this.board.getNodeElementById(nodeId);

        if (nodeElement.classList.contains("neighbor-node")) nodeElement.classList.toggle("neighbor-node");

        nodeElement.classList.toggle("running-node");

        await this.wait();
    }

    async wait() {
        await new Promise ((resolve) => 
            setTimeout(() => {
                resolve();
            }, SEARCH_DELAY)
        );       
    }
}

export default PathfindingAlgorithm