# API Debug Guide - PATCH /api/posts/[id]

## Vấn đề: 404 Not Found

Khi gặp lỗi 404 với PATCH endpoint, có thể do:

### 1. Post không tồn tại
- Post với ID đó không có trong database
- Kiểm tra: Gọi GET `/api/posts/{id}` để xem post có tồn tại không

### 2. Post bị soft-deleted
- Post tồn tại nhưng `is_deleted = 1`
- Response sẽ có thông báo: "Post has been deleted"

### 3. ID không đúng format
- Kiểm tra ID có đúng không (có thể là số hoặc string tùy database)

## Cách Debug

### Bước 1: Kiểm tra post có tồn tại không

```bash
# GET request để kiểm tra
curl -X GET "http://localhost:3000/api/posts/post-barcelona-001"
```

**Response nếu tồn tại:**
```json
{
  "success": true,
  "data": {
    "id": "post-barcelona-001",
    "title": "...",
    ...
  }
}
```

**Response nếu không tồn tại:**
```json
{
  "success": false,
  "error": "Post not found"
}
```

### Bước 2: Kiểm tra tất cả posts

```bash
curl -X GET "http://localhost:3000/api/posts"
```

Xem danh sách tất cả posts để tìm ID đúng.

### Bước 3: Kiểm tra logs

Server logs sẽ hiển thị:
- `[PATCH] Post with ID "..." does not exist in database` - Post không tồn tại
- `[PATCH] Post with ID "..." is soft-deleted` - Post bị xóa

### Bước 4: Test với ID hợp lệ

Sau khi tìm được ID đúng, test lại:

```bash
curl -X PATCH "http://localhost:3000/api/posts/{correct-id}" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "<h1>Test Content</h1>"
  }'
```

## Error Messages

### 404 - Post not found
```json
{
  "success": false,
  "error": "Post with ID \"post-barcelona-001\" not found",
  "debug": {
    "id": "post-barcelona-001",
    "message": "Post does not exist in database"
  }
}
```

### 404 - Post soft-deleted
```json
{
  "success": false,
  "error": "Post with ID \"post-barcelona-001\" has been deleted",
  "debug": {
    "id": "post-barcelona-001",
    "message": "Post exists but is soft-deleted"
  }
}
```

## SQL Query để kiểm tra trực tiếp

Nếu có quyền truy cập database:

```sql
-- Kiểm tra post có tồn tại không
SELECT id, title, is_deleted FROM posts WHERE id = 'post-barcelona-001';

-- Xem tất cả posts
SELECT id, title, is_deleted FROM posts ORDER BY id;

-- Tìm posts có ID tương tự
SELECT id, title FROM posts WHERE id LIKE '%barcelona%';
```

## Giải pháp

1. **Nếu post không tồn tại**: Tạo post mới trước bằng POST `/api/posts`
2. **Nếu post bị soft-deleted**: Có thể restore bằng cách update `is_deleted = 0` (nếu cần)
3. **Nếu ID sai**: Sử dụng GET `/api/posts` để tìm ID đúng

