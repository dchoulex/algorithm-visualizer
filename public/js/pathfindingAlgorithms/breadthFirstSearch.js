import PathfindingAlgorithm from "./pathfindingAlgorithm.js";
import { WALL_NODE_COLOR_CODE } from "../config.js";

class BreadthFirstSearch extends PathfindingAlgorithm {
    constructor(board) {
        super(board)
    }

    async search() {
        const nodesToVisit = [this.startNode];
        const visited = new Set();

        while(nodesToVisit.length) {
            const currentNode = nodesToVisit.shift();

            if (visited.has(currentNode.id)) continue;

            await this.showRunningNode(currentNode);

            visited.add(currentNode.id);

            if (currentNode === this.endNode) break;

            const neighbors = this.getNeighboringNodes(currentNode, this.boardNodes);

            for (const neighbor of neighbors) {
                if (neighbor.colorCode === WALL_NODE_COLOR_CODE || visited.has(neighbor.id)) continue;

                neighbor.cameFrom = currentNode;

                nodesToVisit.push(neighbor);
            }
        }

        const path = this.reconstructPath(this.endNode);

        await this.showShortestPathNodes(path);

        return path;
    }
}

export default BreadthFirstSearch;