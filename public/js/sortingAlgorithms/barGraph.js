import { BAR_MIN_HEIGHT, BAR_MAX_HEIGHT } from "./../config.js";

class BarGraph {
    _parentElement = document.getElementById("bar-graph-container");

    constructor(BAR_MIN_HEIGHT, BAR_MAX_HEIGHT) {
        this.barMinHeight = BAR_MIN_HEIGHT;
        this.barMaxHeight = BAR_MAX_HEIGHT;
        this.numberOfData = 10;

        this.barHeights = this._getBarHeights(this.numberOfData, this.barMinHeight, this.barMaxHeight);
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

    update(numberOfData) {
        this._parentElement.innerHTML = "";
        
        this.numberOfData = numberOfData;
        
        this.barHeights = this._getBarHeights(this.numberOfData, BAR_MIN_HEIGHT, BAR_MAX_HEIGHT);

        this.createGraph();
        
        this.barGraphElements = this._getBarGraphElements();
    };
}

export default new BarGraph(BAR_MIN_HEIGHT, BAR_MAX_HEIGHT);