require('dotenv').config();

const http = require('http');
const MinecraftBot = require('./src/minecraft-bot');
const DiscordNotifier = require('./src/discord-notifier');
const config = require('./src/config');

// Variables globales
let bot = null;
let discordNotifier = null;
let serverMonitor = null;

// Health check server - SIEMPRE debe estar funcionando
const healthServer = http.createServer((req, res) => {
  try {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  } catch (err) {
    console.log('⚠️  Error en health check:', err.message);
  }
});

healthServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('⚠️  Puerto 9999 ya está en uso');
  } else {
    console.log('⚠️  Error en health check server:', err.message);
  }
});

healthServer.listen(9999, '0.0.0.0', () => {
  console.log('🏥 Health check en puerto 9999');
}).on('error', (err) => {
  console.error('❌ No se pudo iniciar health check:', err.message);
});

async function initialize() {
  try {
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
  } catch (err) {
    console.error('❌ Error durante la inicialización:', err.message);
    console.error(err.stack);
  }
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
  
  if (serverMonitor) {
    serverMonitor.stop();
  }

  if (bot) {
    await bot.sendGoodbyeMessage();
    bot.quit();
  }

  if (discordNotifier) {
    await discordNotifier.notifyBotDisconnected('Bot cerrado manualmente');
  }

  process.exit(0);
});

initialize();
