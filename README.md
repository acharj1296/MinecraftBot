# Minecraft Auto-Reconnect Bot

A minimal Minecraft bot that connects to a server and automatically reconnects if disconnected.

## Features

- Connects to a Minecraft server
- Automatically reconnects on disconnect/kick/error
- Configurable server address, port, username, and version
- Safe reconnect delay (default 5 seconds)
- Prevents multiple simultaneous connection attempts
- Minimal logging (only essential connection status)

## Installation

1. Install Node.js (v18 or later)

2. Install dependencies:

```bash
npm install
```

3. Copy the example config and edit it:

```bash
cp .env.example .env
```

4. Edit `.env` with your server details:

```env
HOST=your-server.com
PORT=25565
USERNAME=YourBotName
VERSION=1.20.1
RECONNECT_DELAY=5000
```

## Usage

### Development (with TypeScript)

```bash
npm run dev
```

### Production (compiled JavaScript)

```bash
npm run build
npm start
```

## Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `HOST` | Yes | `localhost` | Server IP or domain |
| `PORT` | No | `25565` | Server port |
| `USERNAME` | Yes | `AutoReconnectBot` | Bot username |
| `VERSION` | No | `auto` | Minecraft version (e.g., `1.20.1`) or `auto` |
| `RECONNECT_DELAY` | No | `5000` | Reconnect delay in milliseconds |

## Log Output

The bot only logs essential connection status:

```
[BOT] Connecting...
[BOT] Connected
[BOT] Disconnected
[BOT] Reconnecting...
[BOT] Error: ...
```

## Stopping the Bot

Press `Ctrl+C` to gracefully stop the bot.