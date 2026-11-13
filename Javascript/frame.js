document.addEventListener("DOMContentLoaded", function () {
  const warningLayer = document.getElementById("rotate-device-warning");

  function checkDeviceOrientation() {
    const isMobile = window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches;

    if (isMobile) {
      if (window.innerHeight > window.innerWidth) {
        // Điện thoại đang dọc -> Hiện thông báo chặn lại
        if (warningLayer) warningLayer.style.display = "flex";
      } else {
        // Đã xoay ngang -> Ẩn thông báo, cho phép chạy tiếp các bước tiếp theo
        if (warningLayer) warningLayer.style.display = "none";
      }
    } else {
      // Máy tính (Desktop) -> Bỏ qua hoàn toàn, không hiển thị gì cả
      if (warningLayer) warningLayer.style.display = "none";
    }
  }

  window.addEventListener("resize", checkDeviceOrientation);
  window.addEventListener("orientationchange", checkDeviceOrientation);
  checkDeviceOrientation();
});
