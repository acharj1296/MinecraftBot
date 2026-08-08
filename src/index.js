// Minecraft Bot - Phase 1
// Main entry point: loads config, creates bot, connects and waits for join

import { loadConfig } from './config.js';
import { createBot, waitForJoin } from './bot.js';

/**
 * Main function to start the bot
 */
async function main() {
  console.log('\x1b[1m\x1b[36m%s\x1b[0m', '╔══════════════════════════════════════════╗');
  console.log('\x1b[1m\x1b[36m%s\x1b[0m', '║     Minecraft Bot - Phase 1              ║');
  console.log('\x1b[1m\x1b[36m%s\x1b[0m', '║     Connect & Join                       ║');
  console.log('\x1b[1m\x1b[36m%s\x1b[0m', '╚══════════════════════════════════════════╝\n');

  // Load configuration
  let config;
  try {
    config = loadConfig();
    console.log('\x1b[32m%s\x1b[0m', '✓ Configuration loaded');
    console.log('\x1b[90m%s\x1b[0m', `  Host: ${config.host}:${config.port}`);
    console.log('\x1b[90m%s\x1b[0m', `  Username: ${config.username}`);
    console.log('\x1b[90m%s\x1b[0m', `  Version: ${config.version}`);
    console.log('\x1b[90m%s\x1b[0m', `  Auth: ${config.auth}`);
    console.log();
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `✗ Configuration error: ${err.message}`);
    console.log('\x1b[90m%s\x1b[0m', 'Please check your .env file or environment variables.');
    process.exit(1);
  }

  // Create bot instance
  console.log('\x1b[33m%s\x1b[0m', '→ Creating bot instance...');
  const bot = createBot(config);

  // Wait for successful join
  try {
    await waitForJoin(bot, 60000); // 60 second timeout
    console.log('\n\x1b[1m\x1b[32m%s\x1b[0m', '══════════════════════════════════════');
    console.log('\x1b[1m\x1b[32m%s\x1b[0m', '✓ Phase 1 Complete: Bot successfully joined!');
    console.log('\x1b[1m\x1b[32m%s\x1b[0m', '══════════════════════════════════════\n');
    console.log('\x1b[90m%s\x1b[0m', 'Bot is now connected and waiting. Press Ctrl+C to exit.\n');

    // Keep the process alive - in Phase 1 we just stay connected
    // In later phases we'll add more functionality here
    await new Promise(() => {}); // Wait forever
  } catch (err) {
    console.error('\n\x1b[31m%s\x1b[0m', `✗ Connection failed: ${err.message}`);
    console.log('\x1b[90m%s\x1b[0m', '\nTroubleshooting:');
    console.log('\x1b[90m%s\x1b[0m', '  • Verify the server is running and accessible');
    console.log('\x1b[90m%s\x1b[0m', '  • Check that host and port are correct');
    console.log('\x1b[90m%s\x1b[0m', '  • Ensure the Minecraft version matches the server');
    console.log('\x1b[90m%s\x1b[0m', '  • For online mode: verify Microsoft auth tokens');
    console.log('\x1b[90m%s\x1b[0m', '  • For offline mode: ensure server allows cracked/offline players');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\x1b[33m%s\x1b[0m', '→ Shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\x1b[33m%s\x1b[0m', '→ Shutting down...');
  process.exit(0);
});

// Start the bot
main().catch((err) => {
  console.error('\x1b[31m%s\x1b[0m', `Fatal error: ${err.message}`);
  process.exit(1);
});