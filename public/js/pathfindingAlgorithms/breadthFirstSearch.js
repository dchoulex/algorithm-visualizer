import { WALL_NODE_COLOR_CODE, } from "../config.js";
import PathfindingAlgorithm from "./pathfindingAlgorithm.js";
import { stopAlgorithm, changeStopAlgorithm } from "./handlers/clearBoard.js";

class BreadthFirstSearch extends PathfindingAlgorithm {
    constructor(board) {
        super(board)
    }

    async search() {
        if (stopAlgorithm) changeStopAlgorithm(false);
        
        const nodesToVisit = [this.startNode];
        const visited = new Set();
        
        while(nodesToVisit.length) {
            if (stopAlgorithm) {
                changeStopAlgorithm(false);
                return;
            }

            const currentNode = nodesToVisit.shift();

            visited.add(currentNode.id);

            await this.showRunningNode(currentNode);

            if (currentNode === this.endNode) break;

            const neighbors = this.getNeighboringNodes(currentNode, this.boardNodes);

            for (const neighbor of neighbors) {
                if (stopAlgorithm) {
                    changeStopAlgorithm(false);
                    return;
                }
                
                if (neighbor.colorCode === WALL_NODE_COLOR_CODE || visited.has(neighbor.id)) continue;

                await this.showNeighborNode(neighbor);

                visited.add(neighbor.id);

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