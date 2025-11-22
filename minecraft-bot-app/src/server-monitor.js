class ServerMonitor {
  constructor(aternosClient, discordNotifier, checkIntervalMs = 30000) {
    this.aternosClient = aternosClient;
    this.discordNotifier = discordNotifier;
    this.checkIntervalMs = checkIntervalMs;
    this.monitoringInterval = null;
    this.lastKnownStatus = null;
    this.failedChecks = 0;
    this.startTimeMs = Date.now();
  }

  start() {
    console.log('📡 Iniciando monitoreo del servidor...');
    
    this.monitoringInterval = setInterval(async () => {
      await this.checkServerStatus();
    }, this.checkIntervalMs);

    this.checkServerStatus();
  }

  stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('📡 Monitoreo del servidor detenido');
    }
  }

  async checkServerStatus() {
    try {
      const status = await this.aternosClient.getServerStatus();
      
      if (!status) {
        this.failedChecks++;
        if (this.failedChecks === 1) {
          await this.discordNotifier.notifyError('Error al verificar servidor', 'No se pudo conectar a la API de Aternos');
        }
        return;
      }

      this.failedChecks = 0;

      // Cambio de estado
      if (this.lastKnownStatus?.status !== status.status) {
        await this.handleStatusChange(this.lastKnownStatus?.status, status.status, status);
      }

      this.lastKnownStatus = status;
    } catch (err) {
      console.error('❌ Error en monitoreo:', err.message);
    }
  }

  async handleStatusChange(oldStatus, newStatus, statusInfo) {
    console.log(`📊 Estado del servidor cambió: ${oldStatus || 'desconocido'} → ${newStatus}`);

    if (newStatus === 'online') {
      await this.discordNotifier.notifyServerOnline(statusInfo);
    } else if (newStatus === 'offline') {
      await this.discordNotifier.notifyServerOffline();
    } else if (newStatus === 'starting') {
      await this.discordNotifier.notifyServerStarting();
    }
  }

  async startServerIfOffline() {
    const status = await this.aternosClient.getServerStatus();
    
    if (!status) {
      console.log('❌ No se pudo verificar el estado del servidor');
      return false;
    }

    if (status.status === 'offline') {
      console.log('🚀 Servidor detectado como offline, iniciando...');
      await this.discordNotifier.notifyServerStarting();
      return await this.aternosClient.startServer();
    }

    return true;
  }

  getUptimeMs() {
    return Date.now() - this.startTimeMs;
  }

  getUptimeString() {
    const ms = this.getUptimeMs();
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  async getServerInfo() {
    const status = await this.aternosClient.getServerStatus();
    
    if (!status) {
      return {
        status: 'unknown',
        error: 'No se pudo obtener información'
      };
    }

    return {
      ...status,
      botUptime: this.getUptimeString()
    };
  }
}

module.exports = ServerMonitor;
