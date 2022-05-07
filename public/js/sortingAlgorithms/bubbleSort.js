import SortingAlgorithm from "./sortingAlgorithm.js";

class BubbleSort extends SortingAlgorithm {
    constructor(barGraph) {
        super(barGraph);
    }

    async sort() {
        let isSorted = false;
        let counter = 0;

        while (!isSorted) {
            isSorted = true;

            for (let i = 0; i < this.barGraphElements.length - 1 - counter; i++) {     
                await this.compare(i, i + 1);

                const firstBarHeight = this.getBarHeightFromElement(i);
                const secondBarHeight = this.getBarHeightFromElement(i + 1);

                if (firstBarHeight > secondBarHeight) {
                    await this.swap(i, i + 1);

                    isSorted = false;
                }
            }

            await this.sorted(this.barGraphElements.length - counter - 1);

            counter++;
        }

        this.finishSort();

        return this.barGraphElements;
    }
}

export default BubbleSort;