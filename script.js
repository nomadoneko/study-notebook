// ======================================================
// キャンバス
// ======================================================

// キャンバス取得
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ======================================================
// アプリ状態（State）
// ======================================================

// 描画中かどうか
let drawing = false;

// 保存されているすべての線
let strokes = [];

// 現在描いている線
let currentStroke = null;

// 次に使用するストロークID
let nextStrokeId = 1;

// 現在のペン設定
let currentPen = {
  color: "black",
  width: 3,
};

// ======================================================
// キャンバス関連
// ======================================================

// キャンバスサイズを画面サイズに合わせる
function resizeCanvas() {

  const rect = canvas.getBoundingClientRect();

  // 表示サイズに合わせる
  canvas.width = rect.width;
  canvas.height = rect.height;

  // ペン設定
  ctx.lineWidth = currentPen.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = currentPen.color;

  // 保存されている線を描き直す
  redrawCanvas();

}

// 保存されている線をすべて描画する
function redrawCanvas() {

  // キャンバスを消去
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 保存されている線を順番に描画
  strokes.forEach((stroke) => {

    if (stroke.points.length === 0) return;

    ctx.beginPath();

    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;

    ctx.moveTo(
      stroke.points[0].x,
      stroke.points[0].y
    );

    for (let i = 1; i < stroke.points.length; i++) {

      ctx.lineTo(
        stroke.points[i].x,
        stroke.points[i].y
      );

    }

    ctx.stroke();

  });

  // ペン設定を元に戻す
  ctx.strokeStyle = currentPen.color;
  ctx.lineWidth = currentPen.width;

}

// ======================================================
// 座標関連
// ======================================================

// PointerEventからキャンバス上の座標を取得
function getPoint(e) {

  const rect = canvas.getBoundingClientRect();

  return {

    x: (e.clientX - rect.left) * (canvas.width / rect.width),

    y: (e.clientY - rect.top) * (canvas.height / rect.height),

  };

}

// ======================================================
// 描画イベント
// ======================================================

// 描き始め
function startDrawing(e) {

  // Apple Pencilのみ描画
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

    color: currentPen.color,

    width: currentPen.width,

    points: [
      {
        x: p.x,
        y: p.y,
      },
    ],

  };

  // 描画開始
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);

}

// 描画中
function draw(e) {

  if (!drawing) return;

  // Apple Pencilのみ描画
  if (e.pointerType !== "pen") {
    return;
  }

  e.preventDefault();

  const p = getPoint(e);

  // 座標を保存
  currentStroke.points.push({
    x: p.x,
    y: p.y,
  });

  // キャンバスへ描画
  ctx.lineTo(p.x, p.y);
  ctx.stroke();

}

// 描画終了
function endDrawing(e) {

  e.preventDefault();

  drawing = false;

  // 線を保存
  if (currentStroke) {

    strokes.push(currentStroke);

    currentStroke = null;

  }

}

// 描画キャンセル
function cancelDrawing() {

  drawing = false;

  // 描画中の線を保存
  if (currentStroke) {

    strokes.push(currentStroke);

    currentStroke = null;

  }

}



// ======================================================
// その他イベント
// ======================================================

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

// ======================================================
// 初期化
// ======================================================

// 初回のキャンバスサイズ設定
resizeCanvas();

// 画面サイズ変更時にキャンバスを再調整
window.addEventListener(
  "resize",
  resizeCanvas
);

// // ======================================================
// // イベント登録
// // ======================================================

canvas.addEventListener("pointerdown", startDrawing);
canvas.addEventListener("pointermove", draw);
canvas.addEventListener("pointerup", endDrawing);
canvas.addEventListener("pointercancel", cancelDrawing);
canvas.addEventListener("pointerleave", cancelDrawing);

// canvas.addEventListener("contextmenu", (e) => {
//   e.preventDefault();
// });

// canvas.addEventListener(
//   "touchstart",
//   (e) => {
//     e.preventDefault();
//   },
//   { passive: false }
// );

// canvas.addEventListener(
//   "touchmove",
//   (e) => {
//     e.preventDefault();
//   },
//   { passive: false }
// );

// // ======================================================
// // 初期化
// // ======================================================

// resizeCanvas();

// window.addEventListener("resize", resizeCanvas);