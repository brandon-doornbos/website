window.addEventListener("DOMContentLoaded", main);

function main() {
    document.getElementById("landing_button").addEventListener("click", () => {
        window.scrollTo({
            top: document.getElementById("content").offsetTop,
            behavior: 'smooth'
        });
    });
}
