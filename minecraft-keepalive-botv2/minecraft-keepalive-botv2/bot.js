require('dotenv').config();

const MinecraftBot = require('./src/minecraft-bot');
const config = require('./src/config');

let bot = null;

async function initialize() {
  try {
    console.log('🚀 Iniciando bot...');
    bot = new MinecraftBot(config.minecraft);
    bot.create();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

process.on('SIGINT', async () => {
  console.log('\n👋 Cerrando...');
  if (bot) {
    bot.quit();
  }
  process.exit(0);
});

initialize();
