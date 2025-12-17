Header Menu
│
├─ Home
│
├─ Travel
│   ├─ Asia
│   │   ├─ Vietnam
│   │   └─ Korea
│   ├─ Europe
│   │   ├─ France
│   │   └─ Germany
│   └─ (Các khu vực khác...)
│
├─ Posts
│   ├─ Travel
│   ├─ AI
│   ├─ Tech
│   └─ (Các category khác...)
│
├─ About
│
└─ Contact

# UI – Homepage

## 1. Purpose
Mô tả giao diện của trang Homepage:
- Hiển thị hero banner, danh sách travel destinations, bài viết nổi bật.
- Menu header với dropdown khu vực và thành phố.
- Footer với thông tin liên hệ và social links.

## 2. Layout
### Header
- Menu chính: Home, Travel, Posts, About, Contact
- Dropdown Travel: Khu vực -> Thành phố
- Responsive: desktop và mobile

### Banner
- Slider full-width
- Auto-play, arrow navigation

### Featured Sections
- Travel Destinations: card-based layout, hover effect
- Latest Posts: hiển thị 3-5 bài viết mới, theo category AI, Tech, Travel

### Footer
- 3 columns: contact info, quick links, social icons

## 3. Performance Requirements
- Load < 2s
- Banner lazy-load
- Optimize image sizes

## 4. Accessibility
- ARIA labels cho menu dropdown
- Keyboard navigation
- WCAG contrast chuẩn

## 5. Interactions
- Hover dropdown menu
- Click card dẫn tới detail page
- Responsive layout thay đổi theo viewport
