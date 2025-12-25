# PowerShell script để test API tạo danh mục mới
# Sử dụng: .\test-api.ps1

$baseUrl = "http://localhost:3000"

Write-Host "🧪 Testing Category API..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Tạo category thường (không phải city)
Write-Host "📝 Test 1: Tạo category thường" -ForegroundColor Yellow
$body1 = @{
    id = "test-category-1"
    name = "Test Category"
    icon = "test_icon"
    image = "https://example.com/image.jpg"
    colorClass = "bg-blue-500/20"
    description = "This is a test category"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "$baseUrl/api/categories" -Method POST -Body $body1 -ContentType "application/json"
    $response1 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    $_.Exception.Response | Format-List
}

Write-Host ""
Write-Host "---"
Write-Host ""

# Test 2: Tạo city category
Write-Host "📝 Test 2: Tạo city category" -ForegroundColor Yellow
$body2 = @{
    id = "test-city-1"
    name = "Test City"
    icon = "location_city"
    image = "https://example.com/city.jpg"
    colorClass = "bg-green-500/20"
    description = "This is a test city"
    isCity = $true
    areaId = "southeast-asia"
    countryId = "vietnam"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "$baseUrl/api/categories" -Method POST -Body $body2 -ContentType "application/json"
    $response2 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    $_.Exception.Response | Format-List
}

Write-Host ""
Write-Host "---"
Write-Host ""

# Test 3: Lấy danh sách tất cả categories
Write-Host "📋 Test 3: Lấy danh sách tất cả categories" -ForegroundColor Yellow
try {
    $response3 = Invoke-RestMethod -Uri "$baseUrl/api/categories" -Method GET
    $response3 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "---"
Write-Host ""

# Test 4: Lấy danh sách chỉ cities
Write-Host "🏙️  Test 4: Lấy danh sách chỉ cities" -ForegroundColor Yellow
try {
    $response4 = Invoke-RestMethod -Uri "$baseUrl/api/categories?isCity=true" -Method GET
    $response4 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "---"
Write-Host ""

# Test 5: Lấy danh sách categories theo area
Write-Host "🌏 Test 5: Lấy danh sách categories theo area" -ForegroundColor Yellow
try {
    $response5 = Invoke-RestMethod -Uri "$baseUrl/api/categories?areaId=southeast-asia" -Method GET
    $response5 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Testing completed!" -ForegroundColor Green

