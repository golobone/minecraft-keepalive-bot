@echo off
REM Instalador de Minecraft Keepalive Bot para Windows
REM Este script requiere permisos de administrador

echo.
echo ========================================
echo   Minecraft Keepalive Bot - Instalador
echo ========================================
echo.

REM Verificar si es administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Error: Este instalador requiere permisos de administrador.
    echo Por favor, click derecho en el archivo y selecciona "Ejecutar como administrador"
    pause
    exit /b 1
)

setlocal enabledelayedexpansion

REM Definir rutas
set INSTALL_DIR=%ProgramFiles%\MinecraftBotApp
set APP_DIR=%cd%
set SHORTCUT_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs

echo Instalando en: %INSTALL_DIR%
echo.

REM Crear directorio de instalación
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

REM Copiar archivos
echo Copiando archivos...
xcopy /E /I /Y "%APP_DIR%\*" "%INSTALL_DIR%" >nul 2>&1

if errorlevel 1 (
    echo Error al copiar archivos
    pause
    exit /b 1
)

REM Crear acceso directo en el menú Inicio
echo Creando acceso directo...

set VBSCRIPT="%INSTALL_DIR%\create-shortcut.vbs"

(
    echo Set oWS = WScript.CreateObject("WScript.Shell"^)
    echo sLinkFile = "%SHORTCUT_DIR%\Minecraft Bot App.lnk"
    echo Set oLink = oWS.CreateShortcut(sLinkFile^)
    echo oLink.TargetPath = "%INSTALL_DIR%\launcher.js"
    echo oLink.Arguments = ""
    echo oLink.WorkingDirectory = "%INSTALL_DIR%"
    echo oLink.IconLocation = "cmd.exe,0"
    echo oLink.Save
) > !VBSCRIPT!

cscript.exe !VBSCRIPT! >nul 2>&1
del !VBSCRIPT!

REM Crear script para ejecutar desde PowerShell
set POWERSHELL_SCRIPT="%INSTALL_DIR%\run.ps1"
(
    echo cd "%INSTALL_DIR%"
    echo node launcher.js
) > !POWERSHELL_SCRIPT!

REM Crear batch para ejecutar fácilmente
set BATCH_SCRIPT="%INSTALL_DIR%\run.bat"
(
    echo @echo off
    echo cd /d "%INSTALL_DIR%"
    echo node launcher.js
    echo pause
) > !BATCH_SCRIPT!

REM Crear batch para desinstalar
set UNINSTALL_SCRIPT="%INSTALL_DIR%\uninstall.bat"
(
    echo @echo off
    echo REM Desinstalador local
    echo setlocal enabledelayedexpansion
    echo set INSTALL_DIR=%ProgramFiles%\MinecraftBotApp
    echo set SHORTCUT_DIR=%%APPDATA%%\Microsoft\Windows\Start Menu\Programs
    echo set DESKTOP=%%USERPROFILE%%\Desktop
    echo echo.
    echo echo Desinstalando Minecraft Bot App...
    echo if exist "%%SHORTCUT_DIR%%\Minecraft Bot App.lnk" del "%%SHORTCUT_DIR%%\Minecraft Bot App.lnk"
    echo if exist "%%DESKTOP%%\Minecraft Bot App.lnk" del "%%DESKTOP%%\Minecraft Bot App.lnk"
    echo if exist "%%INSTALL_DIR%%" rmdir /s /q "%%INSTALL_DIR%%"
    echo echo ✅ Desinstalacion completada
    echo pause
) > !UNINSTALL_SCRIPT!

REM Crear acceso directo en el escritorio también
set DESKTOP_SHORTCUT_VBS="%INSTALL_DIR%\create-desktop-shortcut.vbs"
(
    echo Set oWS = WScript.CreateObject("WScript.Shell"^)
    echo sLinkFile = "%USERPROFILE%\Desktop\Minecraft Bot App.lnk"
    echo Set oLink = oWS.CreateShortcut(sLinkFile^)
    echo oLink.TargetPath = "%INSTALL_DIR%\run.bat"
    echo oLink.WorkingDirectory = "%INSTALL_DIR%"
    echo oLink.IconLocation = "cmd.exe,0"
    echo oLink.Save
) > !DESKTOP_SHORTCUT_VBS!

cscript.exe !DESKTOP_SHORTCUT_VBS! >nul 2>&1
del !DESKTOP_SHORTCUT_VBS!

echo.
echo ========================================
echo   ✅ Instalación completada!
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
echo   1. Click derecho en "uninstall.bat" en la carpeta de instalación
echo   2. O busca "uninstall.bat" en: %INSTALL_DIR%
echo.
pause
