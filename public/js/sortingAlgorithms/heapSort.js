import SortingAlgorithm from "./sortingAlgorithm.js";

class HeapSort extends SortingAlgorithm {
    constructor(barGraph) {
        super(barGraph)
    }

    async sort() {
        await this.buildMaxHeap(this.barGraphElements);

        await this.revertAllBack();

        for (let endIdx = this.barGraphElements.length - 1; endIdx > 0; endIdx--) {
            await this.swap(0, endIdx);

            await this.revertBack(0, 0);
            
            await this.sorted(endIdx);

            await this.siftDown(0, endIdx - 1, this.barGraphElements);
        }

        this.finishSort();

        return this.barGraphElements;
    }

    async buildMaxHeap(barGraphElements) {
        let firstParentIdx = Math.floor((barGraphElements.length - 2) / 2);

        for (let currentIdx = firstParentIdx; currentIdx >= 0; currentIdx--) {
            await this.siftDown(currentIdx, barGraphElements.length - 1, barGraphElements);

            await this.revertBack(currentIdx, barGraphElements.length - 1);
        }

        await this.showHeap();
    }

    async siftDown(currentIdx, endIdx, heap) {
        let childOneIdx = currentIdx * 2 + 1;

        while (childOneIdx <= endIdx) {
            const childTwoIdx = currentIdx * 2 + 2 <= endIdx ? currentIdx * 2 + 2 : -1;

            let idxToSwap;

            if (childTwoIdx !== -1 && parseInt(heap[childTwoIdx].style.height) > parseInt(heap[childOneIdx].style.height)) {
                idxToSwap = childTwoIdx;
            } else {
                idxToSwap = childOneIdx;
            }

            await this.compare(currentIdx, idxToSwap);

            if (parseInt(heap[idxToSwap].style.height) > parseInt(heap[currentIdx].style.height)) {
                await this.swap(currentIdx, idxToSwap);

                currentIdx = idxToSwap;

                childOneIdx = currentIdx * 2 + 1;
            } else {
                return;
            }
        }
    }

    async showHeap() {
        for (const barGraphElement of this.barGraphElements) {
            barGraphElement.style.backgroundColor = "#FF7F50";
        }
        
        await this.heapWait();
    }

    async heapWait() {
        await new Promise ((resolve) =>
            setTimeout(() => {
                resolve();
            }, 500)
        )
    }
}

export default HeapSort;