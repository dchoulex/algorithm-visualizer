const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");

export function closeModal(event) {
    event.preventDefault();
    modal.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
}