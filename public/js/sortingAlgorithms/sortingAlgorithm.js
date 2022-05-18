import { delay } from "./handlers/changeSpeed.js";

class SortingAlgorithm {
    constructor(barGraph) {
        this.barGraphElements = barGraph.barGraphElements; 
        this.barHeights = barGraph.barHeights;
    }

    getBarHeightFromElement(i, array = this.barGraphElements) {
        return parseInt(array[i].style.height)
    };

    getArrayOfHeightsFromElements() {
        const arrayOfHeights = [];

        for (const barGraphElement of this.barGraphElements) {
            const height = parseInt(barGraphElement.style.height);
            arrayOfHeights.push(height);
        }

        return arrayOfHeights;
    };

    async compare(i, j, color = "black") {
        this.barGraphElements[i].style.backgroundColor = "#F1E243";
        this.barGraphElements[j].style.backgroundColor = "#F1E243";

        await this.wait(delay);

        await this.revertBack(i, j, color);
    }

    async swap(i, j, color = "black") {
        this.barGraphElements[i].style.backgroundColor = "#7CFC00";
        this.barGraphElements[j].style.backgroundColor = "#7CFC00";

        const temp = this.barGraphElements[i].style.height;
        this.barGraphElements[i].style.height = this.barGraphElements[j].style.height;
        this.barGraphElements[j].style.height = temp;

        await this.wait(delay);

        await this.revertBack(i, j, color);
    }

    async revertBack(i, j, color = "black") {
        this.barGraphElements[i].style.backgroundColor = color;
        this.barGraphElements[j].style.backgroundColor = color;

        await this.wait(delay);
    }

    async revertAllBack() {
        for (const barGraphElement of this.barGraphElements) {
            barGraphElement.style.backgroundColor = "black";
        }

        await this.wait(delay);
    }

    async sorted(i) {
        this.barGraphElements[i].style.backgroundColor = "#398AF4";

        await this.wait(delay);
    }

    finishSort() {
        for (const barGraphElement of this.barGraphElements) {
            barGraphElement.style.backgroundColor = "#398AF4";
        }
    }

    async tentativelySort(idx) {
        this.barGraphElements[idx].style.backgroundColor = "#E2EDF9";

        await this.wait(delay);       
    }

    tentativelySortAtRange(startIdx, endIdx) {
        for (let i = startIdx; i < endIdx; i++) {
            this.barGraphElements[i].style.backgroundColor = "#E2EDF9";
        }
    }

    async merge(idx) {
        this.barGraphElements[idx].style.backgroundColor = "#842BFD";

        await this.wait(delay);
    }
    
    async replace(idx, color = "black") {
        this.barGraphElements[idx].style.backgroundColor = "#F365E2";

        await this.wait(delay);

        await this.revertBack(idx, idx, color);

        await this.wait(delay);
    }

    async showPivot(idx) {
        this.barGraphElements[idx].style.backgroundColor = "#DC143C";

        await this.wait(delay);
    }

    async count(idx) {
        this.barGraphElements[idx].style.backgroundColor = "#23AC7C";  

        await this.wait(delay);    
    }

    async wait(delay) {
        await new Promise ((resolve) => 
            setTimeout(() => {
                resolve();
            }, delay)
        );       
    }
}

export default SortingAlgorithm;