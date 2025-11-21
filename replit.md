# Bot de Minecraft Keepalive + Aternos + Discord

## Descripción
Bot de Minecraft que se conecta automáticamente a un servidor de Aternos, lo mantiene activo moviéndose aleatoriamente, y envía notificaciones de estado por Discord.

## Características principales

### 🤖 Bot de Minecraft
- ✅ Conexión automática al servidor
- ✅ Mensaje de inicio en el chat
- ✅ Teletransporte a coordenadas 0, 70, 0
- ✅ Cambio a modo espectador
- ✅ Movimiento aleatorio continuo (WASD + rotación de cámara)
- ✅ Reconexión automática con backoff exponencial
- ✅ Mensaje de despedida al apagar

### 🚀 Aternos Integration
- ✅ Detección automática de servidor offline
- ✅ Inicio automático del servidor vía API
- ✅ Autenticación segura con sesión persistente
- ✅ Obtención de información del servidor (IP, puerto, jugadores)

### 📢 Notificaciones Discord
- ✅ Servidor iniciando
- ✅ Servidor online (con info: IP, puerto, jugadores)
- ✅ Servidor offline
- ✅ Bot conectado/desconectado
- ✅ Intentos de reconexión
- ✅ Errores y problemas críticos

### 📊 Monitoreo
- ✅ Chequeos periódicos del estado del servidor
- ✅ Seguimiento de uptime del bot
- ✅ Información en tiempo real
- ✅ Intentos de reconexión inteligentes

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
