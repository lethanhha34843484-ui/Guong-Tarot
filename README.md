# Gương Tarot — Deploy Bundle

Bộ source hoàn chỉnh để đưa **Gương Tarot** lên GitHub và Vercel. App chính vẫn hoạt động hoàn toàn ở phía trình duyệt; API AI là **tùy chọn** và không cần thiết cho luồng tạo prompt hiện tại.

## Cấu trúc

```text
/
├─ index.html                 # app chính
├─ api/
│  ├─ health.js               # kiểm tra API
│  └─ reflect.js              # endpoint phản tư AI tùy chọn
├─ assets/
│  ├─ hero.jpg                # key visual web
│  ├─ social-preview.jpg      # Open Graph / social preview 1200×630
│  └─ icons/                  # PWA icons + maskable icons
├─ manifest.webmanifest
├─ service-worker.js
├─ favicon.ico
├─ apple-touch-icon.png
├─ vercel.json
├─ package.json
├─ .env.example
└─ .gitignore
```

## Deploy lên Vercel

### Cách 1 — GitHub
1. Tạo repository mới và đưa **toàn bộ nội dung trong thư mục này** lên root của repository.
2. Trong Vercel, chọn **New Project → Import Git Repository**.
3. Framework Preset có thể để **Other**. Không cần Build Command và không cần Output Directory.
4. Deploy.

### Cách 2 — Vercel CLI
Sau khi cài và đăng nhập Vercel CLI, chạy `vercel` trong root project; dùng `vercel --prod` khi muốn đưa bản đã kiểm tra lên production.

## API AI tùy chọn

Luồng app hiện tại tạo prompt để người dùng mang prompt + ảnh trải bài sang GPT; vì vậy **không cần API key để app chạy**.

Nếu muốn dùng `/api/reflect`, tạo Environment Variables trong Vercel:

- `OPENAI_API_KEY` — khóa API OpenAI của project.
- `OPENAI_MODEL` — mặc định trong source là `gpt-5.6-luna`.

Không đưa API key vào `index.html`, GitHub, manifest hay bất kỳ file client-side nào. `.env.example` chỉ là mẫu và không chứa secret.

Ví dụ request:

```bash
curl -X POST https://YOUR-DOMAIN/api/reflect \
  -H "Content-Type: application/json" \
  -d '{"input":"Hãy giúp tớ phản tư về câu hỏi này..."}'
```

## PWA

- `manifest.webmanifest` khai báo tên app, theme và icon.
- `service-worker.js` precache shell/visual chính và hỗ trợ mở app khi mạng chập chờn sau lần tải đầu.
- API routes không bị service worker cache.
- Icon `maskable-*` có safe area để Android không cắt mất biểu tượng.

## Social preview

`assets/social-preview.jpg` là ảnh 1200×630 và đã được khai báo trong Open Graph/Twitter metadata. Khi dùng custom domain, đường dẫn tương đối `/assets/social-preview.jpg` sẽ tự đi theo domain hiện tại.

## Kiểm tra nhanh sau deploy

- `/` mở app bình thường.
- `/manifest.webmanifest` trả manifest.
- `/service-worker.js` trả JavaScript và không bị cache dài hạn.
- `/api/health` trả JSON `{ ok: true, ... }`.
- Nếu đã cấu hình API key, POST `/api/reflect` trả `text`.
- Trên mobile, trình duyệt hỗ trợ có thể cài app như PWA.

## Nguyên tắc sản phẩm

Gương Tarot dùng Tarot như **stimulus biểu tượng để phản tư**, không như bằng chứng của một lực lượng siêu nhiên. App giữ quyền phán đoán ở người dùng, tránh tiên tri/định mệnh, đọc tâm trí người khác và chẩn đoán tâm lý/sức khỏe.

## Ghi chú chi phí

Vercel hosting và OpenAI API là hai dịch vụ độc lập. Nếu bật `/api/reflect`, các request tới OpenAI API sử dụng billing của OpenAI API project tương ứng; subscription ChatGPT không thay thế API billing.
