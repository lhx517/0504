let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  // 注意：ml5 v1 使用 faceMesh (M 大寫)
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(640, 480);
  // 建立視訊擷取
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // 開始偵測人臉
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  // 1. 畫出視訊畫面
  image(video, 0, 0, width, height);

  // 2. 繪製偵測結果（加上安全檢查，防止 faces 為空時白屏）
  if (faces && faces.length > 0) {
    let face = faces[0];
    
    // 繪製關鍵點範例
    noStroke();
    fill(0, 255, 0);
    for (let i = 0; i < face.keypoints.length; i++) {
      let keypoint = face.keypoints[i];
      circle(keypoint.x, keypoint.y, 5);
    }
  } else {
    // 如果沒偵測到人臉，可以在畫面上顯示提示，避免看起來像當機
    fill(255, 0, 0);
    textSize(16);
    textAlign(CENTER);
    text("正在等待人臉偵測...", width / 2, height - 20);
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