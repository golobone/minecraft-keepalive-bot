@echo off
REM Instalador Completo de Minecraft Bot
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Minecraft Bot - Instalador Automatico
echo ========================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js ya está instalado
    goto :INSTALAR
)

echo Node.js no detectado.
echo.
echo Para instalar automáticamente, necesitas descargar Node.js.
echo.
echo Abriendo navegador para descargar Node.js...
start https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi
echo.
echo 1. Haz click en GUARDAR
echo 2. Espera a que termine la descarga
echo 3. Haz doble click en el archivo descargado (nodejs.msi)
echo 4. Sigue los pasos de instalacion
echo 5. Reinicia tu PC
echo 6. Ejecuta este archivo de nuevo
echo.
pause
exit /b 0

:INSTALAR
echo Instalando dependencias...
call npm install

if %errorlevel% neq 0 (
    echo Error al instalar dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas
echo.
echo Compilando aplicacion (esto puede tomar 1-2 minutos)...
echo.

REM Intentar compilar con pkg
call npm install -g pkg 2>nul

if %errorlevel% equ 0 (
    call npx pkg launcher.js -t win-x64 -o MCBotApp.exe --compress Brotli 2>nul
    
    if %errorlevel% equ 0 (
        echo ✅ Aplicacion compilada exitosamente
        goto :INSTALAR_APP
    )
)

echo.
echo ⚠️  Compilacion de .exe fallida, pero puedo instalar el bot con Node.js
echo.

:INSTALAR_APP
echo Instalando en el sistema...
echo.

if exist "installer-exe.bat" (
    call installer-exe.bat
) else (
    echo Error: No se encontro installer-exe.bat
    pause
    exit /b 1
)

pause
