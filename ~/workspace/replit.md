# Bot de Minecraft Keepalive + Discord

## Descripción
Bot de Minecraft que se conecta a un servidor, lo mantiene activo moviéndose aleatoriamente, y envía notificaciones de estado por Discord.

## Características principales

### 🤖 Bot de Minecraft
- ✅ Conexión al servidor Aleatrio.aternos.me:16024 (offline mode)
- ✅ Usuario: EternalAFK
- ✅ Mensaje de inicio en el chat
- ✅ Teletransporte a coordenadas 0, 70, 0
- ✅ Cambio a modo espectador
- ✅ Movimiento aleatorio continuo (rotación de cámara)
- ✅ Reconexión automática si se desconecta
- ✅ **NUEVO:** Reconexión automática si lo expulsan del servidor

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
```

### Estructura del proyecto

```
.
├── bot.js                    # Punto de entrada principal
├── package.json             # Dependencias
├── package-lock.json        # Lock file
├── src/
│   ├── config.js            # Configuración centralizada
│   ├── minecraft-bot.js     # Clase del bot de Minecraft
│   └── discord-notifier.js  # Notificaciones a Discord
└── replit.md                # Este archivo
```

## Uso

### En Replit
1. Configura `DISCORD_WEBHOOK_URL` en Secrets
2. Ejecuta `npm start` o el workflow automático
3. El bot se conectará al servidor

### En Koyeb (Recomendado - 24/7)
1. Sube el repositorio a GitHub (usuario: golobone)
2. Conecta GitHub a Koyeb
3. Crea un servicio web
4. Configura `DISCORD_WEBHOOK_URL` en variables de entorno
5. El bot corre 24/7 automáticamente

### Cambiar servidor
Edita en `src/config.js`:
```javascript
minecraft: {
  host: 'tu-servidor.aternos.me',
  port: 25565,
  username: 'NombreDelBot'
}
```

## Comportamiento del Bot

### Reconexiones automáticas
- **Servidor caído:** Intenta reconectarse cada 10-60 segundos (máx 10 intentos)
- **Bot expulsado:** Intenta reconectarse automáticamente (máx 10 intentos, luego espera 5 min)
- **Error de conexión:** Intenta reconectarse automáticamente

### Flujo normal
1. Se conecta al servidor
2. Aparece en el mundo a 0,70,0
3. Se cambia a modo espectador
4. Realiza movimiento aleatorio cada 5-10 segundos
5. Envía notificaciones a Discord de estado

## Tecnologías

- **Node.js**: Runtime
- **Mineflayer**: Bot de Minecraft
- **Axios**: Requests HTTP
- **Discord Webhooks**: Notificaciones

## Cambios recientes (22 nov 2025)

### v2.2.0
- ✅ Eliminado sistema de Aternos API (aternos-client.js, server-monitor.js)
- ✅ Código simplificado y más limpio
- ✅ **NUEVO:** Bot intenta reconectarse automáticamente si lo expulsan
- ✅ Subido a GitHub (usuario: golobone)
- ✅ Listo para desplegar en Koyeb

## Próximos pasos

1. Encender servidor en Aternos manualmente
2. Ejecutar bot en Replit o Koyeb
3. Ver notificaciones en Discord
4. Desplegar en Koyeb para 24/7

## Nota importante

Para que el bot funcione correctamente:
- El servidor Aternos debe estar **encendido manualmente** desde su web
- Luego el bot se conecta automáticamente
- Discord webhook URL debe estar configurada en variables de entorno
