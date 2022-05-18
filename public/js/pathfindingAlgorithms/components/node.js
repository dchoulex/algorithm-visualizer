class Node {
    constructor(rowIdx, colIdx, colorCode) {
        this.id = rowIdx.toString() + "-" + colIdx.toString();
        this.width = 20;
        this.height = 20;
        
        this.rowIdx = rowIdx;
        this.colIdx = colIdx;
        this.colorCode = colorCode;
        this.weight = 0;

        this.distanceFromStart = Infinity;
        this.estimatedDistanceToEnd = Infinity;
        this.horizontalDistanceToEnd = null;
        this.verticalDistanceToEnd = null;
        this.cameFrom = null;
    }
}

export default Node