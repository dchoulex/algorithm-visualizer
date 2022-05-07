import SortingAlgorithm from "./sortingAlgorithm.js";

class MergeSort extends SortingAlgorithm {
    constructor(barGraph) {
        super(barGraph);
    }

    async sort() {
        if (this.barGraphElements.length === 1) return this.barGraphElements;

        const auxiliaryBarGraphElements = this.createNodeListClone(this.barGraphElements);

        await this.mergeSortHelper(0, this.barGraphElements.length - 1, this.barGraphElements, auxiliaryBarGraphElements);

        this.finishSort();

        return this.barGraphElements;
    }

    async mergeSortHelper(startIdx, endIdx, mainBarGraphElements, auxiliaryBarGraphElements) {
        if (startIdx === endIdx) return;

        const middleIdx = Math.floor((startIdx + endIdx) / 2);

        await this.mergeSortHelper(startIdx, middleIdx, auxiliaryBarGraphElements, mainBarGraphElements);
        
        await this.mergeSortHelper(middleIdx + 1, endIdx, auxiliaryBarGraphElements, mainBarGraphElements);

        await this.doMerge(startIdx, middleIdx, endIdx, mainBarGraphElements, auxiliaryBarGraphElements);
    }

    async doMerge(startIdx, middleIdx, endIdx, mainBarGraphElements, auxiliaryBarGraphElements) {
        let arrayIdx = startIdx;
        let leftIdx = startIdx;
        let rightIdx = middleIdx + 1;

        for (let i = startIdx; i < middleIdx + 1; i++) {
            await this.merge(i);
        }

        for (let i = middleIdx; i < endIdx + 1; i++) {
            await this.merge(i);
        }

        while (leftIdx <= middleIdx && rightIdx <= endIdx) {
            const auxiliaryBarGraphLeftIdxHeight = this.getBarHeightFromElement(leftIdx, auxiliaryBarGraphElements);
            const auxiliaryBarGraphRightIdxHeight = this.getBarHeightFromElement(rightIdx, auxiliaryBarGraphElements);

            await this.compare(leftIdx, rightIdx, "#842BFD");

            if (auxiliaryBarGraphLeftIdxHeight <= auxiliaryBarGraphRightIdxHeight) {
                mainBarGraphElements[arrayIdx].style.height = auxiliaryBarGraphElements[leftIdx].style.height;
                
                await this.replace(arrayIdx, "#842BFD");

                leftIdx++;
                
            } else {
                mainBarGraphElements[arrayIdx].style.height = auxiliaryBarGraphElements[rightIdx].style.height;

                await this.replace(arrayIdx, "#842BFD");

                rightIdx++;
            }

            arrayIdx++;
        }

        while (leftIdx <= middleIdx) {
            mainBarGraphElements[arrayIdx].style.height = auxiliaryBarGraphElements[leftIdx].style.height;

            await this.replace(arrayIdx, "#842BFD");

            leftIdx++;
            arrayIdx++;
        }

        for (let i = startIdx; i < middleIdx + 1; i++) {
            await this.tentativelySort(i);
        }

        while (rightIdx <= endIdx) {
            mainBarGraphElements[arrayIdx].style.height = auxiliaryBarGraphElements[rightIdx].style.height;

            await this.replace(arrayIdx, "#842BFD");

            rightIdx++;
            arrayIdx++;
        }

        for (let i = middleIdx; i < endIdx + 1; i++) {
            await this.tentativelySort(i);
        }

    }

    createNodeListClone(barGraphElements) {
        const auxiliaryBarGraphElements = [];

        for (const barGraphElement of barGraphElements) {
            const nodeClone = barGraphElement.cloneNode();
            auxiliaryBarGraphElements.push(nodeClone);
        }

        return auxiliaryBarGraphElements;
    }
}

export default MergeSort;