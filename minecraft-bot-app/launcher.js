#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
require('dotenv').config();

const AternosClient = require('./src/aternos-client.js');

let botProcess = null;
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function initializeAternos() {
  const username = process.env.ATERNOS_USERNAME;
  const password = process.env.ATERNOS_PASSWORD;

  if (!username || !password) {
    console.log(`${colors.yellow}⚠️  Credenciales de Aternos no configuradas${colors.reset}`);
    return null;
  }

  const client = new AternosClient();
  const authenticated = await client.authenticate(username, password);
  
  if (!authenticated) {
    console.log(`${colors.red}❌ No se pudo autenticar con Aternos${colors.reset}`);
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
    console.log(`${colors.yellow}⚠️  Bot detenido (código: ${code})${colors.reset}`);
    botProcess = null;
  });

  botProcess.on('error', (err) => {
    console.log(`${colors.red}❌ Error en el bot: ${err.message}${colors.reset}`);
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
    console.log(`${colors.green}✅ Servidor Aternos deteniendo...${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Error al detener Aternos${colors.reset}`);
  }
}

async function checkStatus(client) {
  if (!client) {
    console.log(`${colors.yellow}⚠️  Aternos no disponible${colors.reset}`);
  } else {
    const status = await client.getServerStatus();
    if (status) {
      console.log(`${colors.cyan}📊 Estado de Aternos:${colors.reset}`);
      console.log(`   Estado: ${status.status}`);
      console.log(`   IP: ${status.ip}:${status.port}`);
      console.log(`   Jugadores: ${status.players}/${status.maxPlayers}`);
    }
  }

  const botStatus = botProcess ? `${colors.green}Corriendo ✅${colors.reset}` : `${colors.red}Detenido ❌${colors.reset}`;
  console.log(`${colors.cyan}Bot: ${botStatus}${colors.reset}`);
}

function showMenu() {
  console.clear();
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}🎮 MINECRAFT KEEPALIVE BOT - PANEL 🎮${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);
  console.log(`${colors.green}1${colors.reset}) 🤖 Iniciar Bot`);
  console.log(`${colors.green}2${colors.reset}) ⏹️  Detener Bot`);
  console.log(`${colors.green}3${colors.reset}) 🚀 Iniciar Servidor Aternos`);
  console.log(`${colors.green}4${colors.reset}) 🛑 Detener Servidor Aternos`);
  console.log(`${colors.green}5${colors.reset}) 📊 Ver Estado`);
  console.log(`${colors.green}6${colors.reset}) 🌀 Bot + Aternos (TODO)`);
  console.log(`${colors.green}0${colors.reset}) ❌ Salir\n`);
}

async function main() {
  const aternosClient = await initializeAternos();
  let running = true;

  showMenu();

  while (running) {
    rl.question(`${colors.cyan}Selecciona una opción: ${colors.reset}`, async (option) => {
      switch (option.trim()) {
        case '1':
          startBot();
          break;
        case '2':
          stopBot();
          break;
        case '3':
          await startAternos(aternosClient);
          break;
        case '4':
          await stopAternos(aternosClient);
          break;
        case '5':
          await checkStatus(aternosClient);
          break;
        case '6':
          console.log(`${colors.cyan}🌀 Iniciando Aternos y Bot...${colors.reset}`);
          await startAternos(aternosClient);
          setTimeout(() => startBot(), 10000); // Espera 10 segundos para que Aternos se inicie
          break;
        case '0':
          console.log(`${colors.yellow}Saliendo...${colors.reset}`);
          if (botProcess) {
            botProcess.kill();
          }
          rl.close();
          running = false;
          process.exit(0);
          break;
        default:
          console.log(`${colors.red}❌ Opción no válida${colors.reset}`);
      }

      if (running) {
        setTimeout(() => {
          showMenu();
        }, 1500);
      }
    });

    break;
  }
}

main().catch(console.error);
