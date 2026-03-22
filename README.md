# 🎬 MCP YouTube Transcript Downloader

> Download YouTube video transcripts directly into your AI workflow — no more copying/pasting!

[![npm version](https://img.shields.io/npm/v/mcp-youtube-transcript)](https://www.npmjs.com/package/mcp-youtube-transcript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

A minimalist MCP server that fetches transcripts from YouTube videos using the [Supadata API](https://supadata.ai). Perfect for AI assistants that need to analyze video content, create summaries, or extract key information.

## ⚡ Features

- 🎯 **Two handy tools** — `get_transcript` for quick downloads, `get_transcript_and_save` for full path control
- 📦 **Zero dependencies** — lightweight and fast
- 🔑 **Flexible auth** — token from file or environment variable
- 🛡️ **Basic error handling** — clear error messages when things go wrong

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- A free Supadata API key

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Or use directly with npx
npx @milor123/mcp-youtube-transcript-downloader
```

### Get Your Free API Key

Sign up at **[https://supadata.ai](https://supadata.ai)**

> **100 requests/month FREE** — no credit card required! Perfect for personal projects and experimentation.

### Configuration

Create a `token_api.txt` file in the project root with your API key:

```
sd_your_api_key_here
```

Or set an environment variable:

```bash
export SUPADATA_API_KEY="sd_your_api_key_here"
```

---

## 📥 Available Tools

### `get_transcript`

Downloads a YouTube video transcript and saves it to a `.txt` file. Returns the transcript content and filename for use in subsequent operations.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `youtube_url` | string | ✅ | Full YouTube video URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`) |
| `filename` | string | ❌ | Custom filename without extension. If omitted, uses the video ID |

**Returns:**
- `content` — The full transcript text
- `_meta.filename` — The filename where transcript was saved
- `_meta.videoId` — The extracted YouTube video ID

**Example request:**
```json
{
  "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "filename": "rick_roll_transcript"
}
```

**Example response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Never gonna give you up, never gonna let you down..."
    }
  ],
  "_meta": {
    "filename": "rick_roll_transcript.txt",
    "videoId": "dQw4w9WgXcQ"
  }
}
```

---

### `get_transcript_and_save`

Downloads a YouTube video transcript and saves it to a **specific filepath** of your choice. Great when you need precise control over where files are stored.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `youtube_url` | string | ✅ | Full YouTube video URL |
| `filepath` | string | ✅ | Full filepath including `.txt` extension (e.g., `C:/Users/You/Documents/transcript.txt`) |

**Returns:**
- Confirmation message with the filepath where the transcript was saved

**Example request:**
```json
{
  "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "filepath": "C:/Users/You/Documents/my_transcripts/rick_roll.txt"
}
```

**Example response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Transcript saved to C:/Users/You/Documents/my_transcripts/rick_roll.txt"
    }
  ]
}
```

> 💡 **Tip:** This tool automatically creates parent directories if they don't exist!

---

## 🤖 AI Client Configuration

### OpenCode

#### Option 1 - Remote (recommended - coming soon)

```json
{
  "mcpServers": {
    "youtube-transcript": {
      "type": "remote",
      "url": "https://your-remote-mcp-server.com/youtube-transcript",
      "environment": {
        "SUPADATA_API_KEY": "sd_your_api_key_here"
      }
    }
  }
}
```

> Remote hosting allows sharing a single MCP server across multiple users. Contact the maintainer for server access.

#### Option 2 - Local (npx installation)

```json
{
  "mcpServers": {
    "youtube-transcript": {
      "type": "local",
      "command": ["npx", "@milor123/mcp-youtube-transcript-downloader"],
      "enabled": true,
      "environment": {
        "SUPADATA_API_KEY": "sd_28bee9cd727665ed7a6ceebcf4c90334"
      }
    }
  }
}
```

### Claude Desktop

```json
{
  "mcpServers": {
    "youtube-transcript": {
      "command": "node",
      "args": ["/full/path/to/dist/index.js"],
      "env": {
        "SUPADATA_API_KEY": "sd_your_api_key_here"
      }
    }
  }
}
```

---

## 💰 Supadata Free Tier

| Feature | Limit |
|---------|-------|
| Requests per month | **100** |
| Credit card required | ❌ No |
| Cost | **Free!** |

Get your API key at **[https://supadata.ai](https://supadata.ai)**

---

## 📁 Project Structure

```
@milor123/mcp-youtube-transcript-downloader/
├── src/
│   └── index.ts          # Main MCP server implementation
├── dist/                 # Compiled JavaScript output (generated after build)
├── token_api.txt         # Your API token (never commit this!)
├── package.json
├── tsconfig.json
└── README.md
```

---

## ❤️ Credits & Acknowledgments

This project was inspired by a script created by **[Mutti](https://greasyfork.org/users/1458847)** from [GreasyFork](https://greasyfork.org). Thank you for the original idea that sparked this MCP server!

---

## 📜 License

MIT License — feel free to use it in your projects!
