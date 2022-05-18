const errorMessage = document.getElementById("error-message");
const chooseAlgorithmButtonText = document.getElementById("choose-algorithm-btn-text");

export function changeAlgorithm() {
    if (errorMessage.classList.contains("show")) {
        errorMessage.classList.remove("show");
        errorMessage.classList.remove("hidden");
    }

    const algorithmChose = this.textContent;
    chooseAlgorithmButtonText.innerText = algorithmChose;
}