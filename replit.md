# Bot de Minecraft - Keepalive

## Descripción
Bot de Minecraft que se conecta automáticamente a un servidor, entra en modo espectador y se mueve aleatoriamente para mantener el servidor activo (especialmente útil para servidores de Aternos).

## Servidor
- **Host**: Aleatrio.aternos.me
- **Puerto**: 16024
- **Modo**: Offline (sin cuenta premium)

## Características
- ✅ Conexión automática al servidor
- ✅ Mensaje de inicio en el chat cuando se enciende el bot
- ✅ Teletransporte automático a coordenadas 0, 70, 0
- ✅ Cambio a modo espectador
- ✅ Movimiento aleatorio continuo (WASD + rotación de cámara)
- ✅ Reconexión automática con backoff exponencial
- ✅ Mensaje de despedida en el chat cuando se apaga el bot
- ✅ Manejo robusto de errores del servidor
- ✅ Logs detallados de eventos

## Estructura del Proyecto
```
.
├── bot.js           # Código principal del bot
├── package.json     # Dependencias y configuración
└── replit.md        # Documentación
```

## Tecnologías
- **Node.js 20**: Runtime de JavaScript
- **Mineflayer**: Librería para crear bots de Minecraft

## Uso
El bot se ejecuta automáticamente y mantiene el servidor activo moviéndose aleatoriamente.

## Configuración
Para cambiar el servidor, edita el objeto `config` en `bot.js`:
```javascript
const config = {
  host: 'tu-servidor.aternos.me',
  port: 25565,
  username: 'NombreDelBot'
};
```

## Última actualización
21 de noviembre de 2025
