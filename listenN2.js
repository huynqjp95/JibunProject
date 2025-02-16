"use strict";
//----lay file nghe tu folder
//arr chứa list folder chua file nghe
const subjectArr = ["247", "2312"];

const subject = document.querySelectorAll(".subject");
let activeSubject = subjectArr[0];

//event btn để chọn đề , 24-7 và 23-12
subject.forEach(function (mov, i) {
  mov.classList.remove("active");
  mov.addEventListener("click", function () {
    activeSubject = subjectArr[i];
    //css cho đề được pick
    for (let i = 0; i < subject.length; i++) {
      subject[i].classList.remove("active");
    }
    mov.classList.add("active");
    // kích hoạt hiển thị audio và script
    pickSubject();
  });
});
// đặt tất cả vào 1 hàm pickSubject() để kích hoạt audio và script
function pickSubject() {
  const audioLink = `./audio/n2/${activeSubject}/`;
  const audioArr = [
    `2${activeSubject}11.MP3`,
    `2${activeSubject}12.MP3`,
    `2${activeSubject}13.MP3`,
    `2${activeSubject}14.MP3`,
    `2${activeSubject}15.MP3`,
    `2${activeSubject}21.MP3`,
    `2${activeSubject}22.MP3`,
    `2${activeSubject}23.MP3`,
    `2${activeSubject}24.MP3`,
    `2${activeSubject}25.MP3`,
    `2${activeSubject}26.MP3`,
    `2${activeSubject}31.MP3`,
    `2${activeSubject}32.MP3`,
    `2${activeSubject}33.MP3`,
    `2${activeSubject}34.MP3`,
    `2${activeSubject}35.MP3`,
    `2${activeSubject}51.MP3`,
    `2${activeSubject}52.MP3`,
  ];
  const scriptArr = [
    `2${activeSubject}11.txt`,
    `2${activeSubject}12.txt`,
    `2${activeSubject}13.txt`,
    `2${activeSubject}14.txt`,
    `2${activeSubject}15.txt`,
    `2${activeSubject}21.txt`,
    `2${activeSubject}22.txt`,
    `2${activeSubject}23.txt`,
    `2${activeSubject}24.txt`,
    `2${activeSubject}25.txt`,
    `2${activeSubject}26.txt`,
    `2${activeSubject}31.txt`,
    `2${activeSubject}32.txt`,
    `2${activeSubject}33.txt`,
    `2${activeSubject}34.txt`,
    `2${activeSubject}35.txt`,
    `2${activeSubject}51.txt`,
    `2${activeSubject}52.txt`,
  ];
  const listContainer = document.getElementById("n3-24-7-container");
  let html = ""; //bien local html
  let script = [];
  audioArr.forEach(function (mov, i) {
    //nap script cho audio bằng fetch với tham số là ủrl hay là đường dẫn đến file
    async function fetchFiletxt() {
      try {
        const response = await fetch(`${audioLink}${scriptArr[i]}`);
        if (!response.ok) {
          throw new Error(`không thể tải file ${audioLink}${scriptArr[i]}`);
        }
        const content = await response.text();
        script[i] = content;
        html += `
  <div class="form-audio">
  <audio loop class="audio-element" src="${audioLink}${mov}"></audio>
  <input
  type="range"
  class="progressBar"
  min="0"
  max="100"
  value="0"
  step="1"
  />
  <span class="currentTime">0:00</span>
  <button class="play-btn">Play</button>
  <button class="pause-btn">Pause</button>
  <button class="return-btn">Return</button>
  <pre>${script[i]}</pre> 
  </div>
  `;
        eventAudio();
      } catch (error) {
        console.log(error);
      }
    }

    fetchFiletxt();
    //hien thị audio
  });
  // sau khi tao list html thi bo vao container
  function eventAudio() {
    listContainer.innerHTML = html;
    // -----DOM-----
    const audio = document.querySelectorAll(".audio-element");
    const playBtn = document.querySelectorAll(".play-btn");
    const pauseBtn = document.querySelectorAll(".pause-btn");
    const returnBtn = document.querySelectorAll(".return-btn");
    const progressBar = document.querySelectorAll(".progressBar");
    const currentTime = document.querySelectorAll(".currentTime");

    // vong for cho cac su kien: hien thi file audio , nut play pasue return , va keydown
    audioArr.forEach(function (mov, i) {
      // lay do dai audio (s)
      audio[i].addEventListener("loadedmetadata", function () {
        progressBar[i].max = audio[i].duration;
      });
      //su kien hien thi thoi gian khi play, va tinh chỉnh cho phần giây luôn hiển thị 2 số
      audio[i].addEventListener("timeupdate", function () {
        progressBar[i].value = audio[i].currentTime;
        const current = audio[i].currentTime;
        const minutes = Math.floor(current / 60);
        const seconds = Math.floor(current % 60);
        const formSecond = seconds < 10 ? "0" + seconds : seconds;
        currentTime[i].textContent = `${minutes}:${formSecond}`;
      });
      // su kien kéo thả theo ý muốn trong thanh thời gian
      progressBar[i].addEventListener("input", function () {
        audio[i].currentTime = progressBar[i].value;
      });
      //---- nut ----- pause play return
      playBtn[i].addEventListener("click", function () {
        audio[i].play();
      });
      pauseBtn[i].addEventListener("click", function () {
        audio[i].pause();
      });
      returnBtn[i].addEventListener("click", function () {
        audio[i].pause();
        audio[i].currentTime = 0;
      });
      // //-----nhan space để pause , không space để play được vì không biết được cái nào đang chạy
      document.addEventListener("keydown", function (e) {
        if (e.key === " ") {
          e.preventDefault();
          if (audio[i].paused) {
            // audio[i].play();
          } else audio[i].pause();
        }
        //----- nhấn nút mũi tên để tua
        if (!audio[i].paused) {
          if (e.key === "ArrowLeft") {
            audio[i].currentTime -= 5;
          }
          if (e.key === "ArrowRight") {
            audio[i].currentTime += 5;
          }
        }
      });
    });
  }
}
