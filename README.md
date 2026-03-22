# MCP YouTube Transcript Downloader

A minimalist MCP server to download YouTube video transcripts using the Supadata API.

## Features

- **Simple**: Only 1 tool (`get_transcript`)
- **Lightweight**: No unnecessary dependencies
- **Configurable**: Token from file or environment variable
- **Robust**: Basic error handling

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- A free Supadata API key

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get a free API key

Sign up at [https://supadata.ai](https://supadata.ai) — **100 requests/month FREE, no credit card required**.

### 3. Add your API key

Create a file named `token_api.txt` in the project root with your API key:

```
sd_your_api_key_here
```

Or set it as an environment variable:

```bash
export SUPADATA_API_KEY="sd_your_api_key_here"
```

### 4. Build

```bash
npm run build
```

### 5. Configure in your AI client

**OpenCode:**
```json
{
  "mcpServers": {
    "youtube-transcript": {
      "type": "local",
      "command": ["node", "dist/index.js"],
      "environment": {
        "SUPADATA_API_KEY": "sd_your_api_key_here"
      }
    }
  }
}
```

**Claude Desktop:**
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

## Usage

### Available Tools

#### `get_transcript`

Downloads the transcript of a YouTube video.

**Parameters:**
- `youtube_url` (string): Full YouTube video URL

**Example request:**
```json
{
  "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Full transcript text here..."
    }
  ]
}
```

## Supadata Free Tier

| Feature | Free Limit |
|---------|-----------|
| Requests/month | 100 |
| Credit card required | No |
| Cost | Free |

Get your key at [https://supadata.ai](https://supadata.ai).

## Project Structure

```
├── src/
│   └── index.ts          # Main MCP server
├── dist/                 # Compiled output (generated)
├── token_api.txt         # API token (do not commit)
├── .env.example          # Example environment file
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
