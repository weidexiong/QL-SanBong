@echo off
chcp 65001 > nul
title Football Booking - Khoi dong toan bo he thong

echo ================================================================
echo   HỆ THỐNG QUẢN LÝ ĐẶT LỊCH SÂN BÓNG ĐÁ FULLSTACK
echo ================================================================
echo 1. Dang mo Backend Spring Boot (Port 8080)...
start "Backend (Spring Boot)" cmd /c "%~dp0run-backend.bat"

echo 2. Dang mo Frontend Next.js (Port 3000)...
start "Frontend (Next.js)" cmd /c "%~dp0run-frontend.bat"

echo.
echo ================================================================
echo   KHOI DONG THANH CONG!
echo ================================================================
echo   - Backend:  http://localhost:8080
echo   - Swagger:  http://localhost:8080/swagger-ui.html
echo   - Frontend: http://localhost:3000
echo ================================================================
timeout /t 5
