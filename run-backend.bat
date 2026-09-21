@echo off
chcp 65001 > nul
title Football Booking - Spring Boot Backend (Port 8080)

echo ================================================================
echo   ĐANG KHỞI ĐỘNG BACKEND SPRING BOOT (PORT 8080)...
echo ================================================================

REM Thiết lập Java 17 nếu có trong máy
if exist "C:\Program Files\Java\jdk-17" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-17"
    set "Path=C:\Program Files\Java\jdk-17\bin;%Path%"
)

REM Tìm lệnh Maven
set "MVN_CMD=mvn"
if not exist "%JAVA_HOME%" where mvn >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\laragon\bin\apache-maven-3.9.9\bin\mvn.cmd" (
        set "MVN_CMD=C:\laragon\bin\apache-maven-3.9.9\bin\mvn.cmd"
    )
)

cd /d "%~dp0backend"
%MVN_CMD% spring-boot:run

pause
