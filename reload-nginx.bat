@echo off
REM Batch file to reload Nginx configuration on Windows

cd /d C:\nginx

REM Kiểm tra cấu hình trước khi reload
echo Testing configuration...
nginx.exe -t
if errorlevel 1 (
    echo Configuration test failed! Please check your nginx.conf
    pause
    exit /b 1
)

REM Reload cấu hình
echo Reloading Nginx configuration...
nginx.exe -s reload

if errorlevel 1 (
    echo Failed to reload Nginx. Check error.log
) else (
    echo Nginx configuration reloaded successfully!
)

pause

