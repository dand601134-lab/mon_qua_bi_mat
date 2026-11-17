(() => {
  const startScreen = document.getElementById("start-screen");
  const giftScene = document.getElementById("gift-scene");
  const envelopeButton = document.getElementById("envelope-button");
  const letterDialog = document.getElementById("letter-dialog");
  const closeLetterButton = document.getElementById("close-letter");

  function showGiftScene() {
    if (!document.body.classList.contains("scene-started")) return;
    if (!giftScene || !giftScene.hidden) return;

    giftScene.hidden = false;
    requestAnimationFrame(() => giftScene.classList.add("is-visible"));
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("#start-screen")) return;
    if (event.target.closest("#envelope-button")) return;
    if (event.target.closest("#letter-dialog")) return;
    if (!startScreen || !startScreen.hidden) return;

    showGiftScene();
  });

  envelopeButton?.addEventListener("click", () => {
    letterDialog?.showModal();
  });

  closeLetterButton?.addEventListener("click", () => {
    letterDialog?.close();
  });
})();
