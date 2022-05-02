const closeModalButton = document.querySelector(".close-modal");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const speedButtons = document.querySelectorAll(".speed-btn");
const slowSpeedButton = document.getElementById("slow-speed-btn");
const mediumSpeedButton = document.getElementById("medium-speed-btn");
const fastSpeedButton = document.getElementById("fastSpeedButton");

function changeColor(e) {
    speedButtons.forEach(speedButton => {
        speedButton.style.backgroundColor = "#fff";
        speedButton.style.color = "#000";
    });

    this.style.backgroundColor = "#525252"
    this.style.color = "#fff";
};

speedButtons.forEach(button => {
    button.addEventListener("click", changeColor);
})

// closeModalButton.addEventListener("click", e => {
//     e.preventDefault();
//     modal.style.display = "none";
//     overlay.style.display = "none";
// })