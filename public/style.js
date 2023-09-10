const magicButton = document.getElementById("magicButton");
const body = document.body;

magicButton.addEventListener("mouseenter", () => {
    body.style.backgroundColor = generateRandomColor();
});

function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
