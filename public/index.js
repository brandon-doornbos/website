window.addEventListener("DOMContentLoaded", main);
window.addEventListener("load", load);
window.addEventListener("resize", resize);

function main() {
    addButtonListener("landing-button", "index");
    addButtonListener("index-button-coding", "content-coding");
    addButtonListener("index-button-photography", "content-photography");
    addButtonListener("logo", "landing");

    for (const carousel of document.getElementsByClassName("carousel")) {
        const items = carousel.getElementsByClassName("carousel-item");
        carousel.style.gridTemplateColumns = `repeat(${items.length}, 100%)`;
        carousel.index = 0;

        carousel.getElementsByClassName("carousel-button-next")[0].addEventListener("click", () => {
            carousel.index += 1;
            if (carousel.index > items.length - 1)
                carousel.index = 0;

            carousel.scrollTo({
                left: carousel.index * carousel.clientWidth,
                behavior: 'smooth'
            });
        });

        carousel.getElementsByClassName("carousel-button-previous")[0].addEventListener("click", () => {
            carousel.index -= 1;
            if (carousel.index < 0)
                carousel.index = items.length - 1;

            carousel.scrollTo({
                left: carousel.index * carousel.clientWidth,
                behavior: 'smooth'
            });
        });
    }

    const sections = document.getElementsByTagName("section");
    const buttonUp = document.getElementById("button-up");
    const buttonDown = document.getElementById("button-down");
    onScroll(sections, buttonUp, buttonDown);
    window.addEventListener("scroll", () => onScroll(sections, buttonUp, buttonDown));

    fetch("/visit");
}

function addButtonListener(button, element) {
    document.getElementById(button).addEventListener("click", () => {
        window.scrollTo({
            top: document.getElementById(element).offsetTop,
            behavior: 'smooth'
        });
    });
}

function onScroll(sections, buttonUp, buttonDown) {
    let top = 0, bottom = sections[sections.length - 1].offsetTop, minDiff = Infinity, maxDiff = Infinity;

    for (const section of sections) {
        let diff = window.scrollY - section.offsetTop;
        if (diff > (window.innerHeight * 0.05) && diff < minDiff) {
            top = section.offsetTop;
            minDiff = diff;
        }

        diff = section.offsetTop - window.scrollY;
        if (diff > (window.innerHeight * 0.05) && diff < maxDiff) {
            bottom = section.offsetTop;
            maxDiff = diff;
        }
    }

    buttonUp.onclick = () => {
        window.scrollTo({
            top,
            behavior: 'smooth'
        });
    };

    buttonDown.onclick = () => {
        window.scrollTo({
            top: bottom,
            behavior: 'smooth'
        });
    };
}

function load() {
    const img = new Image();
    img.onload = () => document.getElementById("landing").style.backgroundImage = "url(\"back-0.webp\"), url(\"back-0_min.webp\")";
    img.src = "back-0.webp";
}

function resize() {
    for (const carousel of document.getElementsByClassName("carousel")) {
        const items = carousel.getElementsByClassName("carousel-item");

        carousel.scrollTo({
            left: carousel.index * items[0].scrollWidth,
            behavior: 'auto'
        });
    }
}
