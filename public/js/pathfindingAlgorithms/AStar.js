import { WALL_NODE_COLOR_CODE } from "../config.js";
import PathfindingAlgorithm from "./pathfindingAlgorithm.js";
import MinHeap from "./minHeap.js";

import { stopAlgorithm, changeStopAlgorithm } from "./handlers/clearBoard.js";

class AStar extends PathfindingAlgorithm {
    constructor(board) {
        super(board);
    }

    async search() {
        if (stopAlgorithm) changeStopAlgorithm(false);

        this.startNode.distanceFromStart = 0;
        this.startNode.estimatedDistanceToEnd = this.calculateManhattanDistance(this.startNode, this.endNode);

        const nodesToVisit = new MinHeap([this.startNode]);
        const visited = new Set();

        while (!nodesToVisit.isEmpty()) {
            if (stopAlgorithm) {
                changeStopAlgorithm(false);
                return;
            };

            const currentMinDistanceNode = nodesToVisit.remove();

            if (visited.has(currentMinDistanceNode.id)) continue;

            visited.add(currentMinDistanceNode.id);

            await this.showRunningNode(currentMinDistanceNode);

            if (currentMinDistanceNode === this.endNode) break;

            const neighbors = this.getNeighboringNodes(currentMinDistanceNode, this.boardNodes);

            for (const neighbor of neighbors) {
                if (neighbor.colorCode === WALL_NODE_COLOR_CODE || visited.has(neighbor.id)) continue;
			
                const tentativeDistanceToNeighbor = currentMinDistanceNode.distanceFromStart + 1;
                
                if (tentativeDistanceToNeighbor >= neighbor.distanceFromStart) continue;
                
                neighbor.cameFrom = currentMinDistanceNode;
                neighbor.distanceFromStart = tentativeDistanceToNeighbor;
                neighbor.estimatedDistanceToEnd = tentativeDistanceToNeighbor + this.calculateManhattanDistance(neighbor, this.endNode);
                
                if (!nodesToVisit.containsNode(neighbor)) {
                    nodesToVisit.insert(neighbor)
                } else {
                    nodesToVisit.update(neighbor);
                }
            }
        }

        const path = this.reconstructPath(this.endNode);

        await this.showShortestPathNodes(path);

        return path;
    }

    calculateManhattanDistance(currentNode, endNode) {
        const currentRow = currentNode.rowIdx;
        const currentCol = currentNode.colIdx;
        const endRow = endNode.rowIdx;
        const endCol = endNode.colIdx;

        currentNode.horizontalDistanceToEnd = Math.abs(currentCol - endCol)
        currentNode.verticalDistanceToEnd = Math.abs(currentRow - endRow);

        return currentNode.horizontalDistanceToEnd + currentNode.verticalDistanceToEnd;
    }
}

export default AStar;