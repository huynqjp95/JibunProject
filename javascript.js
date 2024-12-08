"use strict";
const tuVungInput = document.querySelector("#tuvung");
const amHanInput = document.getElementById("amhan");
const yNghiaInput = document.querySelector("#ynghia");
const viDuInput = document.getElementById("vidu");
const submitBtn = document.querySelector(".submit-btn");
const bodyTable = document.querySelector(".body-table");
const searchBtn = document.querySelector(".submit-search");
const searchInput = document.getElementById("search");
//--edit--
const editTv = document.querySelector(".editTv");
const editAh = document.querySelector(".editAh");
const editYn = document.querySelector(".editYn");
const editVd = document.querySelector(".editVd");
//-----page------
const pageNum = document.getElementById("page");
const xacNhanBtn = document.querySelector(".page-choose");
const nextBtn = document.querySelector(".next");
const previouBtn = document.querySelector(".previous");
const hienPage = document.querySelector(".hien-page");
//-------Hàm tạo từ vựng ------
function TuVung(tuVung, amHan, yNghia, viDu) {
  this.tuVung = tuVung;
  this.amHan = amHan;
  this.yNghia = yNghia;
  this.viDu = viDu;
}
TuVung.prototype.thongBao = function () {
  alert(`đã nhập thành công từ ${this.tuVung}`);
};
TuVung.prototype.deleleTuVung = function () {};
// -----------Hàm hiển thị từ vựng ra table
const hienThi = function (arr) {
  bodyTable.innerHTML = "";
  let html = "";
  arr.forEach(function (mov, i) {
    html += `<tr>
    <td>${mov.tuVung}</td>
    <td>${mov.amHan}</td>
    <td>${mov.yNghia}</td>
    <td>${mov.viDu}</td>
    <td class="delete-btn">X</td>
    </tr>`;
  });
  bodyTable.innerHTML = html;
};
// ----------lưu xuất local storage
function saveArrayToLocalStorage(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}
function getArrayFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  const arr = data ? JSON.parse(data) : [];
  return arr.map(function (mov) {
    return new TuVung(mov.tuVung, mov.amHan, mov.yNghia, mov.viDu);
  });
}
// -------- Xoá toàn bộ input khi nhấn Submit
const clearInput = function () {
  tuVungInput.value = "";
  amHanInput.value = "";
  yNghiaInput.value = "";
  viDuInput.value = "";
};
// ------tạo từ vựng từ người nhập ------
const arrTuVung = getArrayFromLocalStorage("arrTuVung");
hienThi(arrTuVung);
//Event nut submit
submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const tVung = tuVungInput.value.trim();
  const tonTai = arrTuVung.some((mov) => mov.tuVung === tVung);
  if (tonTai) {
    console.log("ton tai");
    return;
  }
  const aHan = amHanInput.value.trim();
  const yNghia = yNghiaInput.value.trim();
  const vDu = viDuInput.value.trim();
  const stt = new TuVung(tVung, aHan, yNghia, vDu);
  arrTuVung.unshift(stt);
  hienThi(arrTuVung);
  saveArrayToLocalStorage("arrTuVung", arrTuVung);
  clearInput();
  deleteTuvung();
});
//-------- Xoá từ vụng function--------
function deleteTuvung() {
  const deleteBtn = document.querySelectorAll(".delete-btn");
  deleteBtn.forEach(function (mov, i) {
    mov.addEventListener("click", function () {
      const confirmDelete = confirm("Bạn chắc muốn xoá");
      if (!confirmDelete) {
        return;
      }
      arrTuVung.splice(i, 1);
      saveArrayToLocalStorage("arrTuVung", arrTuVung);
      hienThi(arrTuVung);
      deleteTuvung();
    });
  });
}
deleteTuvung();
//-------------Search-------------
// khi cick Search thì kiểm tra trong arrTuVung có từ đã nhập vào không, nếu có thì cho giá trị của các ô input là từng giá trị của từ vựng
let editdekiru = 0;
searchBtn.addEventListener("click", function () {
  const data = searchInput.value.trim();
  let searchKQ = arrTuVung.filter((mov) => mov.tuVung === data); // hàm some trả về true nếu tìm thấy và dừng ngay vòng lập
  if (searchKQ.length > 0) {
    editdekiru = searchKQ[0];
    editTv.value = searchKQ[0].tuVung;
    editAh.value = searchKQ[0].amHan;
    editYn.value = searchKQ[0].yNghia;
    editVd.value = searchKQ[0].viDu;
  } else {
    editdekiru = 0;
    editTv.value = "Không có từ cần tìm";
    editAh.value = "";
    editYn.value = "";
    editVd.value = "";
  }
});

// ----------Edit----------
//Tiếp theo là phần Edit khi chỉnh sửa các ô input vào nhấn nút Edit thì từ vựng đó sẽ được sửa chửa
// đầu tiên trên sự kiện của nút search thì ta lấy biến editdekiru chứa object từ vựng được tìm, thì khi nhấn nút sự kiện edit thì gán lại giá trị mới cho từ vựng này,
const editBtn = document.querySelector(".btn-edit");
editBtn.addEventListener("click", function () {
  if (!editdekiru) {
    return;
  }
  if (confirm("Bạn muốn chắc có muốn sửa ??")) {
    editdekiru.tuVung = editTv.value;
    editdekiru.amHan = editAh.value;
    editdekiru.yNghia = editYn.value;
    editdekiru.viDu = editVd.value;
  }
  saveArrayToLocalStorage("arrTuVung", arrTuVung);
  hienThi(arrTuVung);
});

// ------phần tiếp theo chia trang cho list từ vựng-----
// với số lượng từ vựng lớn thì không thể hiển thị 1 lần được rất là khó học, vì vậy sẽ cần chức năng phân trang cho list từ vựng, và sẽ có nút chọn số lượng từ hiển thị trong 1 page
let page = 1; //page mặc định là 1
let numberOfVocabulary = 10; //số lượng từ vựng trong 1 page mặc định là 10
let pageNumberReality = Math.ceil(arrTuVung.length / numberOfVocabulary); //số page thực tế theo số lượng từ vựng có trong list
pageNum.value = numberOfVocabulary;
// Nuts lùi page previous
previouBtn.addEventListener("click", function () {
  if (page < 2) {
    return;
  } else {
    page -= 1;
    hienPage.textContent = page;
    displayVocabularyPage(page, numberOfVocabulary);
  }
});
// nút Next page
nextBtn.addEventListener("click", function () {
  page += 1;
  if (page > pageNumberReality) {
    page -= 1;
    return;
  } else {
    hienPage.textContent = page;
    displayVocabularyPage(page, numberOfVocabulary);
  }
});
// Nút xác nhận chỉnh page, khi chọn số phần tử hiển thị cho bảng từ vựng (numberOfVocabulary) thì sẽ quay trở lại trang 1
xacNhanBtn.addEventListener("click", function () {
  numberOfVocabulary = pageNum.value;
  pageNumberReality = Math.ceil(arrTuVung.length / numberOfVocabulary);
  page = 1;
  hienPage.textContent = page;
  const arrTuVungForPage = arrTuVung.slice(0, numberOfVocabulary);
  hienThi(arrTuVungForPage);
  document.querySelector(
    ".stt-vocabulary"
  ).textContent = `Stt: 1 -- ${numberOfVocabulary}`;
});
// hàm hiển thị arr theo page và numberOfVocabulary. ở đây hàm này sẽ hiển thị từ vựng theo page và số lượng từ vựng có trong 1 bảng khi người dùng chọn ở bần page. hàm sẽ có 2 tham số là page và numberOfVocabulary , đầu tiên sẽ tạo mới 1 arr chứa từ vựng được tính toán theo page và numberOfVocabulary đã chọn,
function displayVocabularyPage(page, numberOfVocabulary) {
  const arrTuVungForPage = arrTuVung.slice(
    (page - 1) * numberOfVocabulary,
    page * numberOfVocabulary
  );
  hienThi(arrTuVungForPage);
  document.querySelector(".stt-vocabulary").textContent = `Stt: ${
    (page - 1) * numberOfVocabulary + 1
  } -- ${page * numberOfVocabulary}`;
}
