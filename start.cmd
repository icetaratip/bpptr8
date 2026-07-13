@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ================================
echo  ค่ายศรีนครินทรา - Landing Page
echo ================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] ยังไม่พบ Node.js
  echo ติดตั้งจาก https://nodejs.org/ แล้วรันไฟล์นี้อีกครั้ง
  echo.
  pause
  exit /b 1
)

echo [1/3] ติดตั้งแพ็กเกจ... npm install
call npm install
if errorlevel 1 (
  echo.
  echo [ERROR] npm install ล้มเหลว
  pause
  exit /b 1
)

echo.
echo [2/3] เปิด News API ที่ http://localhost:8787
echo [3/3] เปิดเว็บที่ http://localhost:5174/
echo กด Ctrl+C เพื่อหยุด
echo.
call npm run dev

pause
