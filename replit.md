# Bot de Minecraft - Keepalive

## Descripción
Bot de Minecraft que se conecta automáticamente a un servidor, entra en modo espectador y se mueve aleatoriamente para mantener el servidor activo (especialmente útil para servidores de Aternos).

## Servidor
- **Host**: Aleatrio.aternos.me
- **Puerto**: 16024
- **Modo**: Offline (sin cuenta premium)

## Características
- ✅ Conexión automática al servidor
- ✅ Cambio a modo espectador
- ✅ Movimiento aleatorio continuo (WASD + rotación de cámara)
- ✅ Reconexión automática si se desconecta
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
