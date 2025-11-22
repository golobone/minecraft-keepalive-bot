#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const AternosClient = require('./src/aternos-client.js');

let botProcess = null;
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bgBlue: '\x1b[44m',
  bgGreen: '\x1b[42m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function setupCredentials() {
  console.log(`\n${colors.cyan}${colors.bold}📝 Configurando credenciales${colors.reset}\n`);
  
  const username = await askQuestion(`${colors.blue}Usuario de Aternos: ${colors.reset}`);
  const password = await askQuestion(`${colors.blue}Contraseña de Aternos: ${colors.reset}`);
  const webhook = await askQuestion(`${colors.blue}Discord Webhook (opcional, Enter para saltar): ${colors.reset}`);
  
  const envContent = `ATERNOS_USERNAME=${username}\nATERNOS_PASSWORD=${password}\n${webhook ? `DISCORD_WEBHOOK_URL=${webhook}\n` : ''}`;
  
  fs.writeFileSync(path.join(process.cwd(), '.env'), envContent);
  console.log(`\n${colors.green}✅ Credenciales guardadas${colors.reset}\n`);
  
  process.env.ATERNOS_USERNAME = username;
  process.env.ATERNOS_PASSWORD = password;
  if (webhook) process.env.DISCORD_WEBHOOK_URL = webhook;
}

async function initializeAternos() {
  const username = process.env.ATERNOS_USERNAME;
  const password = process.env.ATERNOS_PASSWORD;

  if (!username || !password) {
    console.log(`${colors.yellow}⚠️  Credenciales no encontradas${colors.reset}`);
    await setupCredentials();
    return initializeAternos();
  }

  const client = new AternosClient();
  const authenticated = await client.authenticate(username, password);
  
  if (!authenticated) {
    console.log(`${colors.red}❌ Error de autenticación${colors.reset}`);
    return null;
  }

  return client;
}

function startBot() {
  if (botProcess) {
    console.log(`${colors.yellow}⚠️  Bot ya está corriendo${colors.reset}`);
    return;
  }

  console.log(`${colors.cyan}🤖 Iniciando bot...${colors.reset}`);
  botProcess = spawn('node', ['bot.js'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  botProcess.on('exit', (code) => {
    console.log(`${colors.yellow}⚠️  Bot detenido${colors.reset}`);
    botProcess = null;
  });

  console.log(`${colors.green}✅ Bot iniciado${colors.reset}`);
}

function stopBot() {
  if (!botProcess) {
    console.log(`${colors.yellow}⚠️  Bot no está corriendo${colors.reset}`);
    return;
  }

  botProcess.kill('SIGTERM');
  botProcess = null;
  console.log(`${colors.green}✅ Bot detenido${colors.reset}`);
}

async function startAternos(client) {
  if (!client) {
    console.log(`${colors.red}❌ Aternos no disponible${colors.reset}`);
    return;
  }

  const success = await client.startServer();
  if (success) {
    console.log(`${colors.green}✅ Aternos iniciando... (espera 30-60 seg)${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Error al iniciar Aternos${colors.reset}`);
  }
}

async function stopAternos(client) {
  if (!client) {
    console.log(`${colors.red}❌ Aternos no disponible${colors.reset}`);
    return;
  }

  const success = await client.stopServer();
  if (success) {
    console.log(`${colors.green}✅ Aternos detenido${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Error al detener Aternos${colors.reset}`);
  }
}

async function showMenu() {
  console.clear();
  console.log(`${colors.cyan}${colors.bold}
╔════════════════════════════════════════╗
║     🎮 MINECRAFT BOT - CONTROL        ║
╚════════════════════════════════════════╝${colors.reset}
`);

  console.log(`${colors.bold}Selecciona una opción:${colors.reset}\n`);
  
  const buttons = [
    { key: 'a', label: '🚀 Iniciar Bot + Aternos', id: '1' },
    { key: 'b', label: '🤖 Solo Bot', id: '2' },
    { key: 'c', label: '⚡ Encender Aternos', id: '3' },
    { key: 'd', label: '🔌 Apagar Aternos', id: '4' },
    { key: 'e', label: '⏹️  Detener Bot', id: '5' },
    { key: 'f', label: '🔑 Reconfigurar', id: '6' },
    { key: 'g', label: '❌ Salir', id: '0' }
  ];

  buttons.forEach(btn => {
    console.log(`  ${colors.bgBlue}${colors.white} ${btn.key.toUpperCase()} ${colors.reset} ${btn.label}`);
  });

  console.log();
  const choice = await askQuestion(`${colors.green}Elige (a-g): ${colors.reset}`);
  
  const buttonMap = { a: '1', b: '2', c: '3', d: '4', e: '5', f: '6', g: '0' };
  const selected = buttonMap[choice] || '-1';
  
  const client = await initializeAternos();

  switch(selected) {
    case '1':
      console.log(`\n${colors.cyan}Encendiendo Aternos y bot...${colors.reset}`);
      await startAternos(client);
      setTimeout(() => startBot(), 2000);
      break;
    case '2':
      console.log();
      startBot();
      break;
    case '3':
      console.log();
      await startAternos(client);
      break;
    case '4':
      console.log();
      await stopAternos(client);
      break;
    case '5':
      console.log();
      stopBot();
      break;
    case '6':
      await setupCredentials();
      break;
    case '0':
      console.log(`\n${colors.yellow}👋 Saliendo...${colors.reset}\n`);
      rl.close();
      process.exit(0);
    default:
      console.log(`\n${colors.red}❌ Opción inválida${colors.reset}`);
  }

  setTimeout(showMenu, 3000);
}

console.log(`${colors.cyan}🚀 Iniciando Minecraft Bot...${colors.reset}\n`);

showMenu().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});
