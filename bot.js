require('dotenv').config();

const http = require('http');
const MinecraftBot = require('./src/minecraft-bot');
const DiscordNotifier = require('./src/discord-notifier');
const config = require('./src/config');

// Variables globales
let bot = null;
let discordNotifier = null;
let serverMonitor = null;
let isRunning = true;

// HEALTH CHECK - COMPLETAMENTE INDEPENDIENTE, NUNCA FALLA
const healthServer = http.createServer((req, res) => {
  if (!isRunning) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

healthServer.on('clientError', (err, socket) => {
  try {
    socket.end('HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nOK');
  } catch (e) {
    // Ignorar
  }
});

const port = 9999;
healthServer.listen(port, '0.0.0.0', () => {
  console.log(`🏥 Health check en puerto ${port} - INDEPENDIENTE`);
});

healthServer.on('error', (err) => {
  console.log('⚠️ Health check error:', err.code);
  // Nunca detener el health check por errores
});

// Procesar terminación elegante
process.on('SIGTERM', () => {
  isRunning = false;
  console.log('SIGTERM recibido - health check sigue activo');
  setTimeout(() => {
    process.exit(0);
  }, 1000);
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
  isRunning = false;
  
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
