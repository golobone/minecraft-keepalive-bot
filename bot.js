require('dotenv').config();

const http = require('http');
const MinecraftBot = require('./src/minecraft-bot');
const DiscordNotifier = require('./src/discord-notifier');
const config = require('./src/config');

// Variables globales
let bot = null;
let discordNotifier = null;
let serverMonitor = null;

// Ultra-simple health check - nunca falla
const healthServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

healthServer.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

let healthServerStarted = false;

function startHealthCheck() {
  if (healthServerStarted) return;
  
  try {
    healthServer.listen(9999, '0.0.0.0', () => {
      healthServerStarted = true;
      console.log('🏥 Health check en puerto 9999');
    });
  } catch (err) {
    console.error('❌ Error health check:', err.message);
    setTimeout(startHealthCheck, 5000);
  }
}

healthServer.on('error', (err) => {
  console.log('⚠️  Health check error:', err.code);
  healthServerStarted = false;
  if (err.code !== 'EADDRINUSE') {
    setTimeout(startHealthCheck, 5000);
  }
});

startHealthCheck();

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
