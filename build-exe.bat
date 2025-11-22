@echo off
REM Script para generar el ejecutable .exe de Minecraft Bot
REM Este script requiere que npm esté instalado

echo.
echo ========================================
echo   Compilador de Minecraft Bot a .exe
echo ========================================
echo.

REM Verificar si npm está instalado
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm no está instalado.
    echo Por favor, instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo Instalando dependencias de compilación...
call npm install --save-dev pkg

if errorlevel 1 (
    echo Error al instalar pkg
    pause
    exit /b 1
)

echo.
echo Compilando a .exe (esto puede tomar 1-2 minutos)...
echo.

call npx pkg launcher.js -t win-x64 -o MCBotApp.exe --compress Brotli

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
echo Ahora tienes dos opciones:
echo   1. Ejecutar directamente: MCBotApp.exe (funcionará desde cualquier lado)
echo   2. Crear acceso directo en tu escritorio
echo   3. Usar installer-windows.bat para instalarlo en Inicio
echo.
pause
