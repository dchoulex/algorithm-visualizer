import { delay } from "./../speed.js";

class PathfindingAlgorithm {
    constructor(board) {
        this.board = board;
        this.boardNodes = board.boardNodes;
        this.nodeElements = board.nodeElements;
        this.startNode = board.getNodeById(board.startNodeId);
        this.endNode = board.getNodeById(board.endNodeId);
        this.startNodeElement = board.startNodeElement;
        this.endNodeElement = board.endNodeLement;
    }

    async getNeighboringNodes(node, nodes) {
        const neighbors = [];

        const numRow = nodes.length;
        const numCol = nodes[0].length;

        const row = node.rowIdx;
        const col = node.colIdx;

        if (row + 1 < numRow) {
            neighbors.push(nodes[row + 1][col]);
        }

        if (row - 1 >= 0) {
            neighbors.push(nodes[row - 1][col]);
        }

        if (col + 1 < numCol) {
            neighbors.push(nodes[row][col + 1]);
        }

        if (col - 1 >= 0) {
            neighbors.push(nodes[row][col - 1]);
        }

        return neighbors;
    }

    async addNeighbor(node, neighbors) {
        const nodeId = node.id;
        const nodeElement = this.board.getNodeElementById(nodeId);

        neighbors.push(node);

        nodeElement.classList.toggle("neighbor-node");

        await this.wait(delay);
    }

    async wait(delay) {
        await new Promise ((resolve) => 
            setTimeout(() => {
                resolve();
            }, delay)
        );       
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
}

export default PathfindingAlgorithm