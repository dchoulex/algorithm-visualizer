const closeModalButton = document.querySelector(".close-modal");
const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");
const dropdownItemButtons = document.querySelectorAll(".dropdown-item");
const dataRangeSlider = document.getElementById("data-range-slider");
const speedButtons = document.querySelectorAll(".speed-btn");
const sortButton = document.getElementById("sort-btn");

// close modal 
function closeModal(event) {
    const modal = document.getElementById("modal");
    const overlay = document.getElementById("overlay");

    event.preventDefault();
    modal.style.display = "none";
    overlay.style.display = "none";
}

// speed 
function changeSpeed() {
    const speedButtons = document.querySelectorAll(".speed-btn");
    const speedChose = this.textContent;
    
    speedButtons.forEach(speedButton => {
        speedButton.style.backgroundColor = "#fff";
        speedButton.style.color = "#000";
    });

    this.style.backgroundColor = "#525252"
    this.style.color = "#fff";

    if (speedChose === "Slow") {
        delay = SLOW_SPEED_DELAY;
    } else if (speedChose === "Medium") {
        delay = MEDIUM_SPEED_DELAY;
    } else {
        delay = FAST_SPEED_DELAY;
    }
};

// data range 
const MIN_NUMBER_OF_BARS = 3;
const MAX_NUMBER_OF_BARS = 120;
const BAR_MIN_HEIGHT = 20;
const BAR_MAX_HEIGHT = 500;

const FAST_SPEED_DELAY = 50;
const MEDIUM_SPEED_DELAY = 100;
const SLOW_SPEED_DELAY = 200;

dataRangeSlider.setAttribute("min", MIN_NUMBER_OF_BARS);
dataRangeSlider.setAttribute("max", MAX_NUMBER_OF_BARS);

class BarGraph {
    _parentElement = document.getElementById("bar-graph-container");

    constructor() {
        this.numberOfData = 10;
        this.barHeights = this._getBarHeights(this.numberOfData, BAR_MIN_HEIGHT, BAR_MAX_HEIGHT);
        this.createGraph();
        this.barGraphElements = this._getBarGraphElements();
    }
    
    _getBarHeights(numberOfData, minHeight, maxHeight) {
        const barHeights = [];
        
        for (let i = 0; i < numberOfData; i++) {
            const randomHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
            barHeights.push(randomHeight);
        }
        
        return barHeights;
    }

    _getBarGraphElements() {
        return document.querySelectorAll(".bar-graph");
    }
    
    render(barHeight) {
        const markup = `<div class="bar-graph" style="height:${barHeight}px"></div>`;
        
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    createGraph() {
        for (const barHeight of this.barHeights) {
            this.render(barHeight);
        }          
    }

    update() {
        this._parentElement.innerHTML = "";
        
        this.numberOfData = Number(dataRangeSlider.value);
        
        this.barHeights = this._getBarHeights(this.numberOfData, BAR_MIN_HEIGHT, BAR_MAX_HEIGHT);

        this.createGraph();
        
        this.barGraphElements = this._getBarGraphElements();
    };

}

// sorting algorithm 
class SortingAlgorithm {
    constructor(barGraphElements, delay = MEDIUM_SPEED_DELAY) {
        this.barGraphElements = barGraphElements; 
        this.delay = delay;
    }

    getBarHeightFromElement(i) {
        return parseInt(this.barGraphElements[i].style.height)
    }

    compare(i, j) {
        this.barGraphElements[i].style.backgroundColor = "#F1E243";
        this.barGraphElements[j].style.backgroundColor = "#F1E243";
    }

    swap(i, j) {
        this.barGraphElements[i].style.backgroundColor = "#7CFC00";
        this.barGraphElements[j].style.backgroundColor = "#7CFC00";

        const temp = this.barGraphElements[i].style.height;
        this.barGraphElements[i].style.height = this.barGraphElements[j].style.height;
        this.barGraphElements[j].style.height = temp;
    }

    revertBack(i, j) {
        this.barGraphElements[i].style.backgroundColor = "black";
        this.barGraphElements[j].style.backgroundColor = "black";
    }

    revertAllBack() {
        for (const barGraphElement of this.barGraphElements) {
            barGraphElement.style.backgroundColor = "black";
        }
    }

    sorted(i) {
        this.barGraphElements[i].style.backgroundColor = "#398AF4";
    }

    finishSort() {
        for (const barGraphElement of this.barGraphElements) {
            barGraphElement.style.backgroundColor = "#398AF4";
        }
    }

    tentativelySort(j) {
        for (let i = 0; i < j; i++) {
            this.barGraphElements[i].style.backgroundColor = "#E2EDF9";
        }
    }

    async wait(delay) {
        await new Promise ((resolve) => 
            setTimeout(() => {
                resolve();
            }, delay)
        );       
    }
}

class BubbleSort extends SortingAlgorithm{
    constructor(barGraphElements, delay = MEDIUM_SPEED_DELAY) {
        super(barGraphElements, delay)
    }

    async sort() {
        let isSorted = false;
        let counter = 0;

        while (!isSorted) {
            isSorted = true;

            for (let i = 0; i < this.barGraphElements.length - 1 - counter; i++) {     
                this.compare(i, i + 1);

                await this.wait(delay);

                const firstBarHeight = this.getBarHeightFromElement(i);
                const secondBarHeight = this.getBarHeightFromElement(i + 1);

                if (firstBarHeight > secondBarHeight) {
                    this.swap(i, i + 1);
                    isSorted = false;
                }

                await this.wait(delay);

                this.revertBack(i, i + 1);
            }

            this.sorted(this.barGraphElements.length - counter - 1);

            counter++;
        }

        this.finishSort();

        return this.barGraphElements;
    }
}

class InsertionSort extends SortingAlgorithm {
    constructor(barGraphElements, delay = MEDIUM_SPEED_DELAY) {
        super(barGraphElements, delay)
    }
    
    async sort() {
        for (let i = 1; i < this.barGraphElements.length; i++) {
            let j = i;

            this.compare(j, j - 1);

            await this.wait(delay);
            
            while (j > 0 && this.getBarHeightFromElement(j) < this.getBarHeightFromElement(j - 1)) {
                this.swap(j, j - 1);
                
                j--;
            }

            await this.wait(delay);

            this.tentativelySort(i);
        }

        this.finishSort();

        return this.barGraphElements;
    }
}

class SelectionSort extends SortingAlgorithm {
    constructor(barGraphElements, delay = MEDIUM_SPEED_DELAY) {
        super(barGraphElements, delay)
    }

    async sort() {
        let startIndex = 0;

        while (startIndex < this.barGraphElements.length - 1) {
            let smallestIndex = startIndex;

            for (let i = startIndex + 1; i < this.barGraphElements.length; i++) {
                this.compare(smallestIndex, i);

                const firstBarHeight = this.getBarHeightFromElement(smallestIndex);
                const secondBarHeight = this.getBarHeightFromElement(i);

                await this.wait(delay);

                this.revertBack(smallestIndex, i);

                if (firstBarHeight > secondBarHeight) smallestIndex = i;
            }

            await this.wait(delay);

            this.swap(startIndex, smallestIndex);
            
            await this.wait(delay);

            this.revertBack(startIndex, smallestIndex);

            await this.wait(delay);

            this.sorted(startIndex);

            startIndex++;
        }

        this.finishSort();

        return this.barGraphElements;
    }
}

class HeapSort extends SortingAlgorithm {
    constructor(barGraphElements, delay = MEDIUM_SPEED_DELAY) {
        super(barGraphElements, delay)
    }

    async sort() {
        await this.buildMaxHeap(this.barGraphElements);

        await this.heapWait();

        this.revertAllBack();

        for (let endIdx = this.barGraphElements.length - 1; endIdx > 0; endIdx--) {
            this.swap(0, endIdx, this.barGraphElements);

            await this.wait(delay);

            this.revertBack(0, 0);

            await this.wait(delay);
            
            this.sorted(endIdx);

            await this.siftDown(0, endIdx - 1, this.barGraphElements);
        }

        this.finishSort();

        return this.barGraphElements;
    }

    async buildMaxHeap(barGraphElements) {
        let firstParentIdx = Math.floor((barGraphElements.length - 2) / 2);

        for (let currentIdx = firstParentIdx; currentIdx >= 0; currentIdx--) {
            await this.siftDown(currentIdx, barGraphElements.length - 1, barGraphElements);

            await this.wait(delay);

            this.revertBack(currentIdx, barGraphElements.length - 1);
        }

        for (const barGraphElement of barGraphElements) {
            barGraphElement.style.backgroundColor = "#7B20F7";
        }
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

            this.compare(currentIdx, idxToSwap);

            await this.wait(delay);

            this.revertBack(currentIdx, idxToSwap);

            await this.wait(delay);

            if (parseInt(heap[idxToSwap].style.height) > parseInt(heap[currentIdx].style.height)) {
                this.swap(currentIdx, idxToSwap, heap);

                await this.wait(delay);

                this.revertBack(currentIdx, idxToSwap);

                currentIdx = idxToSwap;

                childOneIdx = currentIdx * 2 + 1;
            } else {
                return;
            }
        }
    }

    async heapWait() {
        await new Promise ((resolve) =>
            setTimeout(() => {
                resolve();
            }, 500)
        )
    }
}

if (closeModalButton) {
    closeModalButton.addEventListener("click", closeModal)
};

let delay = MEDIUM_SPEED_DELAY;

if (speedButtons){
    speedButtons.forEach(button => {
        button.addEventListener("click", changeSpeed);
    })
};

const barGraph = new BarGraph();

if (dataRangeSlider) {
    dataRangeSlider.addEventListener("change", event => {
        event.preventDefault();
        barGraph.update();
    });
};

if (dropdownItemButtons) {
    dropdownItemButtons.forEach(button => {
        button.addEventListener("click", () => {
            const algorithmChose = button.textContent;
            chooseAlgorithmButtonText.innerText = algorithmChose;
        })
    })
}

if (sortButton) {
    sortButton.addEventListener("click", () => {
        // const bubbleSort = new BubbleSort(barGraph.barGraphElements, delay);
        // bubbleSort.sort();
        // const insertionSort = new InsertionSort(barGraph.barGraphElements, delay);
        // insertionSort.sort();
        // const selectionSort = new SelectionSort(barGraph.barGraphElements, delay);
        // selectionSort.sort();
        const heapSort = new HeapSort(barGraph.barGraphElements, delay);
        heapSort.sort();
    })
}