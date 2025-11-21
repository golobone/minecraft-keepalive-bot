const axios = require('axios');
const fs = require('fs');
const path = require('path');

class AternosClient {
  constructor(sessionFile = '.aternos-session') {
    this.apiUrl = 'https://api.aternos.org/v1';
    this.sessionFile = sessionFile;
    this.session = null;
    this.serverId = null;
    this.lastStatus = null;
  }

  async authenticate(username, password) {
    try {
      console.log('🔐 Autenticando con Aternos...');
      
      const response = await axios.post(`${this.apiUrl}/account/login`, {
        username,
        password
      }, {
        headers: {
          'User-Agent': 'Minecraft-Keepalive-Bot/1.0',
          'Content-Type': 'application/json'
        }
      });

      this.session = response.data;
      this.saveSession();
      console.log('✅ Autenticación exitosa');
      return true;
    } catch (err) {
      console.error('❌ Error de autenticación:', err.message);
      return false;
    }
  }

  async getServerStatus() {
    try {
      if (!this.session) {
        this.loadSession();
      }

      const response = await axios.get(`${this.apiUrl}/server`, {
        headers: {
          'Authorization': `Bearer ${this.session?.token}`,
          'User-Agent': 'Minecraft-Keepalive-Bot/1.0'
        }
      });

      const status = response.data;
      this.lastStatus = status;
      return {
        status: status.status, // 'online', 'offline', 'starting', etc
        ip: status.ip,
        port: status.port,
        players: status.players?.online || 0,
        maxPlayers: status.players?.max || 20,
        motd: status.motd,
        version: status.version
      };
    } catch (err) {
      console.error('❌ Error al obtener estado del servidor:', err.message);
      return null;
    }
  }

  async startServer() {
    try {
      console.log('🚀 Iniciando servidor en Aternos...');
      
      const response = await axios.post(`${this.apiUrl}/server/start`, {}, {
        headers: {
          'Authorization': `Bearer ${this.session?.token}`,
          'User-Agent': 'Minecraft-Keepalive-Bot/1.0'
        }
      });

      console.log('✅ Comando de inicio enviado a Aternos');
      return true;
    } catch (err) {
      console.error('❌ Error al iniciar servidor:', err.message);
      return false;
    }
  }

  async stopServer() {
    try {
      console.log('⏹️ Deteniendo servidor en Aternos...');
      
      const response = await axios.post(`${this.apiUrl}/server/stop`, {}, {
        headers: {
          'Authorization': `Bearer ${this.session?.token}`,
          'User-Agent': 'Minecraft-Keepalive-Bot/1.0'
        }
      });

      console.log('✅ Comando de parada enviado a Aternos');
      return true;
    } catch (err) {
      console.error('❌ Error al detener servidor:', err.message);
      return false;
    }
  }

  saveSession() {
    try {
      fs.writeFileSync(this.sessionFile, JSON.stringify(this.session));
    } catch (err) {
      console.error('⚠️ Error al guardar sesión:', err.message);
    }
  }

  loadSession() {
    try {
      if (fs.existsSync(this.sessionFile)) {
        this.session = JSON.parse(fs.readFileSync(this.sessionFile, 'utf8'));
      }
    } catch (err) {
      console.error('⚠️ Error al cargar sesión:', err.message);
    }
  }
}

module.exports = AternosClient;
