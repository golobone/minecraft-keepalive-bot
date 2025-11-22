module.exports = {
  minecraft: {
    host: 'Aleatrio.aternos.me',
    port: 16024,
    username: 'EternalAFK',
    version: false,
    auth: 'offline'
  },
  
  discord: {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL || null
  }
};
