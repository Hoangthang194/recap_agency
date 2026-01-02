# Hướng dẫn Deploy Next.js với PM2 (Production Mode)

## Vấn đề: Chữ "N" xuất hiện ở góc màn hình

Chữ "N" là logo của Next.js development mode. Để loại bỏ nó, bạn cần chạy ứng dụng ở **production mode**.

## Các bước deploy đúng cách:

### 1. Build ứng dụng cho production

```bash
# Trên VPS, trong thư mục project
npm run build
```

### 2. Dừng PM2 process hiện tại (nếu có)

```bash
pm2 stop recap-blog
pm2 delete recap-blog
```

### 3. Khởi động lại với PM2 (Production Mode)

**Cách 1: Sử dụng file ecosystem.config.js (Khuyến nghị)**

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Cách 2: Chạy trực tiếp với PM2**

```bash
NODE_ENV=production pm2 start npm --name "recap-blog" -- start
pm2 save
pm2 startup
```

### 4. Kiểm tra

```bash
# Xem logs
pm2 logs recap-blog

# Xem trạng thái
pm2 status

# Kiểm tra NODE_ENV
pm2 env 0
```

## Lưu ý quan trọng:

1. **Luôn build trước khi start**: `npm run build` phải được chạy trước `npm start`
2. **Đảm bảo NODE_ENV=production**: PM2 sẽ tự động set biến này khi dùng ecosystem.config.js
3. **Không chạy `npm run dev`**: Đây là development mode, sẽ hiển thị chữ "N"
4. **Restart sau khi build**: Nếu bạn build lại, cần restart PM2:
   ```bash
   pm2 restart recap-blog
   ```

## Troubleshooting:

### Nếu vẫn thấy chữ "N":

1. Kiểm tra NODE_ENV:
   ```bash
   pm2 env 0 | grep NODE_ENV
   ```
   Phải là `NODE_ENV=production`

2. Kiểm tra script đang chạy:
   ```bash
   pm2 describe recap-blog
   ```
   Phải thấy `npm start` hoặc `next start`, KHÔNG phải `next dev`

3. Xóa cache và build lại:
   ```bash
   rm -rf .next
   npm run build
   pm2 restart recap-blog
   ```

### Nếu gặp lỗi khi build:

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
npm run build
```

