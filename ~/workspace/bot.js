require('dotenv').config();

const MinecraftBot = require('./src/minecraft-bot');
const DiscordNotifier = require('./src/discord-notifier');
const config = require('./src/config');

let bot = null;
let discordNotifier = null;

async function initialize() {
  console.log('🚀 Inicializando Minecraft Keepalive Bot...');
  console.log('');

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL || config.discord.webhookUrl;
  console.log('🔍 URL del webhook:', webhookUrl ? '✅ Detectado' : '❌ No encontrado');
  
  discordNotifier = new DiscordNotifier(webhookUrl);

  if (discordNotifier.isEnabled) {
    console.log('📡 Monitoreo con Discord habilitado ✅');
  } else {
    console.log('⚠️  Discord Webhook no configurado - solo modo local');
  }

  bot = new MinecraftBot(config.minecraft, discordNotifier);
  bot.create();
}

process.on('uncaughtException', (err) => {
  if (err.message && err.message.includes('unknown chat format code')) {
    console.log('⚠️  Mensaje del servidor en formato desconocido (ignorado)');
    return;
  }
  console.error('💥 Error no capturado:', err);
});

let isShuttingDown = false;

process.on('SIGINT', async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log('\n👋 Cerrando bot...');

  if (bot) {
    await bot.sendGoodbyeMessage();
    bot.quit();
  }

  if (discordNotifier) {
    await discordNotifier.notifyBotDisconnected('Bot cerrado manualmente');
  }

  process.exit(0);
});

initialize().catch(err => {
  console.error('❌ Error durante la inicialización:', err.message);
  process.exit(1);
});
