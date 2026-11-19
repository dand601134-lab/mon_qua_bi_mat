(() => {
  const startScreen = document.getElementById("start-screen");
  const giftScene = document.getElementById("gift-scene");
  const envelopeButton = document.getElementById("envelope-button");
  const letterDialog = document.getElementById("letter-dialog");
  const closeLetterButton = document.getElementById("close-letter");

  function showGiftScene() {
    if (!document.body.classList.contains("scene-started")) return;
    if (!giftScene || giftScene.hidden === false) return;

    giftScene.hidden = false;
    requestAnimationFrame(() => giftScene.classList.add("is-visible"));
  }

  document.addEventListener("click", (event) => {
    const clickedStart = event.target.closest("#start-screen");
    const clickedEnvelope = event.target.closest("#envelope-button");
    const clickedDialog = event.target.closest("#letter-dialog");

    if (clickedStart || clickedEnvelope || clickedDialog) return;
    if (!startScreen || !startScreen.hidden) return;

    showGiftScene();
  });

  envelopeButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    letterDialog?.showModal();
  });
  
  closeLetterButton?.addEventListener("click", () => {
    letterDialog?.close();
  });
  const goUniverseButton = document.getElementById("go-universe");
  const universePage = document.getElementById("universe-page");

  goUniverseButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    letterDialog?.close();
    if (!universePage) return;
    universePage.hidden = false;
    requestAnimationFrame(() => universePage.classList.add("is-visible"));
  });
})();
