#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

require('dotenv').config();

const AternosClient = require('./src/aternos-client.js');

let botProcess = null;

async function setupCredentials() {
  const answers = await inquirer.prompt([
    {
      type: 'password',
      name: 'username',
      message: '👤 Usuario de Aternos:',
      mask: '*'
    },
    {
      type: 'password',
      name: 'password',
      message: '🔐 Contraseña de Aternos:',
      mask: '*'
    },
    {
      type: 'input',
      name: 'webhook',
      message: '🔗 Discord Webhook (Enter para saltar):',
      default: ''
    }
  ]);

  let envContent = `ATERNOS_USERNAME=${answers.username}\nATERNOS_PASSWORD=${answers.password}\n`;
  if (answers.webhook) {
    envContent += `DISCORD_WEBHOOK_URL=${answers.webhook}\n`;
  }

  fs.writeFileSync(path.join(process.cwd(), '.env'), envContent);
  console.log('\n✅ Credenciales guardadas\n');

  process.env.ATERNOS_USERNAME = answers.username;
  process.env.ATERNOS_PASSWORD = answers.password;
  if (answers.webhook) process.env.DISCORD_WEBHOOK_URL = answers.webhook;
}

async function initializeAternos() {
  const username = process.env.ATERNOS_USERNAME;
  const password = process.env.ATERNOS_PASSWORD;

  if (!username || !password) {
    console.log('\n⚠️  Necesitas configurar tus credenciales primero\n');
    await setupCredentials();
    return initializeAternos();
  }

  const client = new AternosClient();
  const authenticated = await client.authenticate(username, password);

  if (!authenticated) {
    console.log('\n❌ Error de autenticación\n');
    return null;
  }

  return client;
}

function startBot() {
  if (botProcess) {
    console.log('\n⚠️  Bot ya está corriendo\n');
    return;
  }

  console.log('\n🤖 Iniciando bot...\n');
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
    console.log('\n⚠️  Bot no está corriendo\n');
    return;
  }

  botProcess.kill('SIGTERM');
  botProcess = null;
  console.log('\n✅ Bot detenido\n');
}

async function startAternos(client) {
  if (!client) {
    console.log('\n❌ Aternos no disponible\n');
    return;
  }

  const success = await client.startServer();
  if (success) {
    console.log('\n✅ Aternos iniciando... (espera 30-60 seg)\n');
  } else {
    console.log('\n❌ Error al iniciar Aternos\n');
  }
}

async function stopAternos(client) {
  if (!client) {
    console.log('\n❌ Aternos no disponible\n');
    return;
  }

  const success = await client.stopServer();
  if (success) {
    console.log('\n✅ Aternos detenido\n');
  } else {
    console.log('\n❌ Error al detener Aternos\n');
  }
}

async function showMenu() {
  console.clear();
  console.log(`
╔════════════════════════════════════════╗
║     🎮 MINECRAFT BOT - CONTROL        ║
╚════════════════════════════════════════╝
`);

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Selecciona una acción:',
      choices: [
        { name: '🚀 Iniciar Bot + Aternos', value: '1' },
        { name: '🤖 Solo Bot', value: '2' },
        { name: '⚡ Encender Aternos', value: '3' },
        { name: '🔌 Apagar Aternos', value: '4' },
        { name: '⏹️  Detener Bot', value: '5' },
        { name: '🔑 Reconfigurar Credenciales', value: '6' },
        new inquirer.Separator(),
        { name: '❌ Salir', value: '0' }
      ],
      pageSize: 10
    }
  ]);

  const client = await initializeAternos();

  switch (action) {
    case '1':
      console.log('\n⏳ Encendiendo Aternos y bot...\n');
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
      console.log('\n👋 Saliendo...\n');
      process.exit(0);
  }

  setTimeout(showMenu, 3000);
}

console.log('\n🚀 Iniciando Minecraft Bot...\n');

showMenu().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
