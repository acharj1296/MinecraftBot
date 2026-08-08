// Configuration loader for the Minecraft bot
// Loads settings from environment variables with sensible defaults

import dotenv from 'dotenv';
dotenv.config();

/**
 * Load and validate bot configuration from environment variables
 * @returns {Object} Validated configuration object
 */
export function loadConfig() {
  const config = {
    // Server connection settings
    host: process.env.MINECRAFT_HOST || 'localhost',
    port: parseInt(process.env.MINECRAFT_PORT, 10) || 25565,

    // Bot identity settings
    username: process.env.MINECRAFT_USERNAME || 'Bot',

    // Minecraft version (e.g., '1.20.4', '1.19.2', '1.18.2', or 'latest')
    version: process.env.MINECRAFT_VERSION || '1.20.4',

    // Authentication mode: 'online' for Microsoft auth, 'offline' for offline-mode servers
    auth: process.env.MINECRAFT_AUTH || 'offline',

    // Optional: password for online mode (if using offline mode with password-protected server)
    password: process.env.MINECRAFT_PASSWORD || '',

    // Optional: Microsoft auth token for online mode
    msAuthToken: process.env.MINECRAFT_MS_AUTH_TOKEN || '',

    // Optional: Client token for Microsoft auth
    clientToken: process.env.MINECRAFT_CLIENT_TOKEN || '',

    // Optional: Proxy settings
    proxy: process.env.MINECRAFT_PROXY || '',

    // Optional: Keep alive interval (ms)
    keepAlive: parseInt(process.env.MINECRAFT_KEEP_ALIVE, 10) || 30000,
  };

  // Validate required fields
  if (!config.host) {
    throw new Error('MINECRAFT_HOST is required');
  }

  if (config.port < 1 || config.port > 65535) {
    throw new Error('MINECRAFT_PORT must be between 1 and 65535');
  }

  if (!config.username) {
    throw new Error('MINECRAFT_USERNAME is required');
  }

  if (config.auth !== 'online' && config.auth !== 'offline') {
    throw new Error('MINECRAFT_AUTH must be either "online" or "offline"');
  }

  return config;
}