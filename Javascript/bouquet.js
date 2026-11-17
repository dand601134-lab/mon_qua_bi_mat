(() => {
  const startScreen = document.getElementById("start-screen");
  const giftScene = document.getElementById("gift-scene");
  const envelopeButton = document.getElementById("envelope-button");
  const letterDialog = document.getElementById("letter-dialog");
  const closeLetterButton = document.getElementById("close-letter");

  // Bổ sung cành, lá và tulip để bó hoa trông đầy đặn hơn.
  const bouquetSvg = giftScene?.querySelector(".bouquet");
  if (bouquetSvg && !bouquetSvg.dataset.densified) {
    const svgNS = "http://www.w3.org/2000/svg";
    const stems = bouquetSvg.querySelector('g[stroke="#397b37"]');
    const leaves = bouquetSvg.querySelector('g[fill="#4a963f"]');

    const stemPaths = [
      "M180 375 Q95 255 48 150",
      "M180 375 Q120 220 100 115",
      "M180 375 Q145 190 155 88",
      "M180 375 Q215 190 205 88",
      "M180 375 Q240 220 260 115",
      "M180 375 Q265 255 312 150",
      "M180 375 Q85 285 85 215",
      "M180 375 Q275 285 275 215"
    ];

    stemPaths.forEach((d) => {
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", d);
      stems?.appendChild(path);
    });

    const leafPaths = [
      "M155 350 Q80 325 82 285 Q135 290 168 334Z",
      "M205 350 Q280 325 278 285 Q225 290 192 334Z",
      "M145 330 Q75 285 92 250 Q145 270 166 315Z",
      "M215 330 Q285 285 268 250 Q215 270 194 315Z",
      "M165 310 Q105 270 118 235 Q162 254 178 295Z",
      "M195 310 Q255 270 242 235 Q198 254 182 295Z",
      "M135 365 Q85 345 92 315 Q132 325 158 350Z",
      "M225 365 Q275 345 268 315 Q228 325 202 350Z"
    ];

    leafPaths.forEach((d) => {
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", d);
      leaves?.appendChild(path);
    });

    const flowerPositions = [
      [48, 150, 0.76],
      [100, 115, 0.78],
      [155, 88, 0.76],
      [205, 88, 0.76],
      [260, 115, 0.78],
      [312, 150, 0.76],
      [85, 215, 0.72],
      [275, 215, 0.72]
    ];

    flowerPositions.forEach(([x, y, scale]) => {
      const flower = document.createElementNS(svgNS, "use");
      flower.setAttribute("href", "#tulip");
      flower.setAttribute("transform", `translate(${x} ${y}) scale(${scale})`);
      bouquetSvg.appendChild(flower);
    });

    bouquetSvg.dataset.densified = "true";
  }

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
})();
