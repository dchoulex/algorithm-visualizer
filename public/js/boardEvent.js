import { board } from "./pathfindingAlgorithms/board.js";

function changeColor() {
    const id = this.dataset.id;

    const clickedNode = board.getNodeById(id);

    clickedNode.colorCode = 1;

    if (clickedNode.colorCode === 1) this.style.backgroundColor = "black";

    // switch (colorCode) {
    //     case 0:
    //         this.style.backgroundColor = "black";
    //         break;
    // }

}

export { changeColor }