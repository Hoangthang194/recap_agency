@echo off
REM Batch file to stop Nginx on Windows

cd /d C:\nginx

echo Stopping Nginx...
nginx.exe -s quit

REM Đợi một chút
timeout /t 2 /nobreak >nul

REM Kiểm tra xem nginx đã dừng chưa
tasklist /fi "imagename eq nginx.exe" 2>NUL | find /i /n "nginx.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Nginx is still running. Force stopping...
    taskkill /F /IM nginx.exe
    timeout /t 1 /nobreak >nul
    echo Nginx stopped.
) else (
    echo Nginx stopped successfully.
)

pause

