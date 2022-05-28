const errorMessage = document.getElementById("error-message");
const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");
const isSortingAlgorithm = document.getElementById("sorting-algorithm-visualizer-container");
const sortingColorCodeBar = document.getElementById("sorting-color-code-bar");

let selectedAlgorithm;

export function changeAlgorithm() {
    if (errorMessage.classList.contains("show")) {
        errorMessage.classList.remove("show");
        errorMessage.classList.remove("hidden");
    }

    selectedAlgorithm = this.textContent;
    chooseAlgorithmButtonText.innerText = selectedAlgorithm;

    if (isSortingAlgorithm) showColorCodeBar();
}

function showColorCodeBar() {
    if (sortingColorCodeBar.classList.contains("hidden")) sortingColorCodeBar.classList.remove("hidden");
    
    let colorCodes;

    switch (selectedAlgorithm) {
        case "Bubble sort":
            colorCodes = ["compare", "swap", "sorted"];

            break;
        
        case "Insertion sort":
            colorCodes = ["compare", "swap", "tentatively-sort", "sorted"];

            break;

        case "Selection sort":
            colorCodes = ["compare", "swap", "sorted"];

            break;

        case "Heap sort":
            colorCodes = ["compare", "swap", "sorted", "heap", "sorted"];

            break;

        case "Radix sort":
            colorCodes = ["count", "replace", "sorted"];

            break;

        case "Quick sort":
            colorCodes = ["compare", "swap", "pivot", "sorted"];

            break;

        case "Merge sort":
            colorCodes = ["compare", "merge", "replace", "tentatively-sort", "sorted"];

            break;
    }

    appendColorCodes(colorCodes);
}

function appendColorCodes(colorCodes) {
    sortingColorCodeBar.innerHTML = "";

    for (const colorCode of colorCodes) {
        appendColorCodeMarkup(colorCode);
    }
}

function appendColorCodeMarkup(colorCode) {
    const colorLabel = colorCode.split("-").join(" ");

    const markup = `
    <div class="color-code-group">
        <div class="color-code ${colorCode}-color-code"></div>
        <p class="color-label">${colorLabel}</p>
    </div> 
    `;

    sortingColorCodeBar.insertAdjacentHTML("beforeend", markup);
}