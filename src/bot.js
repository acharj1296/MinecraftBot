// Minecraft bot implementation using Mineflayer
// Handles connection, join detection, and basic error handling

import mineflayer from 'mineflayer';

/**
 * Creates and configures a Mineflayer bot instance
 * @param {Object} config - Configuration object from loadConfig()
 * @returns {Object} The Mineflayer bot instance
 */
export function createBot(config) {
  // Prepare Mineflayer options
  const botOptions = {
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    // Auth handling
    ...(config.auth === 'online'
      ? {
          auth: 'microsoft',
          // For Microsoft auth, you can provide tokens
          ...(config.msAuthToken && { accessToken: config.msAuthToken }),
          ...(config.clientToken && { clientToken: config.clientToken }),
        }
      : {
          // Offline mode - no auth required
          auth: 'offline',
        }),
    // Optional password for offline mode servers that require it
    ...(config.password && { password: config.password }),
    // Optional proxy
    ...(config.proxy && { proxy: config.proxy }),
    // Keep alive
    keepAlive: config.keepAlive,
    // Disable some features we don't need for Phase 1
    hideErrors: false,
    skipValidation: false,
  };

  const bot = mineflayer.createBot(botOptions);

  // Store config on bot for reference
  bot.config = config;

  // Connection state tracking
  let hasJoined = false;

  // Event: Spawned in world (successfully joined)
  bot.once('spawn', () => {
    hasJoined = true;
    console.log('\x1b[32m%s\x1b[0m', `✓ Successfully joined the server as ${bot.username}`);
    console.log('\x1b[36m%s\x1b[0m', `  Position: ${formatPosition(bot.entity.position)}`);
    console.log('\x1b[36m%s\x1b[0m', `  Gamemode: ${bot.game.gameMode || 'unknown'}`);
    console.log('\x1b[36m%s\x1b[0m', `  Dimension: ${bot.game.dimension || 'overworld'}`);
    console.log('\x1b[36m%s\x1b[0m', `  Health: ${bot.health}, Food: ${bot.food}`);
    console.log('\x1b[90m%s\x1b[0m', `  Server: ${config.host}:${config.port}`);
    console.log('\x1b[90m%s\x1b[0m', `  Version: ${config.version} | Auth: ${config.auth}`);
  });

  // Event: Login (for online mode)
  bot.on('login', () => {
    console.log('\x1b[33m%s\x1b[0m', '→ Logging in...');
  });

  // Event: Chat messages (for debugging)
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log('\x1b[90m%s\x1b[0m', `[Chat] <${username}> ${message}`);
  });

  // Event: Disconnect
  bot.on('end', (reason) => {
    console.log('\x1b[31m%s\x1b[0m', `✗ Disconnected: ${reason}`);
    if (hasJoined) {
      console.log('\x1b[33m%s\x1b[0m', 'Bot was previously joined. Auto-reconnect not implemented in Phase 1.');
    }
  });

  // Event: Connection error
  bot.on('error', (err) => {
    console.log('\x1b[31m%s\x1b[0m', `✗ Error: ${err.message}`);
    // Don't crash on errors, just log them
  });

  // Event: Kicked from server
  bot.on('kicked', (reason, loggedIn) => {
    console.log('\x1b[31m%s\x1b[0m', `✗ Kicked: ${reason}`);
    if (loggedIn) {
      console.log('\x1b[33m%s\x1b[0m', 'Was logged in when kicked.');
    }
  });

  // Event: Connection start
  bot.on('connect', () => {
    console.log('\x1b[33m%s\x1b[0m', `→ Connecting to ${config.host}:${config.port}...`);
  });

  // Event: Ready to spawn (after login for online mode)
  bot.on('ready', () => {
    if (config.auth === 'online') {
      console.log('\x1b[33m%s\x1b[0m', '→ Authenticated, spawning...');
    }
  });

  // Handle health changes (for visibility)
  bot.on('health', () => {
    if (bot.health <= 0 && hasJoined) {
      console.log('\x1b[31m%s\x1b[0m', '✗ Bot died!');
    }
  });

  return bot;
}

/**
 * Format a Vec3 position for display
 * @param {import('mineflayer').Vec3} pos
 * @returns {string}
 */
function formatPosition(pos) {
  if (!pos) return 'unknown';
  return `${Math.floor(pos.x)}, ${Math.floor(pos.y)}, ${Math.floor(pos.z)}`;
}

/**
 * Wait for the bot to successfully join the server
 * @param {Object} bot - The Mineflayer bot instance
 * @param {number} timeout - Timeout in milliseconds (default: 60000)
 * @returns {Promise<boolean>} True if joined successfully
 */
export function waitForJoin(bot, timeout = 60000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Connection timeout after ${timeout}ms`));
    }, timeout);

    // If already spawned, resolve immediately
    if (bot.entity && bot.entity.position) {
      clearTimeout(timer);
      resolve(true);
      return;
    }

    bot.once('spawn', () => {
      clearTimeout(timer);
      resolve(true);
    });

    bot.once('end', (reason) => {
      clearTimeout(timer);
      reject(new Error(`Disconnected before joining: ${reason}`));
    });

    bot.once('error', (err) => {
      // Only reject on fatal connection errors
      if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.message.includes('version')) {
        clearTimeout(timer);
        reject(err);
      }
    });

    bot.once('kicked', (reason) => {
      clearTimeout(timer);
      reject(new Error(`Kicked: ${reason}`));
    });
  });
}