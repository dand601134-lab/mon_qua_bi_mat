const gate = document.getElementById('password-gate');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const pageContent = document.getElementById('page-content');
const form = document.getElementById('password-form');
const input = document.getElementById('password-input');
const message = document.getElementById('password-message');
const toggleButton = document.getElementById('toggle-password');
const clearButton = document.getElementById('clear-password');

const correctPassword = '07082026';
// 12:00 trưa ngày 20/11/2026 theo giờ Việt Nam.
const unlockTime = Date.UTC(2026, 10, 20, 5, 0, 0);
const sessionKey = 'my-page-unlocked';

function showPageContent() {
  gate.hidden = true;
  if (startScreen) startScreen.hidden = true;
  pageContent.hidden = false;
}

function showStartScreen() {
  gate.hidden = true;
  pageContent.hidden = true;

  // Tạm thời dự phòng cho tới khi thêm phần tử start-screen vào index.html.
  if (startScreen) {
    startScreen.hidden = false;
  } else {
    pageContent.hidden = false;
  }
}

function showPasswordGate() {
  gate.hidden = false;
  if (startScreen) startScreen.hidden = true;
  pageContent.hidden = true;
}

if (toggleButton && input) {
  toggleButton.addEventListener('click', () => {
    const shouldShow = input.type === 'password';
    input.type = shouldShow ? 'text' : 'password';
    toggleButton.textContent = shouldShow ? 'Ẩn mật khẩu' : 'Hiện mật khẩu';
    input.focus();
  });
}

if (clearButton && input && message) {
  clearButton.addEventListener('click', () => {
    input.value = '';
    message.textContent = '';
    input.focus();
  });
}

if (startButton) {
  startButton.addEventListener('click', showPageContent);
}

let unlockedThisSession = false;

try {
  unlockedThisSession = sessionStorage.getItem(sessionKey) === 'true';
} catch (error) {
  // Vẫn cho nhập mật khẩu nếu sessionStorage không dùng được.
}

if (Date.now() >= unlockTime || unlockedThisSession) {
  showStartScreen();
} else {
  showPasswordGate();
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (input.value.trim() === correctPassword) {
      try {
        sessionStorage.setItem(sessionKey, 'true');
      } catch (error) {
        // Màn hình bắt đầu vẫn hiện trong trang hiện tại.
      }

      showStartScreen();
    } else {
      message.textContent = 'Mật khẩu chưa đúng, bé nhập lại nhé.';
      message.style.color = '#ff9a9a';
      input.value = '';
      input.focus();
    }
  });
}

const unlockTimer = setInterval(() => {
  if (Date.now() >= unlockTime) {
    clearInterval(unlockTimer);
    showStartScreen();
  }
}, 1000);
