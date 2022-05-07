class Node {
    constructor(rowIdx, colIdx, colorValue) {
        this.id = rowIdx.toString() + "-" + colIdx.toString();
        this.width = 20;
        this.height = 20;
        
        this.rowIdx = rowIdx;
        this.colIdx = colIdx;
        this.colorValue = colorValue;
        this.weight = 0;

        this.distanceFromStart = Infinity;
        this.estimatedDistanceToEnd = Infinity;
        this.cameFrom = null;
    }
}

export default Node