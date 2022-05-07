import SortingAlgorithm from "./sortingAlgorithm.js";

class QuickSort extends SortingAlgorithm {
    constructor(barGraph) {
        super(barGraph);
    }

    async sort() {
        const sortedHeights = this.barHeights.sort((a, b) => a - b);

        await this.quickSortHelper(0, this.barGraphElements.length - 1, this.barGraphElements, sortedHeights);

        return this.barGraphElements;
    }

    async quickSortHelper(startIdx, endIdx, barGraphElements, sortedHeights) {
        if (startIdx >= endIdx) return;

        const pivotIdx = startIdx;
        let leftIdx = pivotIdx + 1;
        let rightIdx = endIdx;

        await this.showPivot(pivotIdx);

        while (leftIdx <= rightIdx) {
            const leftIdxBarHeight = this.getBarHeightFromElement(leftIdx);
            const rightIdxBarHeight = this.getBarHeightFromElement(rightIdx);
            const pivotIdxBarHeight = this.getBarHeightFromElement(pivotIdx);

            await this.compare(leftIdx, rightIdx);

            if (startIdx === endIdx) this.sorted(startIdx);

            if (leftIdxBarHeight > pivotIdxBarHeight && rightIdxBarHeight < pivotIdxBarHeight) {
                await this.swap(leftIdx, rightIdx);
            }

            if (leftIdxBarHeight <= pivotIdxBarHeight) leftIdx++;
            if (rightIdxBarHeight >= pivotIdxBarHeight) rightIdx--;
        }      

        await this.swap(pivotIdx, rightIdx);

        await this.sorted(rightIdx);

        const leftSubarrayIsSmaller = rightIdx - 1 - startIdx < endIdx - (rightIdx + 1);
        
        if (leftSubarrayIsSmaller) {
            this.quickSortHelper(startIdx, rightIdx - 1, barGraphElements, sortedHeights);
            this.quickSortHelper(rightIdx + 1, endIdx, barGraphElements, sortedHeights);
        } else {
            this.quickSortHelper(rightIdx + 1, endIdx, barGraphElements, sortedHeights);
            this.quickSortHelper(startIdx, rightIdx - 1, barGraphElements, sortedHeights);
        }

        const currentSortedHeights = this.getArrayOfHeightsFromElements();

        const heightsAreEqual = currentSortedHeights.every((height, idx) => height === sortedHeights[idx]);

        if (heightsAreEqual) {
            this.finishSort();
        }
    }
}

export default QuickSort;