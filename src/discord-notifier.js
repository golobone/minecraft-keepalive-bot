const axios = require('axios');

class DiscordNotifier {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
    this.lastMessageId = null;
    const isValid = webhookUrl && typeof webhookUrl === 'string' && webhookUrl.startsWith('https://');
    this.isEnabled = !!isValid;
    
    if (webhookUrl && !isValid) {
      console.log('⚠️  Discord Webhook URL inválido. Recibido:', typeof webhookUrl, webhookUrl ? '(no vacío)' : '(vacío)');
    }
    
    if (!webhookUrl) {
      console.log('⚠️  Discord Webhook URL no configurado');
    }
  }

  async deleteLastMessage() {
    if (!this.lastMessageId || !this.isEnabled) return;

    try {
      const deleteUrl = `${this.webhookUrl}/messages/${this.lastMessageId}`;
      await axios.delete(deleteUrl, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      console.log('🗑️ Mensaje anterior eliminado de Discord');
      this.lastMessageId = null;
    } catch (err) {
      // No imprimir error si el mensaje no existe
    }
  }

  async sendNotification(title, description, color = 3447003, fields = []) {
    if (!this.isEnabled) {
      console.log(`[Discord] ${title}: ${description}`);
      return;
    }

    try {
      // Borrar mensaje anterior
      await this.deleteLastMessage();

      const embed = {
        title: title,
        description: description,
        color: color,
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Minecraft Keepalive Bot',
          icon_url: 'https://crafatar.com/avatars/00000000000000000000000000000000?overlay'
        }
      };

      if (fields.length > 0) {
        embed.fields = fields;
      }

      const payload = {
        embeds: [embed]
      };

      const response = await axios.post(this.webhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      
      // Guardar ID del nuevo mensaje
      if (response.data && response.data.id) {
        this.lastMessageId = response.data.id;
      }
      
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
      '✅ El bot se ha conectado exitosamente y está en modo espectador.',
      3066993,
      [
        { name: '📍 Ubicación', value: '0, 70, 0', inline: true },
        { name: '⚙️ Modo', value: 'Espectador', inline: true },
        { name: '🔄 Estado', value: 'Activo', inline: true }
      ]
    );
  }

  async notifyBotDisconnected(reason) {
    await this.sendNotification(
      '🔌 Bot desconectado',
      `**Razón:** ${reason}\n\n⏳ Intentando reconectar automáticamente...`,
      15158332,
      [
        { name: '⚠️ Estado', value: 'Offline', inline: true },
        { name: '🔄 Reconexión', value: 'Activa', inline: true }
      ]
    );
  }

  async notifyReconnectionAttempt(attempt, maxAttempts, waitTime) {
    const seconds = Math.round(waitTime / 1000);
    const progressBar = this.createProgressBar(attempt, maxAttempts);
    
    await this.sendNotification(
      '🔄 Reconectando...',
      `**Intento ${attempt}/${maxAttempts}**\n\n⏱️ Esperando ${seconds}s antes del siguiente intento\n\n\`\`\`\n${progressBar}\n\`\`\``,
      16776960,
      [
        { name: '📊 Progreso', value: `${attempt}/${maxAttempts}`, inline: true },
        { name: '⏳ Espera', value: `${seconds}s`, inline: true }
      ]
    );
  }

  createProgressBar(current, max) {
    const filled = Math.round((current / max) * 10);
    const empty = 10 - filled;
    return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
  }

  async notifyError(title, error) {
    await this.sendNotification(
      `❌ ${title}`,
      `**Error detectado:**\n\`\`\`\n${error}\n\`\`\`\n\n🔄 Reconectando automáticamente...`,
      15158332,
      [
        { name: '⚠️ Tipo', value: title, inline: true },
        { name: '🕐 Hora', value: new Date().toLocaleTimeString('es-ES'), inline: true }
      ]
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
