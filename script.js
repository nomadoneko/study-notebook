// ======================================================
// キャンバス取得
// ======================================================

const canvases = document.querySelectorAll(".pageCanvas");

const contexts = [];

canvases.forEach((canvas) => {

  contexts.push(
    canvas.getContext("2d")
  );

});


// ======================================================
// アプリ状態
// ======================================================

let drawing = false;


// ページごとの線データ
let pages = [];

canvases.forEach(() => {

  pages.push([]);

});


// 現在描画中の線
let currentStroke = null;


// 次の線ID
let nextStrokeId = 1;


// ペン設定
let currentPen = {

  color: "black",

  width: 3,

};



// ======================================================
// Canvasサイズ調整
// ======================================================

function resizeCanvas() {


  canvases.forEach((canvas, index) => {


    const rect = canvas.getBoundingClientRect();

    const ctx = contexts[index];


    canvas.width = rect.width;

    canvas.height = rect.height * 3;

    ctx.lineWidth = currentPen.width;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    ctx.strokeStyle = currentPen.color;


  });


  redrawCanvas();

}



// ======================================================
// 描画復元
// ======================================================

function redrawCanvas() {


  pages.forEach((pageStrokes, pageIndex) => {


    const canvas = canvases[pageIndex];

    const ctx = contexts[pageIndex];


    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );



    pageStrokes.forEach((stroke) => {


      if (stroke.points.length === 0) {
        return;
      }


      ctx.beginPath();


      ctx.strokeStyle = stroke.color;

      ctx.lineWidth = stroke.width;



      ctx.moveTo(
        stroke.points[0].x,
        stroke.points[0].y
      );



      for (
        let i = 1;
        i < stroke.points.length;
        i++
      ) {


        ctx.lineTo(
          stroke.points[i].x,
          stroke.points[i].y
        );


      }


      ctx.stroke();


    });


  });


}



// ======================================================
// 座標取得
// ======================================================

function getPoint(e, pageIndex) {


  const canvas = canvases[pageIndex];


  const rect = canvas.getBoundingClientRect();



  return {


    x:
      (e.clientX - rect.left)
      *
      (canvas.width / rect.width),



    y:
      (e.clientY - rect.top)
      *
      (canvas.height / rect.height)


  };


}



// ======================================================
// 描画開始
// ======================================================

function startDrawing(e, pageIndex) {


  if (e.pointerType !== "pen") {

    return;

  }


  e.preventDefault();



  const ctx = contexts[pageIndex];



  drawing = true;



  const p = getPoint(e, pageIndex);



  currentStroke = {


    id: nextStrokeId++,


    pageIndex: pageIndex,


    color: currentPen.color,


    width: currentPen.width,


    points: [

      {
        x: p.x,
        y: p.y
      }

    ]


  };



  ctx.beginPath();

  ctx.moveTo(
    p.x,
    p.y
  );


}



// ======================================================
// 描画中
// ======================================================

function draw(e, pageIndex) {


  if (!drawing) {

    return;

  }


  if (e.pointerType !== "pen") {

    return;

  }


  e.preventDefault();



  const ctx = contexts[pageIndex];



  const p = getPoint(e, pageIndex);



  currentStroke.points.push({

    x: p.x,

    y: p.y

  });



  ctx.lineTo(

    p.x,

    p.y

  );


  ctx.stroke();



}



// ======================================================
// 描画終了
// ======================================================

function endDrawing(e, pageIndex) {


  e.preventDefault();



  drawing = false;



  if (currentStroke) {


    pages[currentStroke.pageIndex].push(
      currentStroke
    );


    currentStroke = null;


  }


}



// ======================================================
// キャンセル
// ======================================================

function cancelDrawing() {


  drawing = false;


  currentStroke = null;


}



// ======================================================
// イベント登録
// ======================================================

canvases.forEach((canvas, index) => {


  canvas.addEventListener(
    "pointerdown",
    (e) => startDrawing(e, index)
  );


  canvas.addEventListener(
    "pointermove",
    (e) => draw(e, index)
  );


  canvas.addEventListener(
    "pointerup",
    (e) => endDrawing(e, index)
  );


  canvas.addEventListener(
    "pointercancel",
    cancelDrawing
  );


  canvas.addEventListener(
    "pointerleave",
    cancelDrawing
  );


  canvas.addEventListener(
    "contextmenu",
    (e) => {

      e.preventDefault();

    }
  );


});



// ======================================================
// タッチスクロール防止
// ======================================================

canvases.forEach((canvas)=>{


  canvas.addEventListener(
    "touchstart",
    (e)=>{

      e.preventDefault();

    },
    {
      passive:false
    }
  );



  canvas.addEventListener(
    "touchmove",
    (e)=>{

      e.preventDefault();

    },
    {
      passive:false
    }
  );


});



// ======================================================
// 初期化
// ======================================================

resizeCanvas();


window.addEventListener(
  "resize",
  resizeCanvas
);