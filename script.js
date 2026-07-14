const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// キャンバスサイズ
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();

    // 表示サイズに合わせる
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// 座標取得
function getPoint(e) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
}

let drawing = false;

// 描き始め
canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();

    drawing = true;

    const p = getPoint(e);

    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
});

// 描画
canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;

    e.preventDefault();

    const p = getPoint(e);

    ctx.lineTo(p.x, p.y);
    ctx.stroke();
});

// 描き終わり
canvas.addEventListener("pointerup", (e) => {
    e.preventDefault();
    drawing = false;
});

canvas.addEventListener("pointercancel", () => {
    drawing = false;
});

canvas.addEventListener("pointerleave", () => {
    drawing = false;
});

// コピー・翻訳などのメニューを無効化
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

// 長押しを無効化
canvas.addEventListener(
    "touchstart",
    (e) => {
        e.preventDefault();
    },
    { passive: false }
);

canvas.addEventListener(
    "touchmove",
    (e) => {
        e.preventDefault();
    },
    { passive: false }
);