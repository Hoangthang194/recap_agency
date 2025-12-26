# API Testing Guide - Update Post Content

## Endpoint: PATCH /api/posts/[id]

Endpoint này cho phép cập nhật một phần của post, đặc biệt hữu ích cho việc chỉ update content mà không cần gửi tất cả các field khác.

### Base URL
```
http://localhost:3000/api/posts/{id}
```

## CURL Commands để test với Postman

### 1. Update chỉ Content

```bash
curl -X PATCH "http://localhost:3000/api/posts/1" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "<h1>Updated Content</h1><p>This is the new content of the post.</p>"
  }'
```

### 2. Update Content và Title

```bash
curl -X PATCH "http://localhost:3000/api/posts/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "<h1>New Content</h1><p>Updated content here.</p>"
  }'
```

### 3. Update Content với HTML phức tạp

```bash
curl -X PATCH "http://localhost:3000/api/posts/1" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "<div><h2>Section 1</h2><p>Paragraph 1</p><h3>Subsection</h3><p>More content</p></div>"
  }'
```

### 4. Update Content từ file

```bash
curl -X PATCH "http://localhost:3000/api/posts/1" \
  -H "Content-Type: application/json" \
  -d @content.json
```

Với file `content.json`:
```json
{
  "content": "<h1>Content from file</h1><p>This content was loaded from a JSON file.</p>"
}
```

### 5. Update nhiều fields cùng lúc

```bash
curl -X PATCH "http://localhost:3000/api/posts/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Title",
    "excerpt": "New excerpt",
    "content": "<h1>New Content</h1>",
    "readTime": 5
  }'
```

## Postman Collection

### Request Setup:
1. **Method**: PATCH
2. **URL**: `http://localhost:3000/api/posts/{id}`
   - Thay `{id}` bằng ID thực tế của post (ví dụ: `1`, `post-1`, etc.)
3. **Headers**:
   ```
   Content-Type: application/json
   ```
4. **Body** (raw JSON):
   ```json
   {
     "content": "<h1>Your HTML content here</h1>"
   }
   ```

### Example Request Body:

**Minimal (chỉ content):**
```json
{
  "content": "<h1>Updated Content</h1><p>This is updated.</p>"
}
```

**Full example với nhiều fields:**
```json
{
  "title": "Updated Post Title",
  "excerpt": "Updated excerpt",
  "content": "<div><h2>Main Heading</h2><p>Content paragraph</p></div>",
  "readTime": 10,
  "thumbnail": "https://example.com/new-thumbnail.jpg"
}
```

## Response Examples

### Success Response (200):
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": "1",
    "title": "Post Title",
    "content": "<h1>Updated Content</h1>",
    "excerpt": "Post excerpt",
    "image": "https://example.com/image.jpg",
    "thumbnail": "https://example.com/thumb.jpg",
    "category_id": "tech",
    "author_id": "author-1",
    "date": "Aug 8, 2025",
    "read_time": 5,
    "slug": "post-slug",
    "author_name": "Author Name",
    "author_avatar": "https://example.com/avatar.jpg"
  }
}
```

### Error Responses:

**404 - Post not found:**
```json
{
  "success": false,
  "error": "Post with ID \"1\" not found"
}
```

**400 - No fields provided:**
```json
{
  "success": false,
  "error": "No fields provided to update"
}
```

**409 - Slug already exists:**
```json
{
  "success": false,
  "error": "Post with slug \"existing-slug\" already exists"
}
```

**500 - Server error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Testing với Postman

### Step-by-step:

1. **Tạo Request mới**:
   - Click "New" → "HTTP Request"

2. **Cấu hình Request**:
   - Method: Chọn `PATCH`
   - URL: Nhập `http://localhost:3000/api/posts/1` (thay `1` bằng ID thực tế)

3. **Thêm Headers**:
   - Key: `Content-Type`
   - Value: `application/json`

4. **Thêm Body**:
   - Chọn tab "Body"
   - Chọn "raw"
   - Chọn "JSON" từ dropdown
   - Paste JSON:
     ```json
     {
       "content": "<h1>Test Content</h1><p>This is a test update.</p>"
     }
     ```

5. **Send Request**:
   - Click "Send"
   - Xem response trong phần Response

## Lưu ý

1. **ID Format**: Đảm bảo ID đúng format (có thể là số hoặc string tùy database)
2. **Content Format**: Content phải là HTML string
3. **Partial Update**: Chỉ cần gửi các field muốn update, không cần gửi tất cả
4. **Validation**: 
   - Nếu update `category`, category phải tồn tại
   - Nếu update `author`, author phải tồn tại
   - Nếu update `slug`, slug không được trùng với post khác

## So sánh với PUT endpoint

- **PUT `/api/posts/[id]`**: Yêu cầu tất cả các field bắt buộc
- **PATCH `/api/posts/[id]`**: Chỉ cần gửi các field muốn update (partial update)

PATCH phù hợp hơn khi chỉ muốn update content mà không cần gửi lại toàn bộ dữ liệu.

