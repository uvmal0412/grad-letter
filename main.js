// =====================================================
// DANH SÁCH KHÁCH MỜI HỢP LỆ
// Thêm hoặc xóa tên slug tương ứng với file .html bạn đã tạo
// =====================================================
const validGuests = [
    "vlam",
    "bkhanh",
    "ctrang",
    "lphuong",
    "lviet",
    "mmy",
    "nuyen",
    "pphuong",
    "thuong",
    "tlinh",
    "tminh",
    "tanh"
];

// Hàm rung lắc ô input
function shakeInput(input) {
    input.style.animation = 'none';
    // Ép browser reset animation trước khi chạy lại
    input.offsetHeight;
    input.style.animation = 'shake 0.4s ease';
    setTimeout(() => {
        input.style.animation = '';
    }, 400);
}

document.addEventListener('DOMContentLoaded', () => {
    const smallLetter = document.getElementById('smallLetter');
    const bigLetterOverlay = document.getElementById('bigLetterOverlay');
    const goButton = document.getElementById('goButton');
    const guestNameInput = document.getElementById('guestNameInput');

    if (smallLetter) {
        smallLetter.addEventListener('mouseenter', () => {
            bigLetterOverlay.classList.add('active');
            setTimeout(() => {
                bigLetterOverlay.classList.add('open');
                guestNameInput.focus();
            }, 100);
        });
    }

    if (bigLetterOverlay) {
        bigLetterOverlay.addEventListener('click', (e) => {
            if (e.target === bigLetterOverlay) {
                closeLetter();
            }
        });
    }

    function closeLetter() {
        bigLetterOverlay.classList.remove('open');
        setTimeout(() => {
            bigLetterOverlay.classList.remove('active');
            guestNameInput.value = '';
        }, 600);
    }

    if (goButton) {
        goButton.addEventListener('click', () => {
            const name = guestNameInput.value.trim().toLowerCase();

            if (!name) {
                // Ô trống -> rung lắc
                shakeInput(guestNameInput);
                return;
            }

            if (!validGuests.includes(name)) {
                // Tên không hợp lệ -> rung lắc, không chuyển trang
                shakeInput(guestNameInput);
                return;
            }

            // Tên hợp lệ -> chuyển hướng đến file .html tương ứng
            goButton.innerText = 'Đang mở thư...';
            goButton.style.opacity = '0.8';
            setTimeout(() => {
                window.location.href = encodeURIComponent(name) + '.html';
            }, 600);
        });
    }

    if (guestNameInput) {
        guestNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                goButton.click();
            }
        });
    }
});

// Thêm keyframes cho animation shake của ô nhập tên
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    50% { transform: translateX(8px); }
    75% { transform: translateX(-8px); }
}
`;
document.head.appendChild(style);
