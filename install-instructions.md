# 🎮 Instalación de Minecraft Bot App

## Windows (Recomendado)

### Opción 1: Instalador .EXE Compilado (MEJOR - SIN NODE.JS REQUERIDO)

1. **Descarga el proyecto** desde Replit (Download → ZIP)
2. **Extrae la carpeta** en tu PC
3. **Abre PowerShell/CMD** en esa carpeta
4. **Ejecuta**:
   ```bash
   npm install
   build-exe.bat
   ```
5. Espera a que compile el .exe (1-2 minutos)
6. **Click derecho en `installer-exe.bat`** → "Ejecutar como administrador"
7. ¡Listo! La app estará en tu menú Inicio sin necesidad de Node.js

### Opción 2: Instalador Tradicional (CON NODE.JS)

1. **Descarga el proyecto** desde Replit (Download → ZIP)
2. **Extrae la carpeta** en tu PC
3. **Instala Node.js** desde https://nodejs.org/
4. **Abre PowerShell/CMD** en la carpeta y ejecuta:
   ```bash
   npm install
   ```
5. **Click derecho en `installer-windows.bat`** → "Ejecutar como administrador"
6. ¡Listo! La app aparecerá en tu menú Inicio

### Opción 3: Ejecutar Directo Sin Instalar

1. Descarga el proyecto y extrae
2. Ejecuta `build-exe.bat`
3. Se creará `MCBotApp.exe` que puedes ejecutar desde cualquier lado
4. Puedes ponerlo en el escritorio o donde quieras

---

## Mac

### Instalación con Automator

1. Descarga el proyecto (ZIP)
2. Extrae la carpeta
3. Abre **Automator** (Spotlight → "Automator")
4. Nuevo documento → Selecciona "Aplicación"
5. Busca "Shell" en la librería
6. Arrastra "Ejecutar Shell Script" al flujo
7. Pega esto:
   ```bash
   cd /ruta/a/la/carpeta/del/bot
   npm install
   npm run launcher
   ```
8. Archivo → Guardar → Nombre: "Minecraft Bot App"
9. Selecciona dónde guardar (Applications recomendado)
10. ¡Listo! Tendrás una app nativa

---

## Linux

1. Descarga y extrae el proyecto
2. Crea un archivo `.desktop` en `~/.local/share/applications/`:
   ```bash
   nano ~/.local/share/applications/minecraft-bot.desktop
   ```
3. Pega:
   ```ini
   [Desktop Entry]
   Type=Application
   Name=Minecraft Bot App
   Comment=Keepalive Bot para Aternos
   Exec=/ruta/a/launcher.js
   Path=/ruta/a/la/carpeta
   Terminal=true
   Categories=Utilities;
   ```
4. Guarda (Ctrl+O, Enter, Ctrl+X)
5. ¡Aparecerá en tu menú de Aplicaciones!

---

## Configuración Inicial

Antes de ejecutar por primera vez, asegúrate de que `.env` tenga:

```
DISCORD_WEBHOOK_URL=tu_webhook_de_discord
ATERNOS_USERNAME=tu_usuario_aternos
ATERNOS_PASSWORD=tu_contraseña_aternos
```

---

## Solución de Problemas

### "npm: comando no encontido"
- Instala Node.js desde https://nodejs.org/ (versión LTS)

### "Se abre y se cierra rápido"
- Abre PowerShell y ejecuta manualmente:
  ```bash
  npm run launcher
  ```

### "Permiso denegado" (Mac/Linux)
- Ejecuta:
  ```bash
  chmod +x launcher.js
  chmod +x installer-windows.bat
  ```

---

## Desinstalación

### Windows (Si instalaste con .exe - RECOMENDADO)
1. Busca en tu PC la carpeta: `C:\Program Files\MinecraftBotApp`
2. Click derecho en `uninstall-app.bat`
3. Selecciona "Ejecutar como administrador"
4. ¡Listo! Todo se eliminará automáticamente

### Windows (Si instalaste con los .bat iniciales)
1. Busca la carpeta: `C:\Program Files\MinecraftBotApp`
2. Click derecho en `uninstall.bat`
3. Selecciona "Ejecutar como administrador"
4. ¡Listo!

### Windows (Manual)
- Simplemente elimina la carpeta: `C:\Program Files\MinecraftBotApp`
- Borra los accesos directos del Menú Inicio y Escritorio

### Mac
- Arrastra la app a la Papelera
- Vacía la papelera

### Linux
- Elimina el archivo `.desktop`:
  ```bash
  rm ~/.local/share/applications/minecraft-bot.desktop
  ```
- Elimina la carpeta del proyecto

---

¿Preguntas? El bot siempre aparecerá en tu menú cuando lo necesites 🎮
