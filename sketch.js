let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: true };
let isModelLoaded = false;

function preload() {
  // 在 preload 中載入模型，並加入回呼函式確認
  faceMesh = ml5.faceMesh(options, () => {
    console.log("模型已準備就緒！");
    isModelLoaded = true;
  });
}

function setup() {
  createCanvas(640, 480);
  // 建立視訊擷取
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // 確認 video 載入後再開始偵測
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background(220); // 先畫背景，防止畫面殘留

  // 1. 畫出視訊畫面
  if (video) {
    image(video, 0, 0, width, height);
  }

  // 2. 繪製偵測結果（加上安全檢查，防止 faces 為空時白屏）
  if (faces && faces.length > 0) {
    let face = faces[0];
    noStroke();
    fill(0, 255, 0);
    for (let i = 0; i < face.keypoints.length; i++) {
      let keypoint = face.keypoints[i];
      circle(keypoint.x, keypoint.y, 5);
    }
  }

  // 3. 顯示狀態提示
  if (!isModelLoaded) {
    fill(255);
    rect(0, 0, width, height);
    fill(0);
    textSize(16);
    textAlign(CENTER);
    text("模型載入中，請稍候...", width / 2, height / 2);
  }
}

// 回呼函式：當偵測到結果時更新 faces 變數
function gotFaces(results) {
  faces = results;
}

// 錯誤處理：如果 ml5 載入失敗或有其他錯誤
window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.error("捕捉到錯誤: ", msg, " 於第 " + lineNo + " 行");
  background(255, 200, 200); // 發生錯誤時背景變淡紅色
  return false;
};