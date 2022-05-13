import PathfindingAlgorithm from "./pathfindingAlgorithm.js";
import MinHeap from "./minHeap.js"

class AStar extends PathfindingAlgorithm {
    constructor(board) {
        super(board);
        for (let rowIdx = 0; rowIdx < 19; rowIdx++) {
            this.boardNodes[rowIdx][2].colorCode = 1;
            const newRow = 19 - rowIdx;
            this.boardNodes[newRow][4].colorCode = 1;
        }
        console.log(this.boardNodes)
    }

    async search() {
        this.startNode.distanceFromStart = 0;
        this.startNode.estimatedDistanceToEnd = this.calculateManhattanDistance(this.startNode, this.endNode);

        const nodesToVisit = new MinHeap([this.startNode]);

        while (!nodesToVisit.isEmpty()) {
            const currentMinDistanceNode = nodesToVisit.remove();

            // console.log(nodesToVisit.heap.map(node => node.distanceFromStart))
            await this.showRunningNode(currentMinDistanceNode);

            if (currentMinDistanceNode === this.endNode) break;

            const neighbors = this.getNeighboringNodes(currentMinDistanceNode, this.boardNodes);

            for (const neighbor of neighbors) {
                if (neighbor.colorCode === 1) continue;

                // await this.showNeighborNode(neighbor);
			
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