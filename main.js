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
        goButton.addEventListener('click', async () => {
            const name = guestNameInput.value.trim().toLowerCase();
            if (name) {
                goButton.innerText = 'Đang tìm...';
                goButton.style.opacity = '0.8';

                const targetPage = encodeURIComponent(name) + '.html';

                try {
                    // Kiểm tra xem file name.html có tồn tại không
                    const response = await fetch(targetPage, { method: 'HEAD' });

                    if (response.ok) {
                        // Nếu file tồn tại, chuyển hướng sau một chút delay cho mượt
                        setTimeout(() => {
                            window.location.href = targetPage;
                        }, 500);
                    } else {
                        // Nếu server trả về 404, ném lỗi để chạy vào catch
                        throw new Error('Not found');
                    }
                } catch (error) {
                    // Nếu file không tồn tại hoặc lỗi mạng, rung lắc ô input
                    goButton.innerText = 'Go';
                    goButton.style.opacity = '1';

                    guestNameInput.style.animation = 'shake 0.4s ease';
                    setTimeout(() => {
                        guestNameInput.style.animation = '';
                    }, 400);
                }
            } else {
                guestNameInput.style.animation = 'shake 0.4s ease';
                setTimeout(() => {
                    guestNameInput.style.animation = '';
                }, 400);
            }
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
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
}
`;
document.head.appendChild(style);
