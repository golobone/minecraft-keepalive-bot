@echo off
REM Instalador Completo de Minecraft Bot - Descarga Node.js si lo necesita
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Minecraft Bot - Instalador Automatico
echo ========================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js no detectado. Descargando e instalando...
    echo.
    
    REM Descargar Node.js LTS
    powershell -Command "(New-Object System.Net.ServicePointManager).SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; (New-Object System.Net.WebClient).DownloadFile('https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi', '%TEMP%\nodejs.msi')"
    
    if errorlevel 1 (
        echo Error: No se pudo descargar Node.js
        echo Por favor, instala Node.js manualmente desde https://nodejs.org/
        pause
        exit /b 1
    )
    
    echo Instalando Node.js...
    msiexec /i "%TEMP%\nodejs.msi" /quiet /norestart
    
    echo.
    echo Node.js instalado. Reinicia PowerShell y ejecuta este archivo de nuevo.
    pause
    exit /b 0
)

echo ✅ Node.js detectado
node --version
echo.

REM Ya tenemos Node.js, proceder con npm install
echo Instalando dependencias...
call npm install

if errorlevel 1 (
    echo Error al instalar dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas
echo.

REM Compilar .exe
echo Compilando aplicacion (.exe)...
echo Esto puede tomar 1-2 minutos...
echo.

call npm run build:windows

if errorlevel 1 (
    echo Compilacion fallida. Intentando alternativa...
    
    REM Alternativa si pkg falla
    echo Usando metodo alternativo...
    powershell -Command "cd '%cd%' ; npm install -g pkg ; pkg launcher.js -t win-x64 -o MCBotApp.exe --compress Brotli"
    
    if errorlevel 1 (
        echo Error: No se pudo compilar el .exe
        echo Pero puedes ejecutar el bot con: npm run launcher
        pause
        exit /b 1
    )
)

echo ✅ Aplicacion compilada: MCBotApp.exe
echo.

REM Instalar
echo Instalando en el sistema...
if exist "installer-exe.bat" (
    call installer-exe.bat
) else (
    echo Error: No se encontro installer-exe.bat
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ ¡INSTALACION COMPLETADA!
echo ========================================
echo.
echo Busca "Minecraft Bot App" en tu menu Inicio
echo.
pause
