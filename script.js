const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// キャンバスサイズ
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let drawing = false;

// 描き始め
canvas.addEventListener("pointerdown", (e) => {
    drawing = true;

    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

// 描画
canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});

// 描き終わり
canvas.addEventListener("pointerup", () => {
    drawing = false;
});

canvas.addEventListener("pointerleave", () => {
    drawing = false;
});