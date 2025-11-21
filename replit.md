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

### Local con Replit

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
21 de noviembre de 2025 - v2.0.0
