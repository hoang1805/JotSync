# Hướng dẫn triển khai
## 1. Yêu cầu môi trường
- Node.js >= 16  
- npm hoặc yarn  
- [Ngrok](https://ngrok.com/) (tạo public URL cho backend)  
- Tài khoản:
  - [Jotform](https://www.jotform.com/)  
  - [Bitrix24](https://www.bitrix24.com/)
## 2. Cài đặt môi trường
### 2.1. Node.js
- Tải về và cài đặt Node.js từ [nodejs.org](https://nodejs.org/en/download) (nên dùng bản LTS).  
- Kiểm tra cài đặt:
  ```bash
  node -v
  npm -v
  ```
### 2.2. Ngrok
- Tải về và cài đặt Ngrok từ [ngrok.com](https://ngrok.com/downloads).
- Kiểm tra cài đặt:
```bash
ngrok version
```
- Đăng ký tài khoản Ngrok để lấy Auth Token và chạy lệnh:
```bash
ngrok config add-authtoken <your_auth_token>
```
## 3. Thiết lập tài khoản
### 3.1. Lấy API Key của Jotform
- Bước 1: Đăng nhập [Jotform](https://www.jotform.com/), nếu chưa có, hãy đăng ký.
- Bước 2: Chọn biểu tượng avatar ở góc trên bên phải màn hình, chọn **Settings**.
- Bước 3: Chọn **API**, rồi sau đó sinh ra key mới.
- Bước 4: Thay đổi permission thành Full Access, rồi copy lại.
### 3.2. Lấy webhook URL của Bitrix24
- Bước 1: Đăng nhập vào [Bitrix24](https://www.bitrix24.vn/)
- Bước 2: **Vào Tài nguyên cho nhà phát triển** → **Khác**.
- Bước 3: Chọn **Webhook vào**
- Bước 4: Thiết lập quyền CRM cho webhook
- Bước 5:Copy lại endpoint dạng:
```
https://<your-bitrix24-domain>.bitrix24.com/rest/<user_id>/<webhook_token>/
```
## 4. Triển khai ứng dụng
### 4.1. Clone từ github
```
# Clone project
git clone https://github.com/hoang1805/JotSync.git
cd JotSync

# Cài đặt dependencies
npm install
```
### 4.2. Cấu hình
- Tạo file .env trong thư mục gốc với nội dung có trong file .env.example
```
JOTFORM_API_KEY = YOUR_API_KEY
JOTFORM_URL = https://api.jotform.com

BITRIX24_WEBHOOK_URL = YOUR_WEBHOOK_URL

PORT = 3000
```
### 4.3. Khởi chạy
```
# Chạy server backend
npm start

# Chạy ngrok để tạo public URL
ngrok http 3000
```

- Copy lại public URL của ngrok, ví dụ:
```
https://abc123.ngrok.io
```
### 4.4. Tạo form trên Jotform và gắn webhook
- Vào **Jotform** → **My Forms** → **Tạo form mới**.
- Thêm các field bắt buộc:
  - Full Name (Text)
  - Phone Number (Phone)
  - Email (Email)

- Vào **Settings** → **Integrations** → **Webhook**.
- Dán URL webhook backend vào:
```
https://abc123.ngrok.io/api/webhooks/jotform
```
- Bấm **Complete Integration**.
### 4.5. Hoàn thành
- Giờ bạn đã có thể thử điền form, sau đó vào **Bitrix24 CRM** → **Contacts** để xem contact mới được tạo.
- Bạn có thể xem log trong logs/combined.log và logs/error.log
