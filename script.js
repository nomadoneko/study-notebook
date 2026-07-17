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

// すべての線を保存
let strokes = [];

// 今描いている線
let currentStroke = null;

// 線ID
let nextStrokeId = 1;

// 描き始め
canvas.addEventListener("pointerdown", (e) => {

    // Apple Pencil以外は無視
    if (e.pointerType !== "pen") {
        return;
    }

    e.preventDefault();

drawing = true;

const p = getPoint(e);

// 新しい線を作成
currentStroke = {
    id: nextStrokeId++,
    type: "pen",
    color: ctx.strokeStyle,
    width: ctx.lineWidth,
    points: [
        {
            x: p.x,
            y: p.y
        }
    ]
};

ctx.beginPath();
ctx.moveTo(p.x, p.y);
});

// 描画
canvas.addEventListener("pointermove", (e) => {

    if (!drawing) return;

    // Apple Pencil以外は無視
    if (e.pointerType !== "pen") {
        return;
    }

    e.preventDefault();

    const p = getPoint(e);

currentStroke.points.push({
    x: p.x,
    y: p.y
});

ctx.lineTo(p.x, p.y);
ctx.stroke();
});

// 描き終わり
canvas.addEventListener("pointerup", (e) => {
    e.preventDefault();

    drawing = false;

    if (currentStroke) {
        strokes.push(currentStroke);
        currentStroke = null;
    }
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