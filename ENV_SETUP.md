# Hướng dẫn cấu hình Environment Variables

## Tạo file .env.local

1. **Tạo file `.env.local`** trong thư mục root của project (cùng cấp với `package.json`)

2. **Copy nội dung sau vào file `.env.local`:**

```env
# Database Configuration for MariaDB
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=recap_blog
```

3. **Thay đổi các giá trị phù hợp với cấu hình MariaDB của bạn:**
   - `DB_HOST`: Địa chỉ host của database (thường là `localhost`)
   - `DB_PORT`: Port của database (MariaDB mặc định là `3306`)
   - `DB_USER`: Tên user database (thường là `root`)
   - `DB_PASSWORD`: Mật khẩu database của bạn
   - `DB_NAME`: Tên database (đã tạo từ file `database.sql`)

## Ví dụ cấu hình

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mypassword123
DB_NAME=recap_blog
```

## Lưu ý

- File `.env.local` đã được thêm vào `.gitignore` nên sẽ không bị commit lên Git
- Next.js tự động load các biến môi trường từ file `.env.local`
- Sau khi thay đổi file `.env.local`, cần restart Next.js dev server

## Kiểm tra kết nối

Sau khi cấu hình xong, bạn có thể test kết nối database bằng cách:

1. Tạo file test: `test-db-connection.ts` (tạm thời)
2. Hoặc test qua API: `GET http://localhost:3000/api/categories`

