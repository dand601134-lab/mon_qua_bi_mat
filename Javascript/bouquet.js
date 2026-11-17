(() => {
  const startScreen = document.getElementById("start-screen");
  const giftScene = document.getElementById("gift-scene");
  const envelopeButton = document.getElementById("envelope-button");
  const letterDialog = document.getElementById("letter-dialog");
  const closeLetterButton = document.getElementById("close-letter");

  // Chạm lần kế tiếp sau khi màn hình bắt đầu đã đóng thì hiện bó hoa.
  document.addEventListener("pointerdown", (event) => {
    if (
      event.target.closest("#envelope-button") ||
      event.target.closest("#letter-dialog")
    ) return;

    if (!startScreen?.hidden) return;
    if (!document.body.classList.contains("scene-started")) return;
    if (!giftScene || !giftScene.hidden) return;

    giftScene.hidden = false;
    requestAnimationFrame(() => giftScene.classList.add("is-visible"));
  });

  envelopeButton?.addEventListener("click", () => {
    letterDialog?.showModal();
  });

  closeLetterButton?.addEventListener("click", () => {
    letterDialog?.close();
  });
})();
