let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  // 載入 ml5 faceMesh 模型
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 修正手機支援：強制使用前鏡頭並防止 iOS 自動跳轉全螢幕播放
  let constraints = {
    video: {
      facingMode: "user"
    },
    audio: false
  };
  video = createCapture(constraints);
  video.size(640, 480);
  video.elt.setAttribute('playsinline', ''); // 關鍵：防止 iOS 播放影片時自動全螢幕
  video.hide();
  
  // 開始辨識臉部偵測
  faceMesh.detectStart(video, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  // 背景顏色為 e7c6ff
  background('#e7c6ff');

  // 在背景空白區域顯示文字 (放在 push 之前，文字才不會被鏡像翻轉)
  fill(0); // 文字顏色設為黑色
  noStroke(); // 文字不描邊
  textSize(32); // 設定文字大小
  text("413737122林紘祥", 20, 50);
  
  // 影像寬高為全螢幕寬高的 50%
  let dw = width * 0.5;  let dh = height * 0.5;
  
  push();
  // 將原點移至畫布中心
  translate(width / 2, height / 2);
  // 影像左右顛倒 (鏡像)
  scale(-1, 1);
  
  // 在中間顯示影像 (位移 -dw/2, -dh/2 以置中)
  image(video, -dw / 2, -dh / 2, dw, dh);
  
  // 確保影片寬度大於 0 (已加載) 且偵測到臉部
  if (faces.length > 0 && video.width > 0) {
    let face = faces[0];

    // 臉部最外層輪廓點位 (用於遮罩和描邊)
    // 這些點位通常構成臉部的外圍橢圓形狀
    let faceOval = [
      10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377,
      152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10
...
}

/**
 * 利用 line 指令串接編號點位的輔助函式
 */
function drawPath(face, indices, dw, dh, closed) {
  for (let i = 0; i < indices.length - 1; i++) {
    let p1 = face.keypoints[indices[i]];
    let p2 = face.keypoints[indices[i + 1]];
    if (p1 && p2) {
      let x1 = map(p1.x, 0, video.width, -dw / 2, dw / 2);
      let y1 = map(p1.y, 0, video.height, -dh / 2, dh / 2);
      let x2 = map(p2.x, 0, video.width, -dw / 2, dw / 2);
      let y2 = map(p2.y, 0, video.height, -dh / 2, dh / 2);
      line(x1, y1, x2, y2);
    }
  }
  if (closed && indices.length > 0) {
    let p1 = face.keypoints[indices[indices.length - 1]];
    let p2 = face.keypoints[indices[0]];
    if (p1 && p2) {
      let x1 = map(p1.x, 0, video.width, -dw / 2, dw / 2);
      let y1 = map(p1.y, 0, video.height, -dh / 2, dh / 2);
      let x2 = map(p2.x, 0, video.width, -dw / 2, dw / 2);
      let y2 = map(p2.y, 0, video.height, -dh / 2, dh / 2);
      line(x1, y1, x2, y2);
    }
  }
}

/**
 * 利用 beginShape/vertex/endShape 繪製實心形狀的輔助函式 (用於遮罩)
 */
function drawFilledShape(face, indices, dw, dh) {
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    let p = face.keypoints[indices[i]];
    if (p) {
      let x = map(p.x, 0, video.width, -dw / 2, dw / 2);
      let y = map(p.y, 0, video.height, -dh / 2, dh / 2);