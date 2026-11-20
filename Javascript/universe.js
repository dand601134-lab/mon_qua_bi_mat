(() => {
  // ====== SỬA DANH SÁCH ẢNH Ở ĐÂY ======
  const PHOTOS = [
    "./img/img_1.png",
    "./img/img_2.png",
    "./img/img_3.png",
    "./img/img_4.png",
    "./img/img_5.png",
    "./img/img_6.png",
    "./img/img_7.png",
    "./img/img_8.png",
    "./img/img_9.png",
    "./img/img_10.png"
  ];
  // =====================================

  const PHOTO_LIST = [...PHOTOS, ...PHOTOS];

  const page = document.getElementById("universe-page");
  if (!page) return;

  const canvas = document.getElementById("universe-canvas");
  const ctx = canvas.getContext("2d");
  const photoLayer = document.getElementById("universe-photos");
  const viewer = document.getElementById("photo-viewer");
  const viewerImg = viewer.querySelector("img");
  const zoomRange = document.getElementById("zoom-range");
  const shapeButtons = document.querySelectorAll(".shape-btn");

  const R = 220;
  const TAU = Math.PI * 2;
  const rand = Math.random;
  const g = () => (rand() + rand() + rand() - 1.5) / 1.5;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Hình dạng ---------- */
  const SHAPES = {
    galaxy: {
      particle(i) {
        const r = rand();
        if (r < 0.2) {
          const rad = Math.pow(rand(), 1.5) * R * 0.5, a = rand() * TAU;
          return { x: Math.cos(a) * rad, y: g() * rad * 0.45, z: Math.sin(a) * rad, h: 300 + rand() * 30, l: 85 + rand() * 8 };
        }
        if (r < 0.34) {
          const a = rand() * TAU, rad = R * 1.45 + g() * R * 0.16;
          return { x: Math.cos(a) * rad, y: g() * 16, z: Math.sin(a) * rad, h: 305 + rand() * 40, l: 72 };
        }
        const arm = i % 3, rad = Math.pow(rand(), 0.65) * R * 1.35 + R * 0.08;
        const a = (rad / R) * 3.2 + arm * 2.094 + g() * 0.5;
        return { x: Math.cos(a) * rad, y: g() * 26 * (1.2 - rad / (R * 1.5)), z: Math.sin(a) * rad, h: 280 + (rad / R) * 60, l: 62 + rand() * 22 };
      },
      photo(k, n) {
        const a = (k / n) * TAU + 0.3, rad = R * (0.95 + (k % 3) * 0.28);
        return { x: Math.cos(a) * rad, y: g() * 45, z: Math.sin(a) * rad };
      }
    },

    heart: {
      particle() {
        const t = rand() * TAU;
        const s = rand() < 0.5 ? 0.92 + rand() * 0.08 : Math.pow(rand(), 0.6);
        const x = 16 * Math.pow(Math.sin(t), 3);
        const yf = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        return { x: x * 12.5 * s, y: -(yf + 2.5) * 12.5 * s, z: g() * 70, h: 335 + rand() * 25, l: 62 + rand() * 18 };
      },
      photo(k, n) {
        const t = (k / n) * TAU + 0.2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const yf = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const s = 0.85 + rand() * 0.2;
        return { x: x * 12.5 * s, y: -(yf + 2.5) * 12.5 * s, z: (k % 2 ? 1 : -1) * (35 + rand() * 40) };
      }
    },

    rose: {
      particle() {
        const q = rand();
        if (q < 0.82) {
          const t = Math.pow(rand(), 0.8), layer = Math.floor(t * 6);
          const a = rand() * TAU;
          const rad = (26 + t * 112) * (1 + 0.16 * Math.sin(5 * (a + layer * 0.9)));
          return { x: Math.cos(a) * rad, y: -40 - 95 * Math.pow(t, 1.3), z: Math.sin(a) * rad, h: 343 + rand() * 16, l: 42 + t * 24 };
        }
        if (q < 0.93) {
          return { x: g() * 3, y: -30 + rand() * 260, z: g() * 3, h: 135, l: 45 };
        }
        const side = rand() < 0.5 ? -1 : 1, s = rand(), bulge = Math.sin(s * Math.PI);
        return { x: side * s * 75, y: 125 - s * 45 + g() * bulge * 14, z: g() * bulge * 14, h: 125 + rand() * 25, l: 40 + rand() * 12 };
      },
      photo(k, n) {
        const a = (k / n) * TAU * 1.5 + 0.4, rad = 170 + rand() * 50;
        return { x: Math.cos(a) * rad, y: -60 + g() * 120, z: Math.sin(a) * rad };
      }
    }
  };

  /* ---------- Hạt ---------- */
  const N = window.innerWidth < 700 ? 3200 : 6500;
  const parts = [];
  for (let i = 0; i < N; i++) {
    const t = SHAPES.galaxy.particle(i);
    parts.push({ x: t.x, y: t.y, z: t.z, h: t.h, l: t.l, tx: t.x, ty: t.y, tz: t.z, th: t.h, tl: t.l, s: 0.5 + rand() * 1.0 });
  }

  /* ---------- Thẻ ảnh ---------- */
  const cards = PHOTO_LIST.map((src, k) => {
    const el = document.createElement("div");
    el.className = "u-photo";
    el.style.backgroundImage = `url("${src}")`;
    el.dataset.src = src;
    photoLayer.appendChild(el);
    const t = SHAPES.galaxy.photo(k, PHOTO_LIST.length);
    return { el, x: t.x, y: t.y, z: t.z, tx: t.x, ty: t.y, tz: t.z };
  });

  function setShape(name) {
    const s = SHAPES[name];
    parts.forEach((p, i) => {
      const t = s.particle(i);
      p.tx = t.x; p.ty = t.y; p.tz = t.z; p.th = t.h; p.tl = t.l;
    });
    cards.forEach((c, k) => {
      const t = s.photo(k, cards.length);
      c.tx = t.x; c.ty = t.y; c.tz = t.z;
    });
    shapeButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.shape === name));
  }

  shapeButtons.forEach((b) => b.addEventListener("click", () => setShape(b.dataset.shape)));

  /* ---------- Zoom ---------- */
  let zoom = 1, zoomTarget = 1;
  function setZoom(v) {
    zoomTarget = clamp(v, 0.5, 2);
    zoomRange.value = zoomTarget;
  }
  document.getElementById("zoom-in").addEventListener("click", () => setZoom(zoomTarget + 0.15));
  document.getElementById("zoom-out").addEventListener("click", () => setZoom(zoomTarget - 0.15));
  zoomRange.addEventListener("input", () => setZoom(parseFloat(zoomRange.value)));
  page.addEventListener("wheel", (e) => {
    if (e.target.closest("#photo-viewer")) return;
    setZoom(zoomTarget - e.deltaY * 0.001);
  }, { passive: true });

  /* ---------- Kéo xoay & bấm ảnh ---------- */
  let yaw = 0, pitch = 0.2, vyaw = 0;
  let dragging = false, moved = 0, lastX = 0, lastY = 0, downTarget = null;

  page.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".universe-controls, #photo-viewer")) return;
    dragging = true; moved = 0;
    lastX = e.clientX; lastY = e.clientY;
    downTarget = e.target; vyaw = 0;
  });

  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    yaw -= dx * 0.006;
    pitch = clamp(pitch + dy * 0.006, -1.3, 1.3);
    vyaw = -dx * 0.006;
  });

  window.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    if (moved < 8 && downTarget && downTarget.closest) {
      const card = downTarget.closest(".u-photo");
      if (card) openViewer(card.dataset.src);
    }
  });

  function openViewer(src) {
    viewerImg.src = src;
    viewer.hidden = false;
  }
  function closeViewer() { viewer.hidden = true; }
  viewer.addEventListener("click", closeViewer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeViewer(); });

  /* ---------- Sao nền & sao băng ---------- */
  const bgStars = Array.from({ length: 180 }, () => ({ x: rand(), y: rand(), r: 0.4 + rand() * 1.2, ph: rand() * TAU, sp: 0.5 + rand() * 1.5 }));
  const shooters = [];
  let nextShooter = 800;

  function spawnShooter() {
    shooters.push({
      x: W * (0.35 + rand() * 0.75), y: -20 + rand() * H * 0.35,
      vx: -(7 + rand() * 6), vy: 3.5 + rand() * 3, life: 1
    });
  }

  /* ---------- Kích thước ---------- */
  let W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = page.clientWidth; H = page.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", resize);

  /* ---------- Vòng lặp ---------- */
  const F = 700;
  let last = performance.now(), started = false;

  function frame(now) {
    requestAnimationFrame(frame);
    if (page.hidden) { last = now; return; }
    if (!started) { resize(); started = true; }

    const dt = Math.min((now - last) / 16.67, 3);
    last = now;
    const ease = 1 - Math.pow(0.94, dt);

    if (!dragging) {
      yaw += vyaw * dt + 0.0025 * dt;
      vyaw *= Math.pow(0.95, dt);
      pitch += (0.2 - pitch) * 0.01 * dt;
    }
    zoom += (zoomTarget - zoom) * 0.12;

    const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
    const unit = Math.min(W, H) / 620;
    const cx = W / 2, cy = H * 0.46;

    function project(x, y, z) {
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP;
      const sc = F / (F + z2);
      return { sx: cx + x1 * sc * unit * zoom, sy: cy + y2 * sc * unit * zoom, sc, z2 };
    }

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    const tsec = now / 1000;
    for (const s of bgStars) {
      const a = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(tsec * s.sp + s.ph));
      ctx.fillStyle = `rgba(255,235,245,${a})`;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, TAU);
      ctx.fill();
    }

    for (const p of parts) {
      p.x += (p.tx - p.x) * ease;
      p.y += (p.ty - p.y) * ease;
      p.z += (p.tz - p.z) * ease;
      p.h += (p.th - p.h) * ease;
      p.l += (p.tl - p.l) * ease;
      const q = project(p.x, p.y, p.z);
      const depth = clamp(0.6 - q.z2 / (R * 3.4), 0.18, 1);
      const r = Math.max(0.5, p.s * q.sc * unit * zoom);
      ctx.fillStyle = `hsla(${p.h},90%,${p.l}%,${depth})`;
      ctx.beginPath();
      ctx.arc(q.sx, q.sy, r, 0, TAU);
      ctx.fill();
    }

    nextShooter -= dt * 16.67;
    if (nextShooter <= 0) { spawnShooter(); nextShooter = 1500 + rand() * 3000; }
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.x += s.vx * dt; s.y += s.vy * dt; s.life -= 0.008 * dt;
      if (s.life <= 0 || s.x < -200 || s.y > H + 100) { shooters.splice(i, 1); continue; }
      const len = 14;
      const tx = s.x - s.vx * len, ty = s.y - s.vy * len;
      const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
      grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
      grad.addColorStop(1, "rgba(255,150,220,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${s.life})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.2, 0, TAU);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    for (const c of cards) {
      c.x += (c.tx - c.x) * ease;
      c.y += (c.ty - c.y) * ease;
      c.z += (c.tz - c.z) * ease;
      const q = project(c.x, c.y, c.z);
      const depth = clamp(0.8 - q.z2 / (R * 4), 0.4, 1);
      const sc = q.sc * unit * zoom;
      c.el.style.transform = `translate(${q.sx}px, ${q.sy}px) translate(-50%, -50%) scale(${sc})`;
      c.el.style.opacity = depth;
      c.el.style.zIndex = 1000 - Math.round(q.z2);
    }
  }

  requestAnimationFrame(frame);
})();
