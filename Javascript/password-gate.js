const gate = document.getElementById('password-gate');
const pageContent = document.getElementById('page-content');
const form = document.getElementById('password-form');
const input = document.getElementById('password-input');
const message = document.getElementById('password-message');
const toggleButton = document.getElementById('toggle-password');
const clearButton = document.getElementById('clear-password');

const correctPassword = '20/11/2026';
// 12:00 trưa ngày 20/11/2026 theo giờ Việt Nam.
const unlockTime = Date.UTC(2026, 10, 20, 5, 0, 0);
const sessionKey = 'my-page-unlocked';

function unlockPage() {
  gate.hidden = true;
  pageContent.hidden = false;
}

function lockPage() {
  gate.hidden = false;
  pageContent.hidden = true;
}

toggleButton.addEventListener('click', () => {
  const shouldShow = input.type === 'password';
  input.type = shouldShow ? 'text' : 'password';
  toggleButton.textContent = shouldShow ? 'Ẩn mật khẩu' : 'Hiện mật khẩu';
  input.focus();
});

clearButton.addEventListener('click', () => {
  input.value = '';
  message.textContent = '';
  input.focus();
});

let unlockedThisSession = false;

try {
  unlockedThisSession = sessionStorage.getItem(sessionKey) === 'true';
} catch (error) {
  // Vẫn cho nhập mật khẩu nếu sessionStorage không dùng được.
}

if (Date.now() >= unlockTime || unlockedThisSession) {
  unlockPage();
} else {
  lockPage();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (input.value.trim() === correctPassword) {
    try {
      sessionStorage.setItem(sessionKey, 'true');
    } catch (error) {
      // Cổng vẫn mở trong trang hiện tại nếu không lưu được phiên.
    }

    unlockPage();
  } else {
    message.textContent = 'Mật khẩu chưa đúng, bé nhập lại nhé.';
    message.style.color = '#ff9a9a';
    input.value = '';
    input.focus();
  }
});

const unlockTimer = setInterval(() => {
  if (Date.now() >= unlockTime) {
    clearInterval(unlockTimer);
    unlockPage();
  }
}, 1000);
