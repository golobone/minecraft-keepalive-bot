const mineflayer = require('mineflayer');

const config = {
  host: 'Aleatrio.aternos.me',
  port: 16024,
  username: 'BOTnooff',
  version: false,
  auth: 'offline'
};

let bot;
let movementInterval;

function createBot() {
  console.log('🤖 Creando bot...');
  
  bot = mineflayer.createBot(config);

  bot.on('login', () => {
    console.log('✅ Bot conectado al servidor!');
    console.log(`📍 Posición: ${bot.entity.position}`);
    
    setTimeout(() => {
      try {
        bot.chat('/gamemode spectator');
        console.log('👻 Intentando cambiar a modo espectador...');
      } catch (err) {
        console.log('⚠️  No se pudo cambiar a espectador automáticamente');
      }
    }, 2000);
  });

  bot.on('spawn', () => {
    console.log('🌍 Bot apareció en el mundo');
    startRandomMovement();
  });

  bot.on('kicked', (reason) => {
    console.log('❌ Bot expulsado del servidor:', reason);
    stopRandomMovement();
    reconnect();
  });

  bot.on('end', (reason) => {
    console.log('🔌 Conexión terminada');
    if (reason && reason !== 'disconnect.quitting') {
      console.log('📤 Razón:', reason);
    }
    stopRandomMovement();
    reconnect();
  });

  bot.on('error', (err) => {
    console.log('⚠️  Error:', err.message);
    stopRandomMovement();
  });

  bot.on('message', (message) => {
    const msg = message.toString();
    if (msg.includes('gamemode') || msg.includes('espectador') || msg.includes('spectator')) {
      console.log('📨 Mensaje del servidor:', msg);
    }
  });

  bot.on('health', () => {
    if (bot.health <= 0) {
      console.log('💀 El bot murió, respawneando...');
      bot.chat('/spectator');
    }
  });
}

function startRandomMovement() {
  console.log('🎮 Iniciando movimiento aleatorio...');
  
  movementInterval = setInterval(() => {
    if (!bot || !bot.entity) return;

    const actions = ['forward', 'back', 'left', 'right', 'jump'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    bot.clearControlStates();
    
    bot.setControlState(randomAction, true);
    
    setTimeout(() => {
      if (bot) {
        bot.clearControlStates();
      }
    }, 500 + Math.random() * 1500);

    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI * 0.5;
    
    if (bot) {
      bot.look(yaw, pitch);
    }

  }, 2000 + Math.random() * 3000);
}

function stopRandomMovement() {
  if (movementInterval) {
    clearInterval(movementInterval);
    movementInterval = null;
  }
  if (bot) {
    bot.clearControlStates();
  }
}

function reconnect() {
  console.log('🔄 Reconectando en 5 segundos...');
  setTimeout(() => {
    createBot();
  }, 5000);
}

console.log('🚀 Iniciando bot de Minecraft...');
console.log(`📡 Servidor: ${config.host}:${config.port}`);
console.log(`👤 Usuario: ${config.username}`);
console.log('');

createBot();

let isShuttingDown = false;

process.on('SIGINT', () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log('\n👋 Cerrando bot...');
  stopRandomMovement();
  
  if (bot && bot.entity) {
    try {
      bot.chat('¡Bot desconectándose! Nos vemos pronto.');
      console.log('📤 Mensaje de despedida enviado al chat');
      
      setTimeout(() => {
        bot.quit();
        process.exit(0);
      }, 1000);
    } catch (err) {
      console.log('⚠️  No se pudo enviar mensaje de despedida');
      bot.quit();
      process.exit(0);
    }
  } else {
    process.exit(0);
  }
});
