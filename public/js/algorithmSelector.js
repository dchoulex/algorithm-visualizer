const errorMessage = document.getElementById("error-message");
const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");

export function changeAlgorithm() {
    if (errorMessage.classList.contains("show")) {
        errorMessage.classList.toggle("show");
        errorMessage.classList.toggle("hidden");
    }

    const algorithmChose = this.textContent;
    chooseAlgorithmButtonText.innerText = algorithmChose;
}