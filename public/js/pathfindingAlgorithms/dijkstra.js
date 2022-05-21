import { WALL_NODE_COLOR_CODE } from "../config.js";
import PathfindingAlgorithm from "./pathfindingAlgorithm.js";
import { stopAlgorithm, changeStopAlgorithm } from "./handlers/clearBoard.js";

class Dijkstra extends PathfindingAlgorithm {
    constructor(board) {
        super(board);
    }

    async search() {
        if (stopAlgorithm) changeStopAlgorithm(false);

        this.startNode.distanceFromStart = 0;

        const nodesToVisit = [this.startNode];
        const visited = new Set();

        while(nodesToVisit.length) {
            if (stopAlgorithm) {
                changeStopAlgorithm(false);
                return;
            }

            const currentMinDistanceNode = nodesToVisit.shift();

            visited.add(currentMinDistanceNode.id);

            await this.showRunningNode(currentMinDistanceNode);

            if (currentMinDistanceNode === this.endNode) break;

            const neighbors = this.getNeighboringNodes(currentMinDistanceNode, this.boardNodes);

            for (const neighbor of neighbors) {
                if (stopAlgorithm) {
                    changeStopAlgorithm(false);
                    return;
                }

                if (neighbor.colorCode === WALL_NODE_COLOR_CODE || visited.has(neighbor.id)) continue;

                await this.showNeighborNode(neighbor);

                visited.add(neighbor.id);

                const tentativeDistanceToNeighbor = currentMinDistanceNode.distanceFromStart + 1;

                if (tentativeDistanceToNeighbor >= neighbor.distanceFromStart) continue;

                neighbor.cameFrom = currentMinDistanceNode;
                neighbor.distanceFromStart = tentativeDistanceToNeighbor;

                nodesToVisit.push(neighbor);
            }
        }

        const path = this.reconstructPath(this.endNode);

        await this.showShortestPathNodes(path);

        return path;
    }
}

export default Dijkstra;