module.exports = {
  // Minecraft Bot Config
  minecraft: {
    host: 'mundus.play.hosting',
    port: 46099,
    username: 'EternalAFK',
    version: '1.16.5',
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
