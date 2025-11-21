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
  }

  create() {
    console.log('🤖 Creando bot de Minecraft...');
    
    this.bot = mineflayer.createBot(this.config);

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
      
      setTimeout(() => {
        try {
          this.bot.chat('✅ Bot encendido correctamente!');
          console.log('💬 Mensaje de inicio enviado al chat');
        } catch (err) {
          console.log('⚠️  No se pudo enviar mensaje de inicio');
        }
      }, 1000);
      
      setTimeout(() => {
        try {
          this.bot.chat('/tp 0 70 0');
          console.log('📍 Teletransportando a coordenadas 0 70 0...');
        } catch (err) {
          console.log('⚠️  No se pudo teletransportar');
        }
      }, 2000);
      
      setTimeout(() => {
        try {
          this.bot.chat('/gamemode spectator');
          console.log('👻 Intentando cambiar a modo espectador...');
        } catch (err) {
          console.log('⚠️  No se pudo cambiar a espectador automáticamente');
        }
      }, 3000);
      
      this.startRandomMovement();
    });

    this.bot.on('kicked', (reason) => {
      console.log('❌ Bot expulsado del servidor:', reason);
      this.stopRandomMovement();
      if (this.discordNotifier) {
        this.discordNotifier.notifyBotDisconnected(`Expulsado: ${reason}`);
      }
      this.reconnect();
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
      console.log('⚠️  Error:', err.message);
      this.stopRandomMovement();
      if (this.discordNotifier) {
        this.discordNotifier.notifyError('Error del bot', err.message);
      }
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
    console.log('🎮 Iniciando movimiento aleatorio...');
    
    this.movementInterval = setInterval(() => {
      if (!this.bot || !this.bot.entity) return;

      const actions = ['forward', 'back', 'left', 'right', 'jump'];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      this.bot.clearControlStates();
      this.bot.setControlState(randomAction, true);
      
      setTimeout(() => {
        if (this.bot) {
          this.bot.clearControlStates();
        }
      }, 500 + Math.random() * 1500);

      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI * 0.5;
      
      if (this.bot) {
        this.bot.look(yaw, pitch);
      }

    }, 2000 + Math.random() * 3000);
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
    
    if (this.discordNotifier) {
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
