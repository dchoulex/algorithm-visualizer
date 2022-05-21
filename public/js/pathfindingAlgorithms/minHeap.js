class MinHeap {
    constructor(array) {
        this.nodePositionsInHeap = array.reduce((obj, node, idx) => {
            obj[node.id] = idx;
            return obj;
        }, {});

        this.heap = this.buildHeap(array);
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    buildHeap(array) {
        let firstParentIdx = Math.floor((array.length - 2) / 2);

        for (let currentIdx = firstParentIdx; currentIdx >= 0; currentIdx--) {
            this.siftDown(currentIdx, array.length - 1, array);
        };

        return array;
    }

    siftDown(currentIdx, endIdx, heap) {
        let childOneIdx = currentIdx * 2 + 1;

		while (childOneIdx <= endIdx) {
			let childTwoIdx = currentIdx * 2 + 2 <= endIdx ? currentIdx * 2 + 2 : -1;
			
			let idxToSwap;
			
			if (childTwoIdx !== -1 && heap[childTwoIdx].estimatedDistanceToEnd < heap[childOneIdx].estimatedDistanceToEnd) {
				idxToSwap = childTwoIdx;
			} else {
				idxToSwap = childOneIdx;
			}
			
			if (heap[idxToSwap].estimatedDistanceToEnd < heap[currentIdx].estimatedDistanceToEnd) {
				this.swap(currentIdx, idxToSwap, heap);
				currentIdx = idxToSwap;
				childOneIdx = currentIdx * 2 + 1;
			} else {
				break;
			}
		}
    }

    siftUp(currentIdx, heap) {
        let parentIdx = Math.floor((currentIdx - 1) / 2);
		
		while (currentIdx > 0 && heap[currentIdx].estimatedDistanceToEnd < heap[parentIdx].estimatedDistanceToEnd) {
			this.swap(currentIdx, parentIdx, heap);
			currentIdx = parentIdx;
			parentIdx = Math.floor((currentIdx - 1) / 2)
		}
    }

    peek() {
        return this.heap[0];
    }

    remove() {
        const idxToSwap = this.getMinDistanceNodeIdx();

		this.swap(idxToSwap, this.heap.length - 1, this.heap);

		const node = this.heap.pop();

		delete this.nodePositionsInHeap[node.id];

		this.siftDown(0, this.heap.length - 1, this.heap);
        
		return node;
    }

    getMinVerticalDistanceNodes() {
        const currentMinDistance = this.heap[0].estimatedDistanceToEnd;

        const nodes = this.heap.slice();
        const minManhattanDistanceNodes = [];

        for (const node of nodes) {
            if (node.estimatedDistanceToEnd === currentMinDistance) minManhattanDistanceNodes.push(node);
        };

        const minVerticalDistance = minManhattanDistanceNodes.reduce((minVerticalDistance, node) => {
            minVerticalDistance = minVerticalDistance < node.verticalDistanceToEnd ? minVerticalDistance : node.verticalDistanceToEnd;

            return minVerticalDistance;
        }, Infinity);

        const minVerticalDistanceNodes = [];

        for (const minManhattanDistanceNode of minManhattanDistanceNodes) {
            if (minManhattanDistanceNode.verticalDistanceToEnd === minVerticalDistance) minVerticalDistanceNodes.push(minManhattanDistanceNode);
        };

        return minVerticalDistanceNodes;
    }

    getMinDistanceNodeIdx() {
        const minVerticalDistanceNodes = this.getMinVerticalDistanceNodes();

        const minHorizontalDistance = minVerticalDistanceNodes.reduce((minHorizontalDistance, node) => {
            minHorizontalDistance = minHorizontalDistance < node.horizontalDistanceToEnd ? minHorizontalDistance : node.horizontalDistanceToEnd;

            return minHorizontalDistance;
        }, Infinity);

        const minDistanceNode = minVerticalDistanceNodes.find(node => node.horizontalDistanceToEnd === minHorizontalDistance);

        return this.heap.indexOf(minDistanceNode);
    }

    insert(node) {
        this.heap.push(node);
		this.nodePositionsInHeap[node.id] = this.heap.length - 1;
		this.siftUp(this.heap.length - 1, this.heap);
    }

    swap(i, j, heap) {
        this.nodePositionsInHeap[this.heap[i].id] = j;
		this.nodePositionsInHeap[this.heap[j].id] = i;
		
		const temp = heap[i];
		heap[i] = heap[j];
		heap[j] = temp;
    }

    containsNode(node) {
        return node.id in this.nodePositionsInHeap;
    }

    update(node) {
        this.siftUp(this.nodePositionsInHeap[node.id], this.heap);
    }
}

export default MinHeap;