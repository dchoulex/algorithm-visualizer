import PathfindingAlgorithm from "./pathfindingAlgorithm.js";
import MinHeap from "./minHeap.js"

class AStar extends PathfindingAlgorithm {
    constructor(board) {
        super(board);
    }

    async findPath() {
        this.startNode.distanceFromStart = 0;
        this.startNode.estimatedDistanceToEnd = this.calculateManhattanDistance(this.startNode, this.endNode);

        const nodesToVisit = new MinHeap([this.startNode]);

        while (!nodesToVisit.isEmpty()) {
            const currentMinDistanceNode = nodesToVisit.remove();

            if (currentMinDistanceNode === this.endNode) break;

            const neighbors = await this.getNeighboringNodes(currentMinDistanceNode, this.boardNodes);

            for (const neighbor of neighbors) {
                if (neighbor.colorCode === 1) continue;
			
                const tentativeDistanceToNeighbor = currentMinDistanceNode.distanceFromStart + 1;
                
                if (tentativeDistanceToNeighbor >= neighbor.distanceFromStart) continue;
                
                neighbor.cameFrom = currentMinDistanceNode;
                neighbor.distanceFromStart = tentativeDistanceToNeighbor;
                neighbor.estimateDistanceToEnd = tentativeDistanceToNeighbor + this.calculateManhattanDistance(neighbor, this.endNode);
                
                if (!nodesToVisit.containsNode(neighbor)) {
                    nodesToVisit.insert(neighbor)
                } else {
                    nodesToVisit.update(neighbor)
                }
            }
        }

        return this.reconstructPath(this.endNode);
    }

    calculateManhattanDistance(currentNode, endNode) {
        const currentRow = currentNode.rowIdx;
        const currentCol = currentNode.colIdx;
        const endRow = endNode.rowIdx;
        const endCol = endNode.colIdx;

        return Math.abs(currentRow - endRow) + Math.abs(currentCol - endCol);
    }
}

export default AStar;