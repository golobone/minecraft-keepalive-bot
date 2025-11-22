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
  cyan: '\x1b[36m'
};

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupCredentials() {
  console.log(`${colors.cyan}📝 Configurando credenciales de Aternos...${colors.reset}`);
  
  const username = await askQuestion(`${colors.blue}Usuario de Aternos: ${colors.reset}`);
  const password = await askQuestion(`${colors.blue}Contraseña de Aternos: ${colors.reset}`);
  const webhook = await askQuestion(`${colors.blue}Discord Webhook URL (opcional, presiona Enter para saltar): ${colors.reset}`);
  
  const envContent = `ATERNOS_USERNAME=${username}\nATERNOS_PASSWORD=${password}\n${webhook ? `DISCORD_WEBHOOK_URL=${webhook}\n` : ''}`;
  
  fs.writeFileSync(path.join(process.cwd(), '.env'), envContent);
  console.log(`${colors.green}✅ Credenciales guardadas en .env${colors.reset}`);
  
  process.env.ATERNOS_USERNAME = username;
  process.env.ATERNOS_PASSWORD = password;
  if (webhook) process.env.DISCORD_WEBHOOK_URL = webhook;
}

async function initializeAternos() {
  const username = process.env.ATERNOS_USERNAME;
  const password = process.env.ATERNOS_PASSWORD;

  if (!username || !password) {
    console.log(`${colors.yellow}⚠️  Credenciales de Aternos no configuradas${colors.reset}`);
    await setupCredentials();
    return initializeAternos();
  }

  const client = new AternosClient();
  const authenticated = await client.authenticate(username, password);
  
  if (!authenticated) {
    console.log(`${colors.red}❌ Error de autenticación con Aternos${colors.reset}`);
    console.log(`${colors.yellow}Intenta verificar tu usuario y contraseña${colors.reset}`);
    return null;
  }

  return client;
}

function startBot() {
  if (botProcess) {
    console.log(`${colors.yellow}⚠️  Bot ya está corriendo${colors.reset}`);
    return;
  }

  console.log(`${colors.cyan}🤖 Iniciando bot de Minecraft...${colors.reset}`);
  botProcess = spawn('node', ['bot.js'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  botProcess.on('exit', (code) => {
    console.log(`${colors.yellow}⚠️  Bot detenido${colors.reset}`);
    botProcess = null;
  });

  botProcess.on('error', (err) => {
    console.log(`${colors.red}❌ Error: ${err.message}${colors.reset}`);
    botProcess = null;
  });

  console.log(`${colors.green}✅ Bot iniciado${colors.reset}`);
}

function stopBot() {
  if (!botProcess) {
    console.log(`${colors.yellow}⚠️  Bot no está corriendo${colors.reset}`);
    return;
  }

  console.log(`${colors.cyan}⏹️  Deteniendo bot...${colors.reset}`);
  botProcess.kill('SIGTERM');
  botProcess = null;
  console.log(`${colors.green}✅ Bot detenido${colors.reset}`);
}

async function startAternos(client) {
  if (!client) {
    console.log(`${colors.red}❌ Cliente de Aternos no disponible${colors.reset}`);
    return;
  }

  const success = await client.startServer();
  if (success) {
    console.log(`${colors.green}✅ Servidor Aternos iniciando...${colors.reset}`);
    console.log(`${colors.yellow}Espera 30-60 segundos a que se encienda completamente${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Error al iniciar Aternos${colors.reset}`);
  }
}

async function stopAternos(client) {
  if (!client) {
    console.log(`${colors.red}❌ Cliente de Aternos no disponible${colors.reset}`);
    return;
  }

  const success = await client.stopServer();
  if (success) {
    console.log(`${colors.green}✅ Servidor Aternos detenido${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Error al detener Aternos${colors.reset}`);
  }
}

async function showMenu() {
  console.clear();
  console.log(`${colors.cyan}
╔════════════════════════════════════════╗
║  🎮 Minecraft Bot - Panel de Control  ║
╚════════════════════════════════════════╝${colors.reset}\n`);

  console.log(`${colors.blue}Opciones:${colors.reset}`);
  console.log('1) Iniciar Bot + Aternos');
  console.log('2) Solo iniciar Bot');
  console.log('3) Encender Aternos');
  console.log('4) Apagar Aternos');
  console.log('5) Detener Bot');
  console.log('6) Reconfigurar credenciales');
  console.log('0) Salir\n');

  const choice = await askQuestion(`${colors.green}Elige una opción: ${colors.reset}`);
  
  const client = await initializeAternos();

  switch(choice) {
    case '1':
      console.log(`${colors.cyan}Encendiendo Aternos y bot...${colors.reset}`);
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
      console.log(`${colors.yellow}Saliendo...${colors.reset}`);
      rl.close();
      process.exit(0);
    default:
      console.log(`${colors.red}Opción inválida${colors.reset}`);
  }

  setTimeout(showMenu, 3000);
}

console.log(`${colors.cyan}🚀 Iniciando Minecraft Bot Launcher...${colors.reset}\n`);

showMenu().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});
