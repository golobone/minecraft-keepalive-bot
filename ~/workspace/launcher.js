#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
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
  console.log('\n📝 Primeras credenciales\n');
  const webhook = await question('Discord Webhook URL (Enter para saltar): ');

  let env = '';
  if (webhook.trim()) env = `DISCORD_WEBHOOK_URL=${webhook}\n`;

  fs.writeFileSync('.env', env);
  if (webhook.trim()) process.env.DISCORD_WEBHOOK_URL = webhook;

  console.log('\n✅ Listo!\n');
}

function startBot() {
  if (botProcess) {
    console.log('\n⚠️  Bot ya está corriendo\n');
    return;
  }
  console.log('\n🤖 Bot iniciando...\n');
  botProcess = spawn('node', ['bot.js'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  botProcess.on('exit', () => { botProcess = null; });
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
      console.log('\n👋 Saliendo\n');
      rl.close();
      process.exit(0);
    default:
      console.log('\n❌ Inválido\n');
  }

  setTimeout(menu, 2000);
}

async function init() {
  const envExists = fs.existsSync('.env');
  if (!envExists) {
    await setupEnv();
  }
  menu();
}

init();
