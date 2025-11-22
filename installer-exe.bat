@echo off
REM Instalador del .exe compilado de Minecraft Bot
REM Este script instala MCBotApp.exe en el menú Inicio

echo.
echo ========================================
echo   Minecraft Bot App - Instalador EXE
echo ========================================
echo.

REM Verificar si es administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Error: Este instalador requiere permisos de administrador.
    echo Por favor, click derecho y selecciona "Ejecutar como administrador"
    pause
    exit /b 1
)

if not exist "MCBotApp.exe" (
    echo Error: MCBotApp.exe no encontrado.
    echo.
    echo Por favor, primero ejecuta: build-exe.bat
    pause
    exit /b 1
)

setlocal enabledelayedexpansion

set INSTALL_DIR=%ProgramFiles%\MinecraftBotApp
set SHORTCUT_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs
set DESKTOP=%USERPROFILE%\Desktop

echo Instalando en: %INSTALL_DIR%
echo.

REM Crear directorio
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

REM Copiar .exe
echo Copiando ejecutable...
copy "MCBotApp.exe" "%INSTALL_DIR%\MCBotApp.exe" >nul

if errorlevel 1 (
    echo Error al copiar el ejecutable
    pause
    exit /b 1
)

REM Copiar archivos necesarios
echo Copiando archivos de configuración...
if exist ".env" copy ".env" "%INSTALL_DIR%\.env" >nul
if exist "src" xcopy /E /I /Y "src" "%INSTALL_DIR%\src" >nul 2>&1

REM Crear acceso directo en Inicio
echo Creando acceso directo en Menú Inicio...
set VBSCRIPT="%INSTALL_DIR%\create-shortcut.vbs"
(
    echo Set oWS = WScript.CreateObject("WScript.Shell"^)
    echo sLinkFile = "%SHORTCUT_DIR%\Minecraft Bot App.lnk"
    echo Set oLink = oWS.CreateShortcut(sLinkFile^)
    echo oLink.TargetPath = "%INSTALL_DIR%\MCBotApp.exe"
    echo oLink.WorkingDirectory = "%INSTALL_DIR%"
    echo oLink.IconLocation = "%INSTALL_DIR%\MCBotApp.exe,0"
    echo oLink.Save
) > !VBSCRIPT!

cscript.exe !VBSCRIPT! >nul 2>&1
del !VBSCRIPT!

REM Crear acceso directo en Escritorio
echo Creando acceso directo en Escritorio...
set DESKTOP_VBS="%INSTALL_DIR%\create-desktop-shortcut.vbs"
(
    echo Set oWS = WScript.CreateObject("WScript.Shell"^)
    echo sLinkFile = "%DESKTOP%\Minecraft Bot App.lnk"
    echo Set oLink = oWS.CreateShortcut(sLinkFile^)
    echo oLink.TargetPath = "%INSTALL_DIR%\MCBotApp.exe"
    echo oLink.WorkingDirectory = "%INSTALL_DIR%"
    echo oLink.IconLocation = "%INSTALL_DIR%\MCBotApp.exe,0"
    echo oLink.Save
) > !DESKTOP_VBS!

cscript.exe !DESKTOP_VBS! >nul 2>&1
del !DESKTOP_VBS!

REM Crear desinstalador local
set UNINSTALL_SCRIPT="%INSTALL_DIR%\uninstall-app.bat"
(
    echo @echo off
    echo setlocal enabledelayedexpansion
    echo set INSTALL_DIR=%ProgramFiles%\MinecraftBotApp
    echo set SHORTCUT_DIR=%%APPDATA%%\Microsoft\Windows\Start Menu\Programs
    echo set DESKTOP=%%USERPROFILE%%\Desktop
    echo echo.
    echo echo Desinstalando Minecraft Bot App...
    echo if exist "%%SHORTCUT_DIR%%\Minecraft Bot App.lnk" del "%%SHORTCUT_DIR%%\Minecraft Bot App.lnk"
    echo if exist "%%DESKTOP%%\Minecraft Bot App.lnk" del "%%DESKTOP%%\Minecraft Bot App.lnk"
    echo if exist "%%INSTALL_DIR%%" rmdir /s /q "%%INSTALL_DIR%%"
    echo echo ✅ Desinstalación completada
    echo pause
) > !UNINSTALL_SCRIPT!

echo.
echo ========================================
echo   ✅ ¡Instalación completada!
echo ========================================
echo.
echo La aplicación está instalada en:
echo   %INSTALL_DIR%
echo.
echo Puedes ejecutarla desde:
echo   1. Menú Inicio - "Minecraft Bot App"
echo   2. Escritorio - "Minecraft Bot App"
echo.
echo Para desinstalar:
echo   Click derecho en uninstall-app.bat en la carpeta de instalación
echo.
pause
