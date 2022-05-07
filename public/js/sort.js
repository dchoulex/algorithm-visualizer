// Import bar graph 
import barGraph from "./sortingAlgorithms/barGraph.js";

// Import sorting algorithms 
import BubbleSort from "./sortingAlgorithms/bubbleSort.js";
import InsertionSort from "./sortingAlgorithms/insertionSort.js";
import SelectionSort from "./sortingAlgorithms/selectionSort.js";
import HeapSort from "./sortingAlgorithms/heapSort.js";
import RadixSort from "./sortingAlgorithms/radixSort.js";
import QuickSort from "./sortingAlgorithms/quickSort.js";
import MergeSort from "./sortingAlgorithms/mergeSort.js";

const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");
const chooseAlgorithmButton = document.getElementById("choose-algorithm-btn");
const dataRangeSlider = document.getElementById("data-range-slider");
const sortButton = document.getElementById("sort-btn");
const restartButton = document.getElementById("restart-btn");
const errorMessage = document.getElementById("error-message");

export function sort() {
    const algorithmChose = chooseAlgorithmButtonText.innerText;

    switch (algorithmChose) {
        case "Choose algorithm":
            if (errorMessage.classList.contains("show")) break;

            errorMessage.classList.toggle("show");

            break;

        case "Bubble sort":
            const bubbleSort = new BubbleSort(barGraph);

            bubbleSort.sort();

            break;
        
        case "Insertion sort":
            const insertionSort = new InsertionSort(barGraph);

            insertionSort.sort();

            break;

        case "Selection sort":
            const selectionSort = new SelectionSort(barGraph);

            selectionSort.sort();

            break;

        case "Heap sort":
            const heapSort = new HeapSort(barGraph);

            heapSort.sort();

            break;

        case "Radix sort":
            const radixSort = new RadixSort(barGraph);

            radixSort.sort();

            break;

        case "Quick sort":
            const quickSort = new QuickSort(barGraph);

            quickSort.sort();

            break;

        case "Merge sort":
            const mergeSort = new MergeSort(barGraph);

            mergeSort.sort();

            break;
    }

    if (algorithmChose === "Choose algorithm") return;

    disableButtons();
}

function disableButtons() {
    chooseAlgorithmButton.disabled = true;
    chooseAlgorithmButtonText.disabled = true;
    dataRangeSlider.disabled = true;

    sortButton.classList.toggle("hidden");
    restartButton.classList.toggle("hidden");
}