# 🎮 Instalación de Minecraft Bot App

## Windows (Recomendado)

### Opción 1: Instalador Automático (EASIEST)

1. **Descarga el proyecto** desde Replit (Download → ZIP)
2. **Extrae la carpeta** en tu PC
3. **Abre PowerShell o CMD** en la carpeta del proyecto
4. **Ejecuta**:
   ```bash
   npm install
   ```
5. **Click derecho en `installer-windows.bat`** → "Ejecutar como administrador"
6. ¡Listo! La app aparecerá en tu menú Inicio y escritorio

### Opción 2: Crear Ejecutable Standalone (.exe)

1. Realiza los pasos 1-4 de arriba
2. En PowerShell ejecuta:
   ```bash
   npm install -g pkg
   npm run build:windows
   ```
3. Se creará un archivo `MCBotApp.exe` que puedes ejecutar directamente
4. Copia este .exe a donde quieras (escritorio, documentos, etc)

### Opción 3: Menú Inicio Manual

1. Abre la carpeta donde extrajiste el proyecto
2. Click derecho en `launcher.js` → Crear acceso directo
3. Renombralo a "Minecraft Bot App"
4. Click derecho → Propiedades → Destino
5. Cambia a: `cmd /k cd "C:\ruta\a\carpeta" && npm run launcher`
6. Mueve el acceso directo a:
   ```
   C:\Users\TuUsuario\AppData\Roaming\Microsoft\Windows\Start Menu\Programs
   ```

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

### Windows
- Busca "Minecraft Bot App" en Inicio
- Click derecho → Desinstalar
- O elimina la carpeta: `C:\Program Files\MinecraftBotApp`

### Mac
- Arrastra la app a la Papelera

### Linux
- Elimina el archivo `.desktop`

---

¿Preguntas? El bot siempre aparecerá en tu menú cuando lo necesites 🎮
