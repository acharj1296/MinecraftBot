import mineflayer from 'mineflayer';
import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
  host: string;
  port: number;
  username: string;
  version: string;
  reconnectDelay: number;
}

function loadConfig(): Config {
  return {
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT || '25565', 10),
    username: process.env.USERNAME || 'AutoReconnectBot',
    version: process.env.VERSION || 'auto',
    reconnectDelay: parseInt(process.env.RECONNECT_DELAY || '5000', 10),
  };
}

async function main() {
  const config = loadConfig();
  let isConnecting = false;
  let bot: mineflayer.Bot | null = null;

  function log(message: string) {
    console.log(`[BOT] ${message}`);
  }

  function createBot() {
    if (isConnecting) return;
    isConnecting = true;

    log('Connecting...');

    const botOptions: any = {
      host: config.host,
      port: config.port,
      username: config.username,
    };

    if (config.version !== 'auto') {
      botOptions.version = config.version;
    }

    bot = mineflayer.createBot(botOptions);

    bot.once('spawn', () => {
      isConnecting = false;
      log('Connected');
    });

    bot.once('error', (err: Error) => {
      isConnecting = false;
      log(`Error: ${err.message}`);
    });

    bot.once('end', () => {
      isConnecting = false;
      log('Disconnected');
      log('Reconnecting...');
      setTimeout(createBot, config.reconnectDelay);
    });

    bot.once('kicked', (reason: string) => {
      isConnecting = false;
      log(`Disconnected: ${reason}`);
      log('Reconnecting...');
      setTimeout(createBot, config.reconnectDelay);
    });
  }

  createBot();

  process.on('SIGINT', () => {
    log('Stopping...');
    if (bot) {
      bot.end();
    }
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    log('Stopping...');
    if (bot) {
      bot.end();
    }
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(`[BOT] Error: ${err.message}`);
  process.exit(1);
});