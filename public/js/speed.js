import { SLOW_SPEED_DELAY, MEDIUM_SPEED_DELAY, FAST_SPEED_DELAY } from "./config.js";

const speedButtons = document.querySelectorAll(".speed-btn");

let delay = MEDIUM_SPEED_DELAY;

function changeSpeed() {
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

    return delay;
};

export { delay , changeSpeed };