import { SLOW_SPEED_DELAY, MEDIUM_SPEED_DELAY, FAST_SPEED_DELAY } from "./config.js";

const speedButtons = document.querySelectorAll(".speed-btn");

let delay = MEDIUM_SPEED_DELAY;

function changeSpeed(event) {
    const button = event.target;
    const speedChose = event.target.textContent;
    
    speedButtons.forEach(speedButton => {
        speedButton.style.backgroundColor = "#fff";
        speedButton.style.color = "#000";
    });

    button.style.backgroundColor = "#525252"
    button.style.color = "#fff";

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