require('dotenv').config();

const MinecraftBot = require('./src/minecraft-bot');
const DiscordNotifier = require('./src/discord-notifier');
const AternosClient = require('./src/aternos-client');
const ServerMonitor = require('./src/server-monitor');
const config = require('./src/config');

let bot = null;
let discordNotifier = null;
let aternosClient = null;
let serverMonitor = null;

async function initialize() {
  console.log('🚀 Inicializando Minecraft Keepalive Bot con Aternos...');
  console.log('');

  discordNotifier = new DiscordNotifier(process.env.DISCORD_WEBHOOK_URL);

  if (discordNotifier.isEnabled) {
    console.log('📡 Monitoreo con Discord habilitado');
  } else {
    console.log('⚠️  Discord Webhook no configurado - solo modo local');
  }

  aternosClient = new AternosClient();
  aternosClient.loadSession();

  if (process.env.ATERNOS_USERNAME && process.env.ATERNOS_PASSWORD) {
    const authenticated = await aternosClient.authenticate(
      process.env.ATERNOS_USERNAME,
      process.env.ATERNOS_PASSWORD
    );

    if (authenticated) {
      serverMonitor = new ServerMonitor(
        aternosClient,
        discordNotifier,
        config.monitoring.checkIntervalMs
      );
      const serverStarted = await serverMonitor.startServerIfOffline();
      serverMonitor.start();
      console.log(`${serverStarted ? '✅' : '⚠️'} Monitoreo del servidor de Aternos activo`);
    } else {
      console.log('⚠️  Falló autenticación con Aternos - monitoreo deshabilitado');
    }
  } else {
    console.log('⚠️  Credenciales de Aternos no configuradas - monitoreo deshabilitado');
    console.log('💡 Configura ATERNOS_USERNAME y ATERNOS_PASSWORD para activar');
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

initialize().catch(err => {
  console.error('❌ Error durante la inicialización:', err.message);
  process.exit(1);
});
