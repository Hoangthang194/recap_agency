# Hướng dẫn cài đặt và cấu hình Nginx cho zerra.blog

## Bước 1: Cài đặt Nginx

### Trên Ubuntu/Debian:
```bash
sudo apt update
sudo apt install nginx -y
```

### Trên CentOS/RHEL:
```bash
sudo yum install nginx -y
# hoặc với dnf
sudo dnf install nginx -y
```

## Bước 2: Copy file cấu hình

```bash
# Copy file cấu hình vào thư mục sites-available
sudo cp nginx.conf /etc/nginx/sites-available/zerra.blog

# Tạo symbolic link đến sites-enabled
sudo ln -s /etc/nginx/sites-available/zerra.blog /etc/nginx/sites-enabled/

# Hoặc copy trực tiếp vào nginx.conf nếu bạn muốn thay thế cấu hình mặc định
# sudo cp nginx.conf /etc/nginx/nginx.conf
```

## Bước 3: Kiểm tra cấu hình

```bash
# Kiểm tra syntax của file cấu hình
sudo nginx -t

# Nếu thành công, bạn sẽ thấy:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

## Bước 4: Khởi động Nginx

```bash
# Khởi động nginx
sudo systemctl start nginx

# Bật tự động khởi động khi boot
sudo systemctl enable nginx

# Kiểm tra trạng thái
sudo systemctl status nginx
```

## Bước 5: Cấu hình Firewall (nếu cần)

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 'Nginx Full'
# hoặc
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Bước 6: Cấu hình SSL với Let's Encrypt (Khuyến nghị)

### Cài đặt Certbot:

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

### Lấy chứng chỉ SSL:

```bash
sudo certbot --nginx -d zerra.blog -d www.zerra.blog
```

Certbot sẽ tự động:
- Tạo chứng chỉ SSL
- Cập nhật file cấu hình nginx
- Thiết lập auto-renewal

### Sau khi có SSL, uncomment các dòng trong nginx.conf:

1. Uncomment server block redirect HTTP to HTTPS (dòng đầu file)
2. Uncomment `listen 443 ssl http2;`
3. Uncomment các dòng SSL configuration

## Bước 7: Đảm bảo Next.js đang chạy

```bash
# Build ứng dụng Next.js (nếu chưa build)
npm run build

# Chạy ứng dụng trên port 3000
npm start
# hoặc
node start.js

# Hoặc sử dụng PM2 để quản lý process (khuyến nghị cho production)
npm install -g pm2
pm2 start npm --name "zerra-blog" -- start
pm2 save
pm2 startup
```

## Bước 8: Reload Nginx

Sau khi thay đổi cấu hình:

```bash
sudo nginx -t  # Kiểm tra lại
sudo systemctl reload nginx  # Reload cấu hình
# hoặc
sudo systemctl restart nginx  # Restart nginx
```

## Kiểm tra

1. Truy cập `http://zerra.blog` (hoặc `https://zerra.blog` nếu đã cấu hình SSL)
2. Kiểm tra log nginx nếu có lỗi:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/access.log
   ```

## Lưu ý quan trọng

1. **Domain DNS**: Đảm bảo domain `zerra.blog` đã trỏ A record về IP server của bạn
2. **Next.js**: Ứng dụng Next.js phải đang chạy trên port 3000
3. **Firewall**: Đảm bảo port 80 và 443 đã được mở
4. **SSL**: Nên sử dụng HTTPS trong production (Let's Encrypt miễn phí)

## Troubleshooting

### Nginx không khởi động:
- Kiểm tra log: `sudo journalctl -xe`
- Kiểm tra syntax: `sudo nginx -t`

### 502 Bad Gateway:
- Kiểm tra Next.js có đang chạy: `curl http://localhost:3000`
- Kiểm tra port 3000 có bị block không

### 403 Forbidden:
- Kiểm tra quyền thư mục: `sudo chown -R www-data:www-data /path/to/your/app`
- Kiểm tra SELinux (nếu dùng CentOS/RHEL)

