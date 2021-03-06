import { MIN_NUMBER_OF_BARS, MAX_NUMBER_OF_BARS} from "../../config.js";
import { barGraph } from "../components/barGraph.js";

const dataRangeSlider = document.getElementById("data-range-slider");

if (dataRangeSlider) {
    dataRangeSlider.setAttribute("min", MIN_NUMBER_OF_BARS);
    dataRangeSlider.setAttribute("max", MAX_NUMBER_OF_BARS);
}

export function changeDataRange(event) {
    event.preventDefault();

    const numberOfData = Number(dataRangeSlider.value);

    barGraph.update(numberOfData);
}
