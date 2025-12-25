#!/bin/bash

# Test API tạo danh mục mới
# Sử dụng: bash test-api.sh hoặc chmod +x test-api.sh && ./test-api.sh

BASE_URL="http://localhost:3000"

echo "🧪 Testing Category API..."
echo ""

# Test 1: Tạo category thường (không phải city)
echo "📝 Test 1: Tạo category thường"
curl -X POST "${BASE_URL}/api/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-category-1",
    "name": "Test Category",
    "icon": "test_icon",
    "image": "https://example.com/image.jpg",
    "colorClass": "bg-blue-500/20",
    "description": "This is a test category"
  }' | jq '.'

echo ""
echo "---"
echo ""

# Test 2: Tạo city category
echo "📝 Test 2: Tạo city category"
curl -X POST "${BASE_URL}/api/categories" \
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
  }' | jq '.'

echo ""
echo "---"
echo ""

# Test 3: Lấy danh sách tất cả categories
echo "📋 Test 3: Lấy danh sách tất cả categories"
curl -X GET "${BASE_URL}/api/categories" | jq '.'

echo ""
echo "---"
echo ""

# Test 4: Lấy danh sách chỉ cities
echo "🏙️  Test 4: Lấy danh sách chỉ cities"
curl -X GET "${BASE_URL}/api/categories?isCity=true" | jq '.'

echo ""
echo "---"
echo ""

# Test 5: Lấy danh sách categories theo area
echo "🌏 Test 5: Lấy danh sách categories theo area"
curl -X GET "${BASE_URL}/api/categories?areaId=southeast-asia" | jq '.'

echo ""
echo "✅ Testing completed!"

