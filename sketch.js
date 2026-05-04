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
  
  // 擷取攝影機影像
  video = createCapture(VIDEO);
  video.size(640, 480);
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
  
  // 影像寬高為全螢幕寬高的 50%
  let dw = width * 0.5;
  let dh = height * 0.5;
  
  push();
  // 將原點移至畫布中心
  translate(width / 2, height / 2);
  // 影像左右顛倒 (鏡像)
  scale(-1, 1);
  
  // 在中間顯示影像 (位移 -dw/2, -dh/2 以置中)
  image(video, -dw / 2, -dh / 2, dw, dh);
  
  if (faces.length > 0) {
    let face = faces[0];
    stroke(255, 0, 0); // 線條紅色
    strokeWeight(1);   // 粗細為 1
    noFill();
    
    // 第一組點位：409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291
    let set1 = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
    drawPath(face, set1, dw, dh, true);
    
    // 第二組點位：76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
    let set2 = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
    drawPath(face, set2, dw, dh, true);
    
    // 右眼辨識：247 外圈與 246 內圈
    // 標準 FaceMesh 右眼外圈 (包含 247) 與 內圈 (包含 246) 的完整編號串接
    let rightEyeOuter = [130, 247, 30, 29, 28, 56, 190, 243, 112, 26, 25, 110, 24, 23, 22, 21];
    let rightEyeInner = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7];
    
    drawPath(face, rightEyeOuter, dw, dh, true);
    drawPath(face, rightEyeInner, dw, dh, true);
  }
  pop();
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}