// Import bar graph 
import { barGraph } from "../components/barGraph.js";

// Import sorting algorithms 
import BubbleSort from "../bubbleSort.js";
import InsertionSort from "../insertionSort.js";
import SelectionSort from "../selectionSort.js";
import HeapSort from "../heapSort.js";
import RadixSort from "../radixSort.js";
import QuickSort from "../quickSort.js";
import MergeSort from "../mergeSort.js";

// DOM elements 
const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");
const chooseAlgorithmButton = document.getElementById("choose-algorithm-btn");
const dataRangeSlider = document.getElementById("data-range-slider");
const sortButton = document.getElementById("sort-btn");
const restartBarGraphButton = document.getElementById("restart-bar-graph-btn");
const errorMessage = document.getElementById("error-message");

export function sort() {
    const selectedAlgorithm = chooseAlgorithmButtonText.innerText;

    switch (selectedAlgorithm) {
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

    if (selectedAlgorithm === "Choose algorithm") return;

    disableButtons();
}

function disableButtons() {
    chooseAlgorithmButton.disabled = true;
    chooseAlgorithmButtonText.disabled = true;
    dataRangeSlider.disabled = true;

    sortButton.classList.toggle("hidden");
    restartBarGraphButton.classList.toggle("hidden");
}