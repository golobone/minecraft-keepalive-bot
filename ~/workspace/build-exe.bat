@echo off
REM Script para generar el ejecutable .exe de Minecraft Bot

echo.
echo ========================================
echo   Compilador de Minecraft Bot a .exe
echo ========================================
echo.

REM Instalar pkg si no está
npm install --save-dev pkg

echo.
echo Compilando a .exe (esto puede tomar 2-3 minutos)...
echo.

REM Intentar con node18 que está disponible
npx pkg launcher.js -t node18-win-x64 -o MCBotApp.exe --compress Brotli

if errorlevel 1 (
    echo.
    echo Intentando con node20...
    npx pkg launcher.js -t win -o MCBotApp.exe --compress Brotli
)

if errorlevel 1 (
    echo Error durante la compilación
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ ¡Compilación completada!
echo ========================================
echo.
echo Se ha creado: MCBotApp.exe
echo.
pause
