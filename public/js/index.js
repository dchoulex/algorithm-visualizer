const closeModalButton = document.querySelector(".close-modal");
const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");
const chooseAlgorithmButton = document.getElementById("choose-algorithm-btn");
const algorithmSelectorButtons = document.querySelectorAll(".dropdown-item");
const dataRangeSlider = document.getElementById("data-range-slider");
const speedButtons = document.querySelectorAll(".speed-btn");
const sortButton = document.getElementById("sort-btn");
const restartButton = document.getElementById("restart-btn");
const errorMessage = document.getElementById("error-message");
const errorMessageCloseButton = document.getElementById("error-message-close-btn");

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

    getBarHeightFromElement(i, array = this.barGraphElements) {
        return parseInt(array[i].style.height)
    }

    getArrayOfHeightsFromElements() {
        const arrayOfHeights = [];

        for (const barGraphElement of this.barGraphElements) {
            const height = parseInt(barGraphElement.style.height);
            arrayOfHeights.push(height);
        }

        return arrayOfHeights;
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

    revertBack(i, j, color = "black") {
        this.barGraphElements[i].style.backgroundColor = color;
        this.barGraphElements[j].style.backgroundColor = color;
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

    tentativelySort(idx) {
        this.barGraphElements[idx].style.backgroundColor = "#E2EDF9";
    }

    tentativelySortAtRange(startIdx, endIdx) {
        for (let i = startIdx; i < endIdx; i++) {
            this.barGraphElements[i].style.backgroundColor = "#E2EDF9";
        }
    }

    showPivot(idx) {
        this.barGraphElements[idx].style.backgroundColor = "#DC143C";
    }

    count(idx) {
        this.barGraphElements[idx].style.backgroundColor = "#23AC7C";       
    }
    
    merge(idx) {
        this.barGraphElements[idx].style.backgroundColor = "#842BFD";
    }
    
    replace(idx) {
        this.barGraphElements[idx].style.backgroundColor = "#F365E2";
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
                
                await this.wait(delay);
                
                this.revertBack(j, j - 1, "#E2EDF9");

                await this.wait(delay);

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

        this.showHeap();

        await this.heapWait();
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

    showHeap() {
        for (const barGraphElement of this.barGraphElements) {
            barGraphElement.style.backgroundColor = "#FF7F50";
        }
    }
}

class RadixSort extends SortingAlgorithm {
    constructor(barGraph, delay = MEDIUM_SPEED_DELAY) {
        super(delay);
        this.barGraphElements = barGraph.barGraphElements;
        this.barHeights = barGraph.barHeights;
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

            this.count(i);

            await this.wait(delay);

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
            
            this.replace(i);

            await this.wait(delay);

            this.revertBack(i, i);

            await this.wait(delay);
        }
    }
}

class QuickSort extends SortingAlgorithm {
    constructor(barGraph, delay = MEDIUM_SPEED_DELAY) {
        super(delay);
        this.barHeights = barGraph.barHeights;
        this.barGraphElements = barGraph.barGraphElements;
    }

    async sort() {
        const sortedHeights = this.barHeights.sort((a, b) => a - b);

        await this.quickSortHelper(0, this.barGraphElements.length - 1, this.barGraphElements, sortedHeights);

        await this.wait(delay);

        return this.barGraphElements;
    }

    async quickSortHelper(startIdx, endIdx, barGraphElements, sortedHeights) {
        if (startIdx >= endIdx) return;

        const pivotIdx = startIdx;
        let leftIdx = pivotIdx + 1;
        let rightIdx = endIdx;

        this.showPivot(pivotIdx);

        await this.wait(delay);

        while (leftIdx <= rightIdx) {
            const leftIdxBarHeight = this.getBarHeightFromElement(leftIdx);
            const rightIdxBarHeight = this.getBarHeightFromElement(rightIdx);
            const pivotIdxBarHeight = this.getBarHeightFromElement(pivotIdx);

            this.compare(leftIdx, rightIdx);

            await this.wait(delay);

            if (startIdx === endIdx) this.sorted(startIdx);

            if (leftIdxBarHeight > pivotIdxBarHeight && rightIdxBarHeight < pivotIdxBarHeight) {
                this.swap(leftIdx, rightIdx, barGraphElements);

                await this.wait(delay);
            }

            this.revertBack(leftIdx, rightIdx);

            await this.wait(delay);

            if (leftIdxBarHeight <= pivotIdxBarHeight) leftIdx++;
            if (rightIdxBarHeight >= pivotIdxBarHeight) rightIdx--;
        }        
        this.swap(pivotIdx, rightIdx, barGraphElements);
        
        await this.wait(delay);

        this.revertBack(pivotIdx, rightIdx);

        await this.wait(delay);

        this.sorted(rightIdx);

        await this.wait(delay);

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

class MergeSort extends SortingAlgorithm {
    constructor(barGraph, delay = MEDIUM_SPEED_DELAY) {
        super(delay);
        this.barHeights = barGraph.barHeights;
        this.barGraphElements = barGraph.barGraphElements;
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
            this.merge(i);

            await this.wait(delay);
        }

        for (let i = middleIdx; i < endIdx + 1; i++) {
            this.merge(i);

            await this.wait(delay);
        }

        while (leftIdx <= middleIdx && rightIdx <= endIdx) {
            const auxiliaryBarGraphLeftIdxHeight = this.getBarHeightFromElement(leftIdx, auxiliaryBarGraphElements);
            const auxiliaryBarGraphRightIdxHeight = this.getBarHeightFromElement(rightIdx, auxiliaryBarGraphElements);

            this.compare(leftIdx, rightIdx);

            await this.wait(delay);

            this.revertBack(leftIdx, rightIdx, "#842BFD");

            await this.wait(delay);

            if (auxiliaryBarGraphLeftIdxHeight <= auxiliaryBarGraphRightIdxHeight) {
                mainBarGraphElements[arrayIdx].style.height = auxiliaryBarGraphElements[leftIdx].style.height;
                
                this.replace(arrayIdx);
                
                await this.wait(delay);

                this.revertBack(arrayIdx, arrayIdx, "#842BFD");

                await this.wait(delay);

                leftIdx++;
                
            } else {
                mainBarGraphElements[arrayIdx].style.height = auxiliaryBarGraphElements[rightIdx].style.height;

                this.replace(arrayIdx);
                
                await this.wait(delay);

                this.revertBack(arrayIdx, arrayIdx, "#842BFD");

                await this.wait(delay);

                rightIdx++;
            }

            arrayIdx++;
        }

        while (leftIdx <= middleIdx) {
            mainBarGraphElements[arrayIdx].style.height = auxiliaryBarGraphElements[leftIdx].style.height;

            this.replace(arrayIdx);
                
            await this.wait(delay);

            this.revertBack(arrayIdx, arrayIdx, "#842BFD");

            await this.wait(delay);

            leftIdx++;
            arrayIdx++;
        }

        for (let i = startIdx; i < middleIdx + 1; i++) {
            this.tentativelySort(i);

            await this.wait(delay);
        }

        while (rightIdx <= endIdx) {
            mainBarGraphElements[arrayIdx].style.height = auxiliaryBarGraphElements[rightIdx].style.height;

            this.replace(arrayIdx);
                
            await this.wait(delay);

            this.revertBack(arrayIdx, arrayIdx, "#842BFD");

            await this.wait(delay);

            rightIdx++;
            arrayIdx++;
        }

        for (let i = middleIdx; i < endIdx + 1; i++) {
            this.tentativelySort(i);

            await this.wait(delay);
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

if (algorithmSelectorButtons) {
    algorithmSelectorButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (errorMessage.classList.contains("show")) errorMessage.classList.toggle("show");
            const algorithmChose = button.textContent;
            chooseAlgorithmButtonText.innerText = algorithmChose;
        })
    })
}

if (sortButton) {
    sortButton.addEventListener("click", () => {
        const algorithmChose = chooseAlgorithmButtonText.innerText;

        switch (algorithmChose) {
            case "Choose algorithm":
                if (errorMessage.classList.contains("show")) break;

                errorMessage.classList.toggle("show");

                break;

            case "Bubble sort":
                const bubbleSort = new BubbleSort(barGraph.barGraphElements, delay);

                bubbleSort.sort();

                break;
            
            case "Insertion sort":
                const insertionSort = new InsertionSort(barGraph.barGraphElements, delay);

                insertionSort.sort();

                break;

            case "Selection sort":
                const selectionSort = new SelectionSort(barGraph.barGraphElements, delay);

                selectionSort.sort();

                break;

            case "Heap sort":
                const heapSort = new HeapSort(barGraph.barGraphElements, delay);

                heapSort.sort();

                break;

            case "Radix sort":
                const radixSort = new RadixSort(barGraph, delay);

                radixSort.sort();

                break;

            case "Quick sort":
                const quickSort = new QuickSort(barGraph, delay);

                quickSort.sort();

                break;

            case "Merge sort":
                const mergeSort = new MergeSort(barGraph, delay);

                mergeSort.sort();

                break;
        }

        if (algorithmChose === "Choose algorithm") return;

        chooseAlgorithmButton.disabled = true;
        chooseAlgorithmButtonText.disabled = true;
        dataRangeSlider.disabled = true;

        sortButton.classList.toggle("hidden");
        restartButton.classList.toggle("hidden");
    })
};

if (restartButton) {
    restartButton.addEventListener("click", () => {
        location.reload();
    })
}

if (errorMessageCloseButton) {
    errorMessageCloseButton.addEventListener("click", () => {
        errorMessage.classList.toggle("show");
    })
}