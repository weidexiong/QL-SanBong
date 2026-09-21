@echo off
chcp 65001 > nul
title Football Booking - Next.js Frontend (Port 3000)

echo ================================================================
echo   ĐANG KHỞI ĐỘNG FRONTEND NEXT.JS (PORT 3000)...
echo ================================================================

cd /d "%~dp0frontend"
npm run dev

pause
