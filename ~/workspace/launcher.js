#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

require('dotenv').config();

let botProcess = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function setupEnv() {
  console.log('\n⚙️  PRIMERA VEZ - Configurar credenciales\n');
  const username = await question('Usuario Aternos: ');
  const password = await question('Contraseña Aternos: ');
  const webhook = await question('Discord Webhook (Enter para saltar): ');

  let env = `ATERNOS_USERNAME=${username}\nATERNOS_PASSWORD=${password}\n`;
  if (webhook.trim()) env += `DISCORD_WEBHOOK_URL=${webhook}\n`;

  fs.writeFileSync('.env', env);
  process.env.ATERNOS_USERNAME = username;
  process.env.ATERNOS_PASSWORD = password;
  if (webhook.trim()) process.env.DISCORD_WEBHOOK_URL = webhook;

  console.log('\n✅ Guardado!\n');
}

function startBot() {
  if (botProcess) {
    console.log('Bot ya está corriendo\n');
    return;
  }
  console.log('🤖 Iniciando bot...\n');
  botProcess = spawn('node', ['bot.js'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  botProcess.on('exit', () => { botProcess = null; });
}

function stopBot() {
  if (!botProcess) {
    console.log('Bot no está corriendo\n');
    return;
  }
  botProcess.kill('SIGTERM');
  botProcess = null;
  console.log('✅ Bot detenido\n');
}

async function menu() {
  console.clear();
  console.log(`
╔════════════════════════════════════════╗
║     🎮 MINECRAFT BOT                  ║
╚════════════════════════════════════════╝
1) Iniciar Bot
2) Detener Bot
0) Salir
`);

  const choice = await question('Opción: ');

  switch (choice.trim()) {
    case '1':
      startBot();
      break;
    case '2':
      stopBot();
      break;
    case '0':
      console.log('Saliendo...\n');
      rl.close();
      process.exit(0);
    default:
      console.log('Inválido\n');
  }

  setTimeout(menu, 2000);
}

async function init() {
  if (!process.env.ATERNOS_USERNAME || !process.env.ATERNOS_PASSWORD) {
    await setupEnv();
  }
  menu();
}

init();
