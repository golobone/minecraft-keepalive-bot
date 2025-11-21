const axios = require('axios');

class DiscordNotifier {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
    this.isEnabled = !!webhookUrl && webhookUrl.startsWith('https://');
    if (webhookUrl && !this.isEnabled) {
      console.log('⚠️  Discord Webhook URL inválido (no comienza con https://)');
    }
  }

  async sendNotification(title, description, color = 3447003) {
    if (!this.isEnabled) {
      console.log(`[Discord] ${title}: ${description}`);
      return;
    }

    try {
      const payload = {
        embeds: [
          {
            title: title,
            description: description,
            color: color,
            timestamp: new Date().toISOString()
          }
        ]
      };

      await axios.post(this.webhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      
      console.log(`✅ Notificación enviada a Discord: ${title}`);
    } catch (err) {
      console.error(`❌ Error al enviar notificación a Discord:`, err.message);
    }
  }

  async notifyServerStarting() {
    await this.sendNotification(
      '🚀 Servidor iniciando',
      'El servidor de Aternos está comenzando...',
      3066993
    );
  }

  async notifyServerOnline(serverInfo) {
    const description = `
**IP:** ${serverInfo.ip || 'Desconocida'}
**Puerto:** ${serverInfo.port || '25565'}
**Jugadores:** ${serverInfo.players || '0'}/${serverInfo.maxPlayers || 'N/A'}
**Uptime:** ${serverInfo.uptime || 'Inicializando...'}
    `.trim();

    await this.sendNotification(
      '✅ Servidor Online',
      description,
      65280
    );
  }

  async notifyServerOffline() {
    await this.sendNotification(
      '⛔ Servidor Offline',
      'El servidor se ha apagado o está inaccesible.',
      15158332
    );
  }

  async notifyBotConnected() {
    await this.sendNotification(
      '🤖 Bot conectado',
      'El bot de Minecraft se ha conectado exitosamente al servidor.',
      3447003
    );
  }

  async notifyBotDisconnected(reason) {
    await this.sendNotification(
      '🔌 Bot desconectado',
      `Razón: ${reason}`,
      16711680
    );
  }

  async notifyReconnectionAttempt(attempt, maxAttempts, waitTime) {
    await this.sendNotification(
      '🔄 Reintentando conexión',
      `Intento ${attempt}/${maxAttempts} - Esperando ${Math.round(waitTime / 1000)}s`,
      16776960
    );
  }

  async notifyError(title, error) {
    await this.sendNotification(
      `❌ ${title}`,
      `Error: ${error}`,
      16711680
    );
  }

  async notifyServerInfo(info) {
    const description = `
**Estado:** ${info.status}
**IP:** ${info.ip || 'N/A'}
**Puerto:** ${info.port || 'N/A'}
**Jugadores:** ${info.players || '0'}/${info.maxPlayers || 'N/A'}
**Uptime:** ${info.uptime || 'N/A'}
**Último ping:** ${new Date().toLocaleString()}
    `.trim();

    await this.sendNotification(
      '📊 Información del servidor',
      description,
      7419530
    );
  }
}

module.exports = DiscordNotifier;
