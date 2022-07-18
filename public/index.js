window.addEventListener("DOMContentLoaded", main);

function main() {
    addButtonListener("landing-button", "index");
}

function addButtonListener(button, element) {
    document.getElementById(button).addEventListener("click", () => {
        window.scrollTo({
            top: document.getElementById(element).offsetTop,
            behavior: 'smooth'
        });
    });
}
