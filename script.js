
// Canvasを取得
const canvas = document.getElementById("noteCanvas");

// 描画用
const ctx = canvas.getContext("2d");

// Canvasサイズ設定
canvas.width = window.innerWidth - 40;
canvas.height = 600;

// 描画中かどうか
let isDrawing = false;

// Pointerを押した
canvas.addEventListener("pointerdown", (event) => {

    isDrawing = true;

    ctx.beginPath();

    ctx.moveTo(
        event.offsetX,
        event.offsetY
    );

});

// Pointerを動かした
canvas.addEventListener("pointermove", (event) => {

    if (!isDrawing) {
        return;
    }

    ctx.lineTo(
        event.offsetX,
        event.offsetY
    );

    ctx.stroke();

});

// Pointerを離した
canvas.addEventListener("pointerup", () => {

    isDrawing = false;

});

// Canvas外へ出た
canvas.addEventListener("pointerleave", () => {

    isDrawing = false;

});