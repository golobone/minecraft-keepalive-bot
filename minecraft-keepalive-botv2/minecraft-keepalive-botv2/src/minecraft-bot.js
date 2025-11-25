const mineflayer = require('mineflayer');

class MinecraftBot {
  constructor(config) {
    this.config = config;
    this.bot = null;
  }

  create() {
    console.log('🤖 Conectando...');
    
    this.bot = mineflayer.createBot(this.config);

    this.bot.on('login', () => {
      console.log('✅ Bot conectado!');
    });

    this.bot.on('spawn', () => {
      console.log('🌍 Bot en el mundo');
      if (this.bot.entity && this.bot.entity.position) {
        console.log(`📍 Posición: ${this.bot.entity.position}`);
      }
    });

    this.bot.on('kicked', (reason) => {
      console.log('❌ Expulsado:', reason);
    });

    this.bot.on('end', (reason) => {
      console.log('🔌 Desconectado');
      if (reason) {
        console.log('Razón:', reason);
      }
    });

    this.bot.on('error', (err) => {
      console.log('⚠️ Error:', err.message);
    });
  }

  quit() {
    if (this.bot) {
      this.bot.quit();
    }
  }
}

module.exports = MinecraftBot;
