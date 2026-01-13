# Chhart MCP Server

An MCP (Model Context Protocol) server that enables AI assistants like ChatGPT, Claude, and others to programmatically create flowcharts and Sankey diagrams on [chhart.app](https://chhart.app).

## Features

- 🎨 **Create Flowcharts** - Generate flowcharts using Chhart's intuitive text-based DSL
- 📊 **Create Sankey Diagrams** - Build Sankey diagrams from flow data
- 📚 **Syntax Help** - Get comprehensive documentation and examples
- 🔗 **Shareable URLs** - All diagrams come with shareable chhart.app links
- 🚀 **Easy Integration** - Works with any MCP-compatible AI assistant

## Installation

```bash
npm install
npm run build
```

## Usage

### Local Mode (stdio)

For use with Claude Desktop, Cursor, or other local MCP clients:

1. Build the project:
```bash
npm run build
```

2. Add to your MCP client configuration (e.g., Claude Desktop's `claude_desktop_config.json`):
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

3. Restart your MCP client

### Remote Mode (SSE)

For deployment to Railway, Vercel, or other cloud platforms (coming soon).

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
- `flows` (array, required) - Array of flow objects with `source`, `target`, and `value`
- `title` (string, optional) - Title for the diagram

**Example:**
```typescript
{
  "flows": [
    { "source": "Revenue", "target": "Costs", "value": 40 },
    { "source": "Revenue", "target": "Profit", "value": 60 },
    { "source": "Costs", "target": "Salaries", "value": 25 }
  ],
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

# Watch mode
npm run watch

# Run locally
npm start
```

## How It Works

The MCP server generates shareable URLs by encoding chart data into the URL hash, leveraging chhart.app's existing URL-based sharing feature. This means:

- ✅ No backend API required
- ✅ Charts are fully client-side
- ✅ URLs work immediately without storage
- ✅ Charts can be edited on chhart.app

## License

MIT

## Links

- [Chhart.app](https://chhart.app)
- [Model Context Protocol](https://modelcontextprotocol.io)
