const mineflayer = require('mineflayer');

class MinecraftBot {
  constructor(config, discordNotifier = null) {
    this.config = config;
    this.discordNotifier = discordNotifier;
    this.bot = null;
    this.movementInterval = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.baseReconnectDelay = 10000;
    this.hasInitialized = false;
    this.isStoppedPermanently = false;
  }

  create() {
    console.log('🤖 Creando bot de Minecraft...');
    
    this.bot = mineflayer.createBot(this.config);
    this.hasInitialized = false;

    this.bot.on('login', () => {
      console.log('✅ Bot conectado al servidor!');
      this.reconnectAttempts = 0;
      if (this.discordNotifier) {
        this.discordNotifier.notifyBotConnected();
      }
    });

    this.bot.on('spawn', () => {
      console.log('🌍 Bot apareció en el mundo');
      if (this.bot.entity && this.bot.entity.position) {
        console.log(`📍 Posición: ${this.bot.entity.position}`);
      }
      
      // Solo ejecutar comandos de inicio UNA sola vez
      if (!this.hasInitialized) {
        this.hasInitialized = true;
        console.log('✅ Bot inicializado correctamente');
        
        // Iniciar movimiento aleatorio
        if (!this.movementInterval) {
          this.startRandomMovement();
        }
      }
    });

    this.bot.on('kicked', (reason) => {
      console.log('❌ Bot expulsado del servidor:', reason);
      this.stopRandomMovement();
      if (this.discordNotifier) {
        this.discordNotifier.notifyBotDisconnected(`Expulsado: ${reason}`);
      }
      
      // Convertir reason a string de forma segura
      const reasonStr = typeof reason === 'string' ? reason : JSON.stringify(reason);
      
      // Si login desde otra ubicación, MARCAR COMO DETENIDO PERMANENTEMENTE
      if (reasonStr && reasonStr.includes('logged in from')) {
        console.log('🛑 Otra conexión detectada. Bot DETENIDO (sin reconexión).');
        this.isStoppedPermanently = true;
        this.stopRandomMovement();
        if (this.bot) {
          this.bot.end();
        }
        if (this.discordNotifier) {
          this.discordNotifier.notifyError('Otra conexión detectada', 'Bot detenido permanentemente. Health check: activo');
        }
        return;
      }
      
      // Si es throttled, esperar 2 minutos
      if (reasonStr && reasonStr.includes('throttled')) {
        console.log('⏳ Servidor limitando conexiones - esperando 2 minutos...');
        setTimeout(() => {
          this.reconnectAttempts = 0;
          this.create();
        }, 120000); // 2 minutos
      } else {
        this.reconnect();
      }
    });

    this.bot.on('end', (reason) => {
      console.log('🔌 Conexión terminada');
      if (reason && reason !== 'disconnect.quitting') {
        console.log('📤 Razón:', reason);
      }
      this.stopRandomMovement();
      this.reconnect();
    });

    this.bot.on('error', (err) => {
      if (err.message.includes('unknown chat format code')) {
        return;
      }
      
      // Identificar tipo de error
      let errorName = 'Error del bot';
      if (err.code === 'EPIPE') {
        errorName = '❌ Error EPIPE (tubería rota)';
      } else if (err.code === 'ECONNRESET') {
        errorName = '❌ Error ECONNRESET (conexión reiniciada)';
      } else if (err.code === 'ENOTFOUND') {
        errorName = '❌ Error ENOTFOUND (servidor no encontrado)';
      } else if (err.code === 'ECONNREFUSED') {
        errorName = '❌ Error ECONNREFUSED (conexión rechazada)';
      } else if (err.message.includes('timeout')) {
        errorName = '⏱️ Error de timeout';
      } else if (err.message.includes('throttled')) {
        errorName = '🚫 Conexión limitada por servidor';
      }
      
      console.log(`⚠️  ${errorName}: ${err.message}`);
      this.stopRandomMovement();
      if (this.discordNotifier) {
        this.discordNotifier.notifyError(errorName, err.message);
      }
      this.reconnect();
    });

    this.bot.on('message', (message) => {
      try {
        const msg = message.toString();
        if (msg.includes('gamemode') || msg.includes('espectador') || msg.includes('spectator')) {
          console.log('📨 Mensaje del servidor:', msg);
        }
      } catch (err) {
        // Ignorar errores de formato de mensaje
      }
    });

    this.bot.on('health', () => {
      if (this.bot.health <= 0) {
        console.log('💀 El bot murió, respawneando...');
        this.bot.chat('/spectator');
      }
    });
  }

  startRandomMovement() {
    if (this.movementInterval) {
      console.log('🎮 Movimiento ligero ya está activo');
      return;
    }
    
    console.log('🎮 Iniciando movimiento ligero (AxAFKZone activo en servidor)...');
    
    this.movementInterval = setInterval(() => {
      // Verificar que bot existe y está conectado
      if (!this.bot || !this.bot.entity || !this.bot.player) return;

      try {
        // Rotación leve cada 10-20 segundos
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI * 0.3;
        this.bot.look(yaw, pitch);
      } catch (err) {
        // Ignorar silenciosamente
      }

    }, 10000 + Math.random() * 10000); // Cada 10-20 segundos
  }

  stopRandomMovement() {
    if (this.movementInterval) {
      clearInterval(this.movementInterval);
      this.movementInterval = null;
    }
    if (this.bot && this.bot.clearControlStates) {
      this.bot.clearControlStates();
    }
  }

  reconnect() {
    // Si está detenido permanentemente, no reconectar
    if (this.isStoppedPermanently) {
      console.log('⏸️ Bot detenido permanentemente - no reconectando');
      return;
    }
    
    this.reconnectAttempts++;
    
    if (this.reconnectAttempts > this.maxReconnectAttempts) {
      console.log(`\n❌ Se alcanzó el máximo de ${this.maxReconnectAttempts} intentos de reconexión.`);
      console.log('💡 Esto puede deberse a:');
      console.log('   - El bot no está en la whitelist del servidor');
      console.log('   - El servidor está caído o inaccesible');
      console.log('   - Problemas de conexión');
      console.log('\n🔄 Esperando 5 minutos antes de reintentar...\n');
      
      if (this.discordNotifier) {
        this.discordNotifier.notifyError('Máximo de reconexiones alcanzado', 'Esperando 5 minutos antes de reintentar');
      }
      
      setTimeout(() => {
        this.reconnectAttempts = 0;
        this.create();
      }, 300000);
      return;
    }
    
    const delay = Math.min(this.baseReconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1), 60000);
    const seconds = Math.round(delay / 1000);
    
    console.log(`🔄 Reconectando en ${seconds} segundos... (Intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    // Solo notificar cada 3 intentos para no bombardear Discord
    if (this.discordNotifier && this.reconnectAttempts % 3 === 0) {
      this.discordNotifier.notifyReconnectionAttempt(this.reconnectAttempts, this.maxReconnectAttempts, delay);
    }
    
    setTimeout(() => {
      this.create();
    }, delay);
  }

  quit() {
    this.stopRandomMovement();
    if (this.bot) {
      this.bot.quit();
    }
  }

  async sendGoodbyeMessage() {
    return new Promise((resolve) => {
      if (this.bot && this.bot.entity) {
        try {
          this.bot.chat('¡Bot desconectándose! Nos vemos pronto.');
          console.log('📤 Mensaje de despedida enviado al chat');
          setTimeout(() => resolve(true), 1000);
        } catch (err) {
          console.log('⚠️  No se pudo enviar mensaje de despedida');
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  }
}

module.exports = MinecraftBot;
