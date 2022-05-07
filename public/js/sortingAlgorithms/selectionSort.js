import SortingAlgorithm from "./sortingAlgorithm.js";

class SelectionSort extends SortingAlgorithm {
    constructor(barGraph) {
        super(barGraph)
    }

    async sort() {
        let startIndex = 0;

        while (startIndex < this.barGraphElements.length - 1) {
            let smallestIndex = startIndex;

            for (let i = startIndex + 1; i < this.barGraphElements.length; i++) {
                await this.compare(smallestIndex, i);

                const firstBarHeight = this.getBarHeightFromElement(smallestIndex);
                const secondBarHeight = this.getBarHeightFromElement(i);

                if (firstBarHeight > secondBarHeight) smallestIndex = i;
            }

            await this.swap(startIndex, smallestIndex);

            await this.sorted(startIndex);

            startIndex++;
        }

        this.finishSort();

        return this.barGraphElements;
    }
}

export default SelectionSort;