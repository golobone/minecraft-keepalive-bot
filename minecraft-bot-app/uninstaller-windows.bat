@echo off
REM Desinstalador de Minecraft Keepalive Bot para Windows

echo.
echo ========================================
echo   Minecraft Keepalive Bot - Desinstalador
echo ========================================
echo.

REM Verificar si es administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Error: Este desinstalador requiere permisos de administrador.
    echo Por favor, click derecho en el archivo y selecciona "Ejecutar como administrador"
    pause
    exit /b 1
)

setlocal enabledelayedexpansion

set INSTALL_DIR=%ProgramFiles%\MinecraftBotApp
set SHORTCUT_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs
set DESKTOP=%USERPROFILE%\Desktop

echo.
echo Esto eliminará:
echo   - Carpeta de instalación: %INSTALL_DIR%
echo   - Acceso directo en Inicio
echo   - Acceso directo en Escritorio
echo.

set /p CONFIRM="¿Deseas continuar? (s/n): "
if /i not "%CONFIRM%"=="s" (
    echo Desinstalación cancelada.
    pause
    exit /b 0
)

echo.
echo Desinstalando...

REM Eliminar acceso directo del menú Inicio
if exist "%SHORTCUT_DIR%\Minecraft Bot App.lnk" (
    del "%SHORTCUT_DIR%\Minecraft Bot App.lnk"
    echo ✅ Eliminado acceso directo del menú Inicio
)

REM Eliminar acceso directo del escritorio
if exist "%DESKTOP%\Minecraft Bot App.lnk" (
    del "%DESKTOP%\Minecraft Bot App.lnk"
    echo ✅ Eliminado acceso directo del escritorio
)

REM Eliminar carpeta de instalación
if exist "%INSTALL_DIR%" (
    rmdir /s /q "%INSTALL_DIR%"
    echo ✅ Eliminada carpeta de instalación
)

echo.
echo ========================================
echo   ✅ Desinstalación completada!
echo ========================================
echo.
pause
