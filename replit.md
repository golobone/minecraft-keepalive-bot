# Bot de Minecraft Keepalive + Discord

## Descripción
Bot de Minecraft que se conecta a un servidor, lo mantiene activo moviéndose aleatoriamente, y envía notificaciones de estado por Discord.

## Características principales

### 🤖 Bot de Minecraft
- ✅ Conexión al servidor (offline mode)
- ✅ Mensaje de inicio en el chat
- ✅ Teletransporte a coordenadas 0, 70, 0
- ✅ Cambio a modo espectador
- ✅ Movimiento aleatorio continuo (rotación de cámara)
- ✅ Entra UNA SOLA VEZ y se mantiene en el servidor

### 📢 Notificaciones Discord
- ✅ Bot conectado/desconectado
- ✅ Intentos de reconexión
- ✅ Errores y problemas críticos

### 📊 Monitoreo
- ✅ Seguimiento de estado del bot en Discord
- ✅ Información de conexión

## Configuración

### Variables de entorno requeridas

```bash
# Obligatorio para notificaciones Discord
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Opcional para Aternos API (control automático)
ATERNOS_USERNAME=tu_usuario
ATERNOS_PASSWORD=tu_contraseña
```

### Estructura del proyecto

```
.
├── bot.js                    # Punto de entrada principal
├── launcher.js              # Panel de control (menú)
├── build-exe.bat            # Genera .exe ejecutable
├── installer-windows.bat    # Instalador con Node.js
├── installer-exe.bat        # Instalador .exe compilado
├── uninstaller-windows.bat  # Desinstalador (Node.js)
├── install-instructions.md  # Guía completa de instalación
├── package.json             # Dependencias
├── src/
│   ├── config.js            # Configuración centralizada
│   ├── minecraft-bot.js     # Clase del bot de Minecraft
│   ├── discord-notifier.js  # Notificaciones a Discord
│   ├── aternos-client.js    # Cliente de la API de Aternos
│   └── server-monitor.js    # Monitoreo del servidor
└── replit.md                # Este archivo
```

## Uso

### En tu PC COMO APLICACIÓN (RECOMENDADO - .EXE)

1. Descarga el proyecto desde Replit (Download → ZIP)
2. Extrae la carpeta
3. Abre PowerShell en la carpeta y ejecuta:
   ```bash
   npm install
   build-exe.bat
   ```
4. Espera a que compile (1-2 minutos)
5. **Click derecho en `installer-exe.bat`** → "Ejecutar como administrador"
   - ¡Listo! Aparecerá en tu menú Inicio
   - **NO necesitas Node.js instalado** después de esto

**O si prefieres con Node.js:**
1. Instala Node.js desde https://nodejs.org/
2. Descarga y extrae el proyecto
3. `npm install`
4. Click derecho en `installer-windows.bat` → "Ejecutar como administrador"

Ver detalles completos en `install-instructions.md`

### En Replit

1. Configura las variables de entorno en Secrets
2. Ejecuta `npm start` o usa el workflow automático
3. El bot se conectará y enviará notificaciones a Discord

### Cambiar servidor

Edita en `src/config.js`:
```javascript
minecraft: {
  host: 'tu-servidor.aternos.me',
  port: 25565,
  username: 'NombreDelBot'
}
```

## Tecnologías

- **Node.js 20**: Runtime
- **Mineflayer**: Bot de Minecraft
- **Axios**: Requests HTTP (APIs)
- **Discord Webhooks**: Notificaciones

## Funcionalidades futuras

- [ ] Comandos desde Discord
- [ ] Estadísticas de uptime
- [ ] Logs persistentes
- [ ] Alertas de bajo rendimiento
- [ ] Soporte para múltiples servidores

## Última actualización
22 de noviembre de 2025 - v2.1.0 (Instalador como Aplicación agregado)
