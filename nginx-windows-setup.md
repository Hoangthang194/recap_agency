# Hướng dẫn cài đặt và cấu hình Nginx cho zerra.blog trên Windows VPS

## Bước 1: Download và cài đặt Nginx cho Windows

1. **Download Nginx cho Windows:**
   - Truy cập: http://nginx.org/en/download.html
   - Tải phiên bản Windows (ví dụ: nginx/Windows-1.x.x)
   - Giải nén vào thư mục (ví dụ: `C:\nginx`)

2. **Cấu trúc thư mục Nginx trên Windows:**
   ```
   C:\nginx\
   ├── conf\
   │   ├── nginx.conf (file cấu hình chính)
   │   └── ...
   ├── html\
   ├── logs\
   └── nginx.exe
   ```

## Bước 2: Cấu hình Nginx

### Cách 1: Sử dụng file nginx.conf đã tạo (Khuyến nghị)

1. Mở file `C:\nginx\conf\nginx.conf` bằng Notepad hoặc trình soạn thảo khác

2. Tìm dòng `http {` và thêm cấu hình site vào trong block `http`:

   ```nginx
   http {
       # ... các cấu hình mặc định ...
       
       # Include file cấu hình site của bạn
       include sites-enabled/*.conf;
       
       # ... hoặc thêm trực tiếp server block vào đây
   }
   ```

3. Tạo thư mục `sites-enabled` trong `C:\nginx\conf\`:
   ```powershell
   mkdir C:\nginx\conf\sites-enabled
   ```

4. Copy file `nginx.conf` (file cấu hình site) vào `C:\nginx\conf\sites-enabled\zerra.blog.conf`

   Hoặc copy nội dung từ file `nginx.conf` và đặt vào trong block `http` của file `C:\nginx\conf\nginx.conf`

### Cách 2: Thêm trực tiếp vào nginx.conf chính

Mở `C:\nginx\conf\nginx.conf` và thêm server block vào cuối block `http {`:

```nginx
http {
    # ... các cấu hình mặc định ...
    
    # Cấu hình cho zerra.blog
    server {
        listen 80;
        server_name zerra.blog www.zerra.blog;
        
        # ... (copy nội dung từ file nginx.conf)
    }
}
```

## Bước 3: Sửa đổi đường dẫn trong nginx.conf (nếu cần)

Trên Windows, đường dẫn SSL certificate sẽ khác. Nếu bạn dùng SSL:

```nginx
# Windows path example
ssl_certificate C:/certificates/zerra.blog/fullchain.pem;
ssl_certificate_key C:/certificates/zerra.blog/privkey.pem;
```

**Lưu ý:** Trên Windows, sử dụng dấu `/` hoặc `\\` cho đường dẫn, không dùng `\`.

## Bước 4: Kiểm tra cấu hình

Mở Command Prompt hoặc PowerShell **với quyền Administrator**:

```powershell
cd C:\nginx
.\nginx.exe -t
```

Nếu thành công, bạn sẽ thấy:
```
nginx: the configuration file C:\nginx/conf/nginx.conf syntax is ok
nginx: configuration file C:\nginx/conf/nginx.conf test is successful
```

## Bước 5: Khởi động Nginx

```powershell
cd C:\nginx
.\nginx.exe
```

Kiểm tra xem Nginx đã chạy chưa:
```powershell
tasklist /fi "imagename eq nginx.exe"
```

## Bước 6: Cấu hình Firewall Windows

1. Mở **Windows Defender Firewall với Advanced Security**
2. Tạo **Inbound Rules** mới:
   - Cho phép port **80** (HTTP)
   - Cho phép port **443** (HTTPS)

Hoặc dùng PowerShell (chạy với quyền Administrator):

```powershell
New-NetFirewallRule -DisplayName "Nginx HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Nginx HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
```

## Bước 7: Cấu hình SSL trên Windows (Tùy chọn)

### Sử dụng Certbot for Windows:

1. Download Certbot từ: https://certbot.eff.org/
2. Hoặc sử dụng Chocolatey:
   ```powershell
   choco install certbot
   ```

3. Chạy Certbot:
   ```powershell
   certbot certonly --standalone -d zerra.blog -d www.zerra.blog
   ```

4. Certificates thường được lưu tại: `C:\Certbot\live\zerra.blog\`

5. Cập nhật đường dẫn trong nginx.conf:
   ```nginx
   ssl_certificate C:/Certbot/live/zerra.blog/fullchain.pem;
   ssl_certificate_key C:/Certbot/live/zerra.blog/privkey.pem;
   ```

## Bước 8: Đảm bảo Next.js đang chạy

Trên Windows, bạn có thể chạy Next.js bằng:

### Cách 1: Chạy trực tiếp
```powershell
npm run build
npm start
# hoặc
node start.js
```

### Cách 2: Sử dụng PM2 (Khuyến nghị)
```powershell
npm install -g pm2
pm2 start npm --name "zerra-blog" -- start
pm2 save
pm2 startup
```

### Cách 3: Chạy như Windows Service

Tạo file `start-nginx-service.bat`:
```batch
@echo off
cd /d C:\nginx
start nginx.exe
```

Tạo file `start-nextjs-service.bat` trong thư mục project:
```batch
@echo off
cd /d C:\Users\Admin\Documents\recap_blog
node start.js
```

## Bước 9: Quản lý Nginx trên Windows

### Khởi động lại Nginx:
```powershell
cd C:\nginx
.\nginx.exe -s reload
```

### Dừng Nginx:
```powershell
cd C:\nginx
.\nginx.exe -s stop
```

### Khởi động lại Nginx:
```powershell
cd C:\nginx
.\nginx.exe -s quit
.\nginx.exe
```

## Bước 10: Tự động khởi động Nginx khi Windows khởi động

### Cách 1: Sử dụng Task Scheduler

1. Mở **Task Scheduler** (taskschd.msc)
2. Tạo **Basic Task** mới
3. Trigger: **When the computer starts**
4. Action: **Start a program**
5. Program: `C:\nginx\nginx.exe`
6. Start in: `C:\nginx`

### Cách 2: Sử dụng NSSM (Non-Sucking Service Manager)

1. Download NSSM: https://nssm.cc/download
2. Chạy lệnh:
   ```powershell
   nssm install nginx "C:\nginx\nginx.exe"
   nssm set nginx AppDirectory "C:\nginx"
   nssm start nginx
   ```

## Kiểm tra

1. Truy cập `http://zerra.blog` từ trình duyệt
2. Kiểm tra log nếu có lỗi:
   - Log file: `C:\nginx\logs\error.log`
   - Access log: `C:\nginx\logs\access.log`

## Lưu ý quan trọng

1. **Domain DNS**: Đảm bảo domain `zerra.blog` đã trỏ A record về IP VPS của bạn
2. **Next.js**: Ứng dụng Next.js phải đang chạy trên port 3000 (localhost)
3. **Firewall**: Đảm bảo port 80 và 443 đã được mở trong Windows Firewall
4. **Quyền Admin**: Một số lệnh cần chạy với quyền Administrator
5. **Đường dẫn**: Trên Windows, sử dụng dấu `/` hoặc `\\` trong nginx.conf, không dùng `\` đơn

## Troubleshooting

### Port 80 đã được sử dụng:
```powershell
# Kiểm tra process nào đang dùng port 80
netstat -ano | findstr :80

# Dừng process (thay PID bằng Process ID thực tế)
taskkill /PID <PID> /F
```

### Nginx không khởi động:
- Kiểm tra log: `C:\nginx\logs\error.log`
- Kiểm tra syntax: `.\nginx.exe -t`
- Đảm bảo đang chạy với quyền Administrator

### 502 Bad Gateway:
- Kiểm tra Next.js có đang chạy: Mở browser và truy cập `http://localhost:3000`
- Kiểm tra firewall Windows không block port 3000

### Nginx tự động dừng:
- Kiểm tra log error
- Có thể cần chạy như Windows Service (dùng NSSM)

