@echo off
REM Batch file to start Nginx on Windows
REM Thay đổi đường dẫn nếu bạn cài nginx ở thư mục khác

cd /d C:\nginx

REM Kiểm tra xem nginx đã chạy chưa
tasklist /fi "imagename eq nginx.exe" 2>NUL | find /i /n "nginx.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Nginx is already running!
    pause
    exit /b
)

REM Kiểm tra cấu hình trước khi khởi động
nginx.exe -t
if errorlevel 1 (
    echo Configuration test failed! Please check your nginx.conf
    pause
    exit /b 1
)

REM Khởi động nginx
echo Starting Nginx...
start nginx.exe

REM Đợi một chút và kiểm tra
timeout /t 2 /nobreak >nul
tasklist /fi "imagename eq nginx.exe" 2>NUL | find /i /n "nginx.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Nginx started successfully!
) else (
    echo Failed to start Nginx. Check error.log
)

pause

