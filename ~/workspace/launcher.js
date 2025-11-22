#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();

require('dotenv').config();

const AternosClient = require('./src/aternos-client.js');

let botProcess = null;

async function setupCredentials() {
  console.clear();
  console.log('╔════════════════════════════════════════╗');
  console.log('║      ⚙️  CONFIGURAR CREDENCIALES       ║');
  console.log('╚════════════════════════════════════════╝\n');

  const username = prompt('👤 Usuario de Aternos: ');
  const password = prompt('🔐 Contraseña de Aternos: ', { echo: '*' });
  const webhook = prompt('🔗 Discord Webhook (Enter para saltar): ');

  let envContent = `ATERNOS_USERNAME=${username}\nATERNOS_PASSWORD=${password}\n`;
  if (webhook.trim()) {
    envContent += `DISCORD_WEBHOOK_URL=${webhook}\n`;
  }

  fs.writeFileSync(path.join(process.cwd(), '.env'), envContent);
  console.log('\n✅ Credenciales guardadas\n');

  process.env.ATERNOS_USERNAME = username;
  process.env.ATERNOS_PASSWORD = password;
  if (webhook.trim()) process.env.DISCORD_WEBHOOK_URL = webhook;
}

async function initializeAternos() {
  const username = process.env.ATERNOS_USERNAME;
  const password = process.env.ATERNOS_PASSWORD;

  if (!username || !password) {
    console.log('⚠️  Necesitas configurar tus credenciales primero\n');
    await setupCredentials();
    return initializeAternos();
  }

  const client = new AternosClient();
  const authenticated = await client.authenticate(username, password);

  if (!authenticated) {
    console.log('❌ Error de autenticación\n');
    return null;
  }

  return client;
}

function startBot() {
  if (botProcess) {
    console.log('⚠️  Bot ya está corriendo\n');
    return;
  }

  console.log('🤖 Iniciando bot...\n');
  botProcess = spawn('node', ['bot.js'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  botProcess.on('exit', () => {
    botProcess = null;
  });
}

function stopBot() {
  if (!botProcess) {
    console.log('⚠️  Bot no está corriendo\n');
    return;
  }

  botProcess.kill('SIGTERM');
  botProcess = null;
  console.log('✅ Bot detenido\n');
}

async function startAternos(client) {
  if (!client) {
    console.log('❌ Aternos no disponible\n');
    return;
  }

  const success = await client.startServer();
  if (success) {
    console.log('✅ Aternos iniciando... (espera 30-60 seg)\n');
  } else {
    console.log('❌ Error al iniciar Aternos\n');
  }
}

async function stopAternos(client) {
  if (!client) {
    console.log('❌ Aternos no disponible\n');
    return;
  }

  const success = await client.stopServer();
  if (success) {
    console.log('✅ Aternos detenido\n');
  } else {
    console.log('❌ Error al detener Aternos\n');
  }
}

async function showMenu() {
  console.clear();
  console.log(`
╔════════════════════════════════════════╗
║     🎮 MINECRAFT BOT - CONTROL        ║
╚════════════════════════════════════════╝

1) 🚀 Iniciar Bot + Aternos
2) 🤖 Solo Bot
3) ⚡ Encender Aternos
4) 🔌 Apagar Aternos
5) ⏹️  Detener Bot
6) 🔑 Reconfigurar Credenciales
0) ❌ Salir
`);

  const choice = prompt('Elige una opción (0-6): ').trim();

  const client = await initializeAternos();

  switch (choice) {
    case '1':
      console.log('⏳ Encendiendo Aternos y bot...\n');
      await startAternos(client);
      setTimeout(() => startBot(), 2000);
      break;
    case '2':
      startBot();
      break;
    case '3':
      await startAternos(client);
      break;
    case '4':
      await stopAternos(client);
      break;
    case '5':
      stopBot();
      break;
    case '6':
      await setupCredentials();
      break;
    case '0':
      console.log('👋 Saliendo...\n');
      process.exit(0);
      break;
    default:
      console.log('❌ Opción inválida\n');
  }

  setTimeout(showMenu, 2000);
}

console.log('🚀 Iniciando Minecraft Bot...\n');

showMenu().catch(err => {
  console.error('❌ Error:', err.message);
  setTimeout(() => process.exit(1), 1000);
});
