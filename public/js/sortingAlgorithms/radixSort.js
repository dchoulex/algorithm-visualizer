import SortingAlgorithm from "./sortingAlgorithm.js";

class RadixSort extends SortingAlgorithm {
    constructor(barGraph) {
        super(barGraph);
    } 
    
    async sort() {
        if (this.barGraphElements.length === 0) return this.barGraphElements;

        let maxNumber = this.barHeights.reduce((maxHeight, height) => {
            maxHeight = maxHeight > height ? maxHeight : height;
            return maxHeight;
        }, 0);

        let digit = 0;

        while (maxNumber / (10 ** digit) >= 1) {
            await this.countingSort(this.barGraphElements, digit);

            digit++;
        }

        this.finishSort();

        return this.barGraphElements;
    }

    async countingSort(barGraphElements, digit) {
        const sortedHeights = new Array(barGraphElements.length).fill(0);
        const countArray = new Array(10).fill(0);

        const digitColumn = 10 ** digit;

        for (let i = 0; i < barGraphElements.length; i++) {
            const height = this.getBarHeightFromElement(i);

            const countIdx = Math.floor(height / digitColumn) % 10;

            await this.count(i);

            countArray[countIdx]++;
        }

        for (let i = 1; i < 10; i++) {
            countArray[i] += countArray[i - 1]
        }

        for (let i = barGraphElements.length - 1; i >= 0; i--) {
            const height = this.getBarHeightFromElement(i);
            const countIdx = Math.floor(height / digitColumn) % 10;
            countArray[countIdx]--;

            const sortedIdx = countArray[countIdx];
            sortedHeights[sortedIdx] = height;
        }

        for (let i = 0; i < barGraphElements.length; i++) {
            barGraphElements[i].style.height = `${sortedHeights[i]}px`;
            
            await this.replace(i);
        }
    }
}

export default RadixSort;