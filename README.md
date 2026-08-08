# Minecraft Bot - Phase 1

A simple, clean Minecraft bot that connects to a server and successfully joins. Built with [Mineflayer](https://github.com/PrismarineJS/mineflayer).

## Features

- ✅ Connects to any Minecraft server (Java Edition)
- ✅ Configurable via environment variables
- ✅ Supports **online-mode** (Microsoft auth) and **offline-mode** servers
- ✅ Clear connection/join status reporting
- ✅ Graceful error handling
- ✅ Clean, modular code structure

## Requirements

- Node.js 18+
- A Minecraft server (Java Edition) to connect to

## Installation

```bash
# Clone or navigate to the project
cd minecraft-bot

# Install dependencies
npm install
```

## Configuration

1. Copy the example configuration:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your server details:

### For Offline-Mode Servers (Cracked/Offline)
```env
MINECRAFT_HOST=your-server.com
MINECRAFT_PORT=25565
MINECRAFT_USERNAME=MyBot
MINECRAFT_VERSION=1.20.4
MINECRAFT_AUTH=offline
```

### For Online-Mode Servers (Microsoft Auth)
```env
MINECRAFT_HOST=your-server.com
MINECRAFT_PORT=25565
MINECRAFT_USERNAME=YourMicrosoftEmail@example.com
MINECRAFT_VERSION=1.20.4
MINECRAFT_AUTH=online
MINECRAFT_MS_AUTH_TOKEN=your_microsoft_access_token
MINECRAFT_CLIENT_TOKEN=your_client_token
```

> **Note**: For online mode, you need a valid Microsoft access token. You can obtain one using tools like [`mslogin`](https://github.com/PrismarineJS/mslogin) or by implementing the Microsoft OAuth flow.

### Configuration Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MINECRAFT_HOST` | Yes | Server hostname or IP |
| `MINECRAFT_PORT` | Yes | Server port (default: 25565) |
| `MINECRAFT_USERNAME` | Yes | Bot username (or email for online mode) |
| `MINECRAFT_VERSION` | Yes | Minecraft version (e.g., `1.20.4`, `latest`) |
| `MINECRAFT_AUTH` | Yes | `online` or `offline` |
| `MINECRAFT_PASSWORD` | No | Password for offline servers that require it |
| `MINECRAFT_MS_AUTH_TOKEN` | Online only | Microsoft access token |
| `MINECRAFT_CLIENT_TOKEN` | Online only | Microsoft client token |
| `MINECRAFT_PROXY` | No | Proxy URL (http/socks5) |
| `MINECRAFT_KEEP_ALIVE` | No | Keep-alive interval in ms (default: 30000) |

## Running the Bot

```bash
# Start the bot
npm start

# Or for development with auto-reload
npm run dev
```

## Expected Output

On successful connection:
```
╔══════════════════════════════════════════╗
║     Minecraft Bot - Phase 1              ║
║     Connect & Join                       ║
╚══════════════════════════════════════════╝

✓ Configuration loaded
  Host: your-server.com:25565
  Username: MyBot
  Version: 1.20.4
  Auth: offline

→ Creating bot instance...
→ Connecting to your-server.com:25565...
✓ Successfully joined the server as MyBot
  Position: 100, 64, 100
  Gamemode: survival
  Dimension: overworld
  Health: 20, Food: 20
  Server: your-server.com:25565
  Version: 1.20.4 | Auth: offline

══════════════════════════════════════
✓ Phase 1 Complete: Bot successfully joined!
══════════════════════════════════════

Bot is now connected and waiting. Press Ctrl+C to exit.
```

## Error Handling

The bot handles common connection errors gracefully:

| Error | Meaning | Solution |
|-------|---------|----------|
| `ECONNREFUSED` | Server not reachable | Check host/port, ensure server is running |
| `ETIMEDOUT` | Connection timeout | Check firewall, network, server status |
| `Version mismatch` | Wrong MC version | Match `MINECRAFT_VERSION` to server |
| `Kicked: ...` | Server rejected connection | Check auth mode, username, whitelist |
| `Invalid token` | Online auth failed | Regenerate Microsoft tokens |

## Project Structure

```
minecraft-bot/
├── package.json          # Dependencies and scripts
├── .env.example          # Configuration template
├── .env                  # Your config (gitignored)
├── README.md             # This file
└── src/
    ├── index.js          # Entry point
    ├── config.js         # Configuration loader
    └── bot.js            # Bot creation and connection logic
```

## What's NOT in Phase 1

These features are planned for future phases:
- ❌ Auto-reconnect on disconnect
- ❌ Chat responses / AI
- ❌ Movement / pathfinding
- ❌ Mining, crafting, combat
- ❌ Inventory management
- ❌ Web dashboard / API

## License

MIT