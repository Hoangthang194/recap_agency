# BD – Homepage

## 1. Purpose
Mô tả nghiệp vụ và chức năng của Homepage:

## 2. Functional Requirements
| Feature | Description | Business Rule |
|---------|-------------|---------------|
| Menu Header | Hiển thị menu chính, dropdown khu vực/thành phố | Khi chọn city, chuyển tới trang travel theo city |
| Banner | Hiển thị hình ảnh slider | Banner phải hiển thị theo priority (admin có thể set) |
| Travel Destinations | Hiển thị danh sách destination nổi bật | Lấy top destinations từ API theo rating/popularity |
| Latest Posts | Hiển thị bài viết mới nhất | Lọc bài viết theo category (AI, Tech, Travel) |
| Footer | Thông tin liên hệ và social | Luôn hiển thị ở cuối trang, responsive |

## 3. Business Rules
1. Người dùng có thể click menu -> dropdown -> chọn city để filter.
2. Banner tự động chuyển ảnh mỗi 5s.
3. Travel destinations và posts phải load từ API.
4. Nếu API lỗi, hiển thị placeholder “Data not available”.
