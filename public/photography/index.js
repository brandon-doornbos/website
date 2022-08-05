window.addEventListener("DOMContentLoaded", main);

async function main() {
    const dir = await fetch("/photo_dir")
        .then((res) => {
            return res.json();
        });

    const imgContainer = document.getElementById("img-container");
    for (const path of dir) {
        const a = document.createElement("a");
        a.href = "/photography/" + path;
        a.target = "_blank";
        const img = document.createElement("img");
        img.src = a.href;
        a.appendChild(img);
        imgContainer.appendChild(a);
    }

    fetch("/visit");
}
