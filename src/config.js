module.exports = {
  // Minecraft Bot Config
  minecraft: {
    host: 'Aleatrio.aternos.me',
    port: 16024,
    username: 'EternalAFK',
    version: false,
    auth: 'offline'
  },
  
  // Aternos API Config
  aternos: {
    apiUrl: 'https://api.aternos.org/v1',
    sessionFile: '.aternos-session'
  },
  
  // Discord Config
  discord: {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL || null
  },
  
  // Monitoring Config
  monitoring: {
    checkIntervalMs: 30000, // Check every 30 seconds
    maxReconnectAttempts: 10,
    baseReconnectDelayMs: 10000,
    monitoringEnabled: process.env.DISCORD_WEBHOOK_URL ? true : false
  }
};
