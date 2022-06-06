import SortingAlgorithm from "./sortingAlgorithm.js";

class InsertionSort extends SortingAlgorithm {
    constructor(barGraph) {
        super(barGraph)
    }
    
    async sort() {
        await this.tentativelySort(0);
        
        for (let i = 1; i < this.barGraphElements.length; i++) {
            let j = i;

            await this.compare(j, j - 1);
            
            while (j > 0 && this.getBarHeightFromElement(j) < this.getBarHeightFromElement(j - 1)) {
                await this.swap(j, j - 1, "#E2EDF9");

                j--;
            }

            await this.tentativelySort(i);
        }

        this.finishSort();

        return this.barGraphElements;
    }
}

export default InsertionSort;