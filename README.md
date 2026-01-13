# Chhart MCP Server

[![npm version](https://img.shields.io/npm/v/chhart-mcp-server.svg)](https://www.npmjs.com/package/chhart-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)

An MCP (Model Context Protocol) server that enables AI assistants like ChatGPT, Claude, and others to programmatically create flowcharts and Sankey diagrams on [chhart.app](https://chhart.app).

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Quick Start (Public Server)](#quick-start-public-server)
  - [Local Mode (stdio)](#local-mode-stdio)
  - [Remote Mode (SSE)](#remote-mode-sse)
- [Available Tools](#available-tools)
- [Example Conversations](#example-conversations)
- [Development](#development)
- [How It Works](#how-it-works)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
- [Links](#links)

## Features

- 🎨 **Create Flowcharts** - Generate flowcharts using Chhart's intuitive text-based DSL
- 📊 **Create Sankey Diagrams** - Build Sankey diagrams from flow data
- 📚 **Syntax Help** - Get comprehensive documentation and examples
- 🔗 **Shareable URLs** - All diagrams come with shareable chhart.app links
- 🚀 **Easy Integration** - Works with any MCP-compatible AI assistant
- 🌐 **Dual Mode** - Run locally (stdio) or remotely (SSE over HTTP)
- ☁️ **Cloud Ready** - Deploy to Railway, Vercel, or any Node.js hosting

## Prerequisites

- **Node.js** 20 or higher
- **npm** or **yarn**
- An MCP-compatible client (Claude Desktop, Cursor, etc.)

## Installation

### From npm (Coming Soon)

```bash
npm install -g chhart-mcp-server
```

### From Source

```bash
# Clone the repository
git clone https://github.com/chhart/chhart-mcp-server.git
cd chhart-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Quick Start (Public Server)

You can use our managed MCP server without installing anything locally.

**Configure your MCP client** to connect to the public endpoint:

```json
{
  "mcpServers": {
    "chhart": {
      "url": "https://mcp.chhart.app/mcp"
    }
  }
}
```

### Local Mode (stdio)

For use with Claude Desktop, Cursor, or other local MCP clients:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Add to your MCP client configuration:**

   For **Claude Desktop**, edit `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "chhart": {
         "command": "node",
         "args": ["/absolute/path/to/chhart_MCP/dist/index.js"]
       }
     }
   }
   ```

   For **Cursor** or other clients, see [CONFIG_EXAMPLES.md](docs/CONFIG_EXAMPLES.md) for more examples.

3. **Restart your MCP client**

### Remote Mode (SSE)

For deployment to Railway, Vercel, or other cloud platforms:

1. **Build and start the SSE server:**
   ```bash
   npm run build
   npm run start:sse
   ```

   The server will start on port 3000 (or the port specified in `PORT` environment variable).

2. **Configure your MCP client** to connect to the remote endpoint:
   ```json
   {
     "mcpServers": {
       "chhart": {
         "url": "https://your-deployment-url.com/mcp"
       }
     }
   }
   ```

3. **Deploy to Railway:**
   
   See the [Railway Deployment Guide](docs/RAILWAY_DEPLOYMENT_GUIDE.md) for detailed instructions.

## Available Tools

### `create_flowchart`

Creates a flowchart using Chhart's text-based DSL.

**Parameters:**
- `content` (string, required) - Flowchart content in Chhart DSL format
- `title` (string, optional) - Title for the flowchart

**Example:**
```typescript
{
  "content": "Start\n  Process Step\n    Decision? [shape=diamond]\n      Yes\n        Action\n        End\n      No\n        Skip\n        End",
  "title": "Simple Workflow"
}
```

### `create_sankey`

Creates a Sankey diagram showing flows between nodes.

**Parameters:**
- `content` (string, required) - Sankey diagram content in Chhart DSL format
- `title` (string, optional) - Title for the diagram

**Example:**
```typescript
{
  "content": "Revenue [value=100]\n  Costs [value=40]\n    Salaries [value=25]\n    Operations [value=15]\n  Profit [value=60]",
  "title": "Budget Flow"
}
```

### `get_syntax_help`

Returns documentation and examples for Chhart syntax.

**Parameters:**
- `type` (enum, optional) - `'flowchart'`, `'sankey'`, or `'all'` (default: `'all'`)

## Example Conversations

Once configured, you can ask your AI assistant:

> "Create a flowchart showing a user login process with email verification"

> "Create a Sankey diagram showing how $100 of revenue splits into costs, taxes, and profit"

> "Show me the syntax for creating flowcharts in Chhart"

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch

# Run locally (stdio mode)
npm start

# Run SSE server
npm run start:sse
```

### Project Structure

```
chhart_MCP/
├── src/
│   ├── index.ts           # Main entry point (stdio mode)
│   ├── server-sse.ts      # SSE server entry point
│   ├── tools/             # MCP tool implementations
│   ├── utils/             # Utility functions
│   └── transports/        # Transport implementations
├── dist/                  # Compiled JavaScript (generated)
└── docs/                  # Documentation files
```

## How It Works

The MCP server generates shareable URLs by encoding chart data into the URL hash, leveraging chhart.app's existing URL-based sharing feature. This means:

- ✅ No backend API required
- ✅ Charts are fully client-side
- ✅ URLs work immediately without storage
- ✅ Charts can be edited on chhart.app
- ✅ Privacy-friendly (data stays in the URL)

## Troubleshooting

### "Command not found" or "Module not found"

- Ensure you've run `npm install` and `npm run build`
- Verify the path in your MCP client configuration is absolute
- Check that Node.js 20+ is installed: `node --version`

### SSE Connection Issues

- Verify the server is running: check the health endpoint at `http://localhost:3000/health`
- Check firewall settings if deploying remotely
- Ensure CORS is properly configured for your domain

### Charts Not Loading

- Verify the generated URL is complete and not truncated
- Check browser console for errors
- Try opening the URL directly in a browser
- Very large diagrams may exceed URL length limits (typically 2000 characters)

### TypeScript Build Errors

- Ensure you're using Node.js 20+
- Delete `node_modules` and `dist`, then run `npm install` and `npm run build`
- Check for TypeScript version compatibility

For more help, see [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Reporting bugs
- Suggesting features
- Submitting pull requests
- Development setup
- Coding standards

## Security

For security concerns, please see our [Security Policy](SECURITY.md). Do not open public issues for security vulnerabilities.

## License

MIT License - see [LICENSE](LICENSE) for details.

Copyright (c) 2026 Chhart.app

## Links

- [Chhart.app](https://chhart.app) - Create and share diagrams
- [Model Context Protocol](https://modelcontextprotocol.io) - Learn about MCP
- [Documentation](docs/) - Additional guides and examples
- [Changelog](CHANGELOG.md) - Version history and updates
- [Issues](https://github.com/chhart/chhart-mcp-server/issues) - Report bugs or request features
