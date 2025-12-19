# API Testing với cURL

## Cấu hình Database

Tạo file `.env.local` trong thư mục root với nội dung:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=recap_blog
```

## Test API tạo Category

### 1. Tạo Category thường (không phải city)

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-category-1",
    "name": "Test Category",
    "icon": "test_icon",
    "image": "https://example.com/image.jpg",
    "colorClass": "bg-blue-500/20",
    "description": "This is a test category"
  }'
```

### 2. Tạo City Category

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-city-1",
    "name": "Test City",
    "icon": "location_city",
    "image": "https://example.com/city.jpg",
    "colorClass": "bg-green-500/20",
    "description": "This is a test city",
    "isCity": true,
    "areaId": "southeast-asia",
    "countryId": "vietnam"
  }'
```

### 3. Lấy danh sách tất cả Categories

```bash
curl -X GET http://localhost:3000/api/categories
```

### 4. Lấy danh sách chỉ Cities

```bash
curl -X GET "http://localhost:3000/api/categories?isCity=true"
```

### 5. Lấy danh sách Categories theo Area

```bash
curl -X GET "http://localhost:3000/api/categories?areaId=southeast-asia"
```

### 6. Lấy danh sách Categories theo Country

```bash
curl -X GET "http://localhost:3000/api/categories?countryId=vietnam"
```

## Response Format

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "test-category-1",
    "name": "Test Category",
    "icon": "test_icon",
    "image": "https://example.com/image.jpg",
    "color_class": "bg-blue-500/20",
    "description": "This is a test category",
    "is_city": false,
    "area_id": null,
    "country_id": null,
    "created_at": "2025-12-19T18:00:00.000Z",
    "updated_at": "2025-12-19T18:00:00.000Z"
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Missing required fields: id, name, icon, image, colorClass are required"
}
```

### Error Response (409 Conflict)

```json
{
  "success": false,
  "error": "Category with ID \"test-category-1\" already exists"
}
```

## Windows PowerShell

Nếu bạn dùng Windows PowerShell, có thể dùng script `test-api.ps1`:

```powershell
.\test-api.ps1
```

Hoặc dùng Invoke-RestMethod:

```powershell
$body = @{
    id = "test-category-1"
    name = "Test Category"
    icon = "test_icon"
    image = "https://example.com/image.jpg"
    colorClass = "bg-blue-500/20"
    description = "This is a test category"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/categories" -Method POST -Body $body -ContentType "application/json"
```

