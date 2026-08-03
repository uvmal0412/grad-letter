# 🎓 Kế Hoạch Website Thiệp Mời Tốt Nghiệp
> Ngôn ngữ: Tiếng Việt | Theme: Olive Green Minimalist | Stack: HTML + CSS + Vanilla JS

---

## 1. Tổng Quan Kiến Trúc

Website **Single Page Application** – chỉ một `index.html` duy nhất, JavaScript đọc URL và render nội dung động.

```
letter.xyz/          → Trang poster chính
letter.xyz/lam       → Thư riêng cho Lâm
letter.xyz/nam       → Thư riêng cho Nam
letter.xyz/???       → Trang 404 "Bạn chưa được mời 😅"
```

---

## 2. Cấu Trúc Thư Mục

```
Grad/
├── index.html              ← Entry point duy nhất (SPA)
├── style.css               ← Global styles + CSS animations
├── main.js                 ← Router + render logic
├── guests.js               ← Data tất cả khách mời
│
├── assets/
│   ├── poster.png          ← Ảnh poster gốc (reference)
│   ├── letter-bg.svg       ← Texture giấy thư (SVG)
│   ├── envelope.svg        ← Icon phong bì
│   ├── stamp.svg           ← Icon tem thư trang trí
│   └── wax-seal.svg        ← Con dấu sáp trang trí
│
├── _redirects              ← Netlify redirect (/* → index.html)
└── plan_graduate.md
```

---

## 3. Ngôn Ngữ & Công Nghệ

### Câu Trả Lời: HTML + CSS + JS Làm Được Hết!

> HTML/CSS/JS hiện đại **hoàn toàn đủ sức** làm tất cả hiệu ứng mô tả bên dưới.
> Không cần framework nào. Không cần backend.

| Thành phần | Công nghệ | Lý do chọn |
|---|---|---|
| Cấu trúc | **HTML5** | Semantic, nhẹ |
| Hiệu ứng & Style | **CSS3** | `@keyframes`, `transform`, `filter`, `clip-path` đủ làm mọi animation |
| Logic & Router | **Vanilla JavaScript** | Nhẹ, không cần build tool |
| Chữ cái chuyển động | **CSS + JS (GSAP optional)** | Split text thành `<span>` rồi animate từng ký tự |
| Font | **Google Fonts** | Playfair Display + Be Vietnam Pro |
| Hosting | **Netlify** (miễn phí) | Hỗ trợ SPA redirect, custom domain |

#### Khi Nào Dùng Thêm Thư Viện?
| Thư viện | Khi nào dùng | Cân nhắc |
|---|---|---|
| **GSAP** (GreenSock) | Chữ cái animation phức tạp, timeline | Miễn phí, nhẹ ~70KB |
| **Splitting.js** | Tự động chia text thành `<span>` từng ký tự | Rất nhỏ ~3KB |
| **particles.js** | Hiệu ứng hạt bay (optional, trang trí) | Tùy chọn |

---

## 4. Trang Poster Chính – Hiệu Ứng Chi Tiết

### 4.1 Tái Tạo Poster Bằng HTML/CSS
Không nhúng ảnh – code lại toàn bộ layout từ poster gốc:

```
┌──────────────────────────────────────┐
│  SICT        (A ACCOUNT)        HAUI │
├──────────────────────────────────────┤
│                                      │
│   YOU'VE BEEN                        │
│   INVITE TO          ← Chữ animate  │
│   GRADUATION                         │
│                   [18/8 starburst]   │
│  ↙ THIS IS                          │
│    _FO.REST_._        HE IS          │
│               GRADUATE ↙            │
│                                      │
│  WATCH THIS → [✉ Icon lá thư]       │
│         [Starburst shape outline]    │
└──────────────────────────────────────┘
```

### 4.2 Hiệu Ứng Chữ Trên Poster (Hero Text)

**Kỹ thuật: Text Split + CSS `@keyframes`**

Mỗi chữ cái được bọc trong `<span>` riêng:
```html
<h1 class="hero-text">
  <span class="char" style="--i:0">Y</span>
  <span class="char" style="--i:1">O</span>
  <span class="char" style="--i:2">U</span>
  ...
</h1>
```

```css
/* Hiệu ứng xuất hiện từng chữ khi load trang */
.char {
  display: inline-block;
  opacity: 0;
  transform: translateY(60px) rotate(-5deg);
  animation: charReveal 0.6s ease forwards;
  animation-delay: calc(var(--i) * 0.05s);
}

@keyframes charReveal {
  to { opacity: 1; transform: translateY(0) rotate(0); }
}
```

```css
/* Hover toàn bộ heading → từng chữ nảy ngẫu nhiên */
.hero-text:hover .char {
  animation: charFloat 0.4s ease infinite alternate;
  animation-delay: calc(var(--i) * 0.03s);
}

@keyframes charFloat {
  from { transform: translateY(0); }
  to   { transform: translateY(-8px) rotate(2deg); }
}
```

### 4.3 Hiệu Ứng Mũi Tên Và Icon Lá Thư

```css
/* Mũi tên vẽ dần (SVG stroke animation) */
.arrow-svg path {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: drawArrow 1.2s ease 1s forwards;
}
@keyframes drawArrow {
  to { stroke-dashoffset: 0; }
}

/* Icon lá thư: pulse + hover lift */
.letter-icon {
  transition: transform 0.3s ease, filter 0.3s ease;
  animation: pulse 2s ease-in-out infinite;
}
.letter-icon:hover {
  transform: translateY(-8px) scale(1.1);
  filter: drop-shadow(0 12px 24px rgba(245, 240, 232, 0.4));
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.05); }
}
```

---

## 5. Trang Thư Cá Nhân – Hiệu Ứng Chi Tiết

### 5.1 Animation Phong Bì Mở Ra (Entrance)

**Kỹ thuật: CSS 3D Transform + `perspective`**

```
Bước 1: Phong bì xuất hiện từ dưới lên (translateY)
Bước 2: Nắp phong bì lật lên    (rotateX, perspective)
Bước 3: Lá thư trượt ra từ trong phong bì
Bước 4: Lá thư mở rộng full screen
Bước 5: Nội dung fade-in từng dòng
```

```css
/* Nắp phong bì lật */
.envelope-flap {
  transform-origin: top center;
  transform: perspective(800px) rotateX(0deg);
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.envelope.open .envelope-flap {
  transform: perspective(800px) rotateX(-180deg);
}

/* Lá thư trượt ra */
.letter-paper {
  transform: translateY(100%);
  transition: transform 0.7s ease 0.5s;
}
.envelope.open .letter-paper {
  transform: translateY(-20%);
}
```

### 5.2 Hiệu Ứng Hover Trên Lá Thư ⭐

**Glow + Float khi hover:**

```css
.letter-card {
  background: #f5f0e8;
  border-radius: 4px;
  box-shadow:
    0 4px 16px rgba(0,0,0,0.12),
    0 0 0 rgba(200, 185, 140, 0);        /* glow ban đầu = 0 */
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.4s ease;
}

.letter-card:hover {
  transform: translateY(-12px) rotate(-0.5deg);  /* nổi lên + nghiêng nhẹ */
  box-shadow:
    0 24px 48px rgba(0,0,0,0.18),
    0 0 40px rgba(200, 185, 140, 0.35),          /* glow ấm */
    0 0 80px rgba(200, 185, 140, 0.15);          /* glow lan rộng */
}
```

> **CSS `box-shadow` nhiều lớp** = hiệu ứng glow mềm mại, không cần thư viện nào.

### 5.3 Hiệu Ứng Chữ Cái Trong Thư

**Tên người nhận nổi bật – animate từng chữ:**

```css
/* "Kính gửi LÂM" → từng chữ trong tên nảy lên */
.guest-name .char {
  display: inline-block;
  animation: nameWave 1.5s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.1s);
}
@keyframes nameWave {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
}
```

**Nội dung thư fade-in từng dòng:**

```css
.letter-line {
  opacity: 0;
  transform: translateX(-20px);
  animation: lineReveal 0.5s ease forwards;
  animation-delay: calc(var(--line) * 0.15s + 1.5s);
}
@keyframes lineReveal {
  to { opacity: 1; transform: translateX(0); }
}
```

### 5.4 Chi Tiết Trang Thư

```
┌─────────────────────────────────────────┐
│  [Texture giấy cũ, màu kem #f5f0e8]     │
│                                         │
│  ✦ Tem thư góc phải (SVG trang trí)     │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━           │
│                                         │
│  Kính gửi  L Â M  ← chữ wave animate  │
│                                         │
│  [Nội dung thư – tiếng Việt]            │
│  Dòng 1 ← fade in                       │
│  Dòng 2   ← fade in (delay)             │
│  Dòng 3     ← fade in (delay hơn)       │
│                                         │
│  📅  Ngày X tháng X năm 2026            │
│  📍  [Địa điểm]                         │
│  ⏰  [Giờ]                              │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━           │
│                                         │
│  Trân trọng,                            │
│  [Tên bạn]  ← chữ ký handwriting font  │
│                                         │
│  🔴 Con dấu sáp (SVG rotate on hover)  │
└─────────────────────────────────────────┘
```

---

## 6. Bảng Đầy Đủ Tất Cả Hiệu Ứng

| Hiệu ứng | Element | Kỹ thuật CSS/JS | Độ khó |
|---|---|---|---|
| Chữ hero xuất hiện dần | Poster heading | `@keyframes` + `animation-delay` per char | ⭐⭐ |
| Chữ nảy khi hover heading | Poster heading | `charFloat` animation | ⭐⭐ |
| Mũi tên vẽ dần | SVG arrow | `stroke-dashoffset` animation | ⭐⭐ |
| Icon lá thư pulse + hover | Letter icon | `pulse` + `:hover transform` | ⭐ |
| Phong bì mở ra | Envelope | CSS 3D `rotateX` + `perspective` | ⭐⭐⭐ |
| Lá thư trượt ra | Letter paper | `translateY` transition | ⭐⭐ |
| Thư glow + nổi khi hover | Letter card | `box-shadow` multi-layer + `translateY` | ⭐⭐ |
| Tên người nhận wave | Guest name | `nameWave` + `animation-delay` per char | ⭐⭐ |
| Nội dung fade-in từng dòng | Letter body | `lineReveal` + staggered delay | ⭐⭐ |
| Con dấu sáp xoay hover | Wax seal SVG | `:hover rotate` transition | ⭐ |
| Tem thư rung nhẹ | Stamp SVG | `wiggle` animation | ⭐ |
| Cursor tùy chỉnh | Global | `cursor: url(...)` | ⭐ |

---

## 7. Dynamic Routing (URL Cá Nhân)

```javascript
// main.js – Router
const path = window.location.pathname.replace('/', '').toLowerCase();

if (path === '' || path === 'index.html') {
  renderPoster();           // Trang poster chính
} else if (guests[path]) {
  renderLetter(path);       // Trang thư cá nhân
} else {
  render404();              // Không tìm thấy
}
```

```javascript
// guests.js – Thêm người = thêm 1 object
const guests = {
  "lam": {
    displayName: "Lâm",
    salutation: "Kính gửi bạn Lâm thân mến,",
    message: `Cảm ơn bạn đã luôn ở bên mình suốt những năm tháng đại học...`,
    accentColor: "#7a9a3a"  // optional: màu riêng
  },
  "nam": {
    displayName: "Nam",
    salutation: "Gửi Nam,",
    message: `Cậu là người bạn tuyệt vời nhất mà mình từng gặp...`,
    accentColor: "#5a6e4a"
  }
}
```

---

## 8. Hosting & Deploy

### Netlify (Khuyến nghị)
1. Đẩy code lên GitHub
2. Connect repo với Netlify
3. Tạo file `_redirects`:
   ```
   /* /index.html 200
   ```
4. Netlify tự tạo domain `ten-ban.netlify.app` → bạn nhận được URL như `ten-ban.netlify.app/lam`
5. (Tuỳ chọn) Gắn custom domain như `letter.ten-ban.com` miễn phí

---

## 9. Design Tokens (Màu Sắc & Font)

```css
:root {
  /* Màu chủ đạo từ poster */
  --color-olive:       #4a5e2a;
  --color-olive-dark:  #3a4e1e;
  --color-olive-light: #6a7e3a;
  --color-cream:       #f5f0e8;
  --color-cream-dark:  #e8e0d0;
  --color-gold:        #c8b98c;
  --color-gold-glow:   rgba(200, 185, 140, 0.35);

  /* Typography */
  --font-display:  'Playfair Display', serif;    /* heading lớn */
  --font-body:     'Be Vietnam Pro', sans-serif; /* nội dung thư */
  --font-mono:     'Space Mono', monospace;      /* annotation, label */
  --font-script:   'Dancing Script', cursive;    /* chữ ký cuối thư */

  /* Spacing & Shape */
  --radius-letter: 4px;
  --shadow-lift:   0 24px 48px rgba(0,0,0,0.18), 0 0 40px var(--color-gold-glow);
}
```

---

## 10. Thứ Tự Build

```
Phase 1 – Foundation (1-2 giờ)
├── Thiết lập design tokens trong style.css
├── Google Fonts import
└── Reset CSS + base styles

Phase 2 – Poster Page (2-3 giờ)
├── HTML layout tái tạo poster
├── Hero text split + animation
├── SVG mũi tên cong
├── Icon lá thư + hover effects
└── Starburst shape (CSS clip-path)

Phase 3 – Router (30 phút)
├── main.js: đọc URL pathname
├── guests.js: data mẫu 2-3 người
└── Render function skeleton

Phase 4 – Letter Page (3-4 giờ)
├── Envelope HTML + CSS 3D animation
├── Letter card + glow hover effect
├── Text split + wave animation tên
├── Staggered line reveal
└── Wax seal + stamp SVG

Phase 5 – Polish (1-2 giờ)
├── Mobile responsive
├── Loading states
├── 404 page
└── Test tất cả slug

Phase 6 – Deploy (30 phút)
├── Push lên GitHub
├── Connect Netlify
└── Cấu hình _redirects
```

---

## 11. Câu Hỏi Còn Lại Cần Xác Nhận

| # | Câu hỏi | Ảnh hưởng đến |
|---|---|---|
| 1 | Danh sách slug (vd: `lam`, `nam`, `trang`)? | `guests.js` |
| 2 | Tên bạn ký cuối thư? | Tất cả trang thư |
| 3 | Thông tin lễ: ngày, giờ, địa điểm? | Tất cả trang thư |
| 4 | Custom domain hay dùng Netlify free domain? | Deploy config |
