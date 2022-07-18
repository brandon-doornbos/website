window.addEventListener("DOMContentLoaded", main);

function main() {
    addButtonListener("landing-button", "index");
    addButtonListener("index-button-coding", "content-coding");
    addButtonListener("index-button-photography", "content-photography");
    addButtonListener("button-top", "landing");
}

function addButtonListener(button, element) {
    document.getElementById(button).addEventListener("click", () => {
        window.scrollTo({
            top: document.getElementById(element).offsetTop,
            behavior: 'smooth'
        });
    });
}
