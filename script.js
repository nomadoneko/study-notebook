// Canvasを取得
const canvas = document.getElementById("noteCanvas");

// 追加：文字選択を禁止
document.body.style.userSelect = "none";

// 描画用
const ctx = canvas.getContext("2d");


// 線の太さ
ctx.lineWidth = 3;

// 線の端を丸くする
ctx.lineCap = "round";

// 線のつなぎ目を丸くする
ctx.lineJoin = "round";

// （文字選択・スクロール暴発防止）
document.addEventListener(
  "touchstart",
  (e) => {
    if (e.target === canvas) return;
    e.preventDefault();
  },
  { passive: false },
);

// Canvasサイズ設定
canvas.width = window.innerWidth - 40;
canvas.height = 600;

// 描画中かどうか
let isDrawing = false;

// Pointerを押した
canvas.addEventListener("pointerdown", (event) => {
  // ペン or マウスはOK
  if (event.pointerType !== "pen" && event.pointerType !== "mouse") return;
  isDrawing = true;

  ctx.beginPath();

  ctx.moveTo(event.offsetX, event.offsetY);
});

// Pointerを動かした
canvas.addEventListener("pointermove", (event) => {
  if (!isDrawing) {
    return;
  }

  ctx.lineTo(event.offsetX, event.offsetY);

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
