# Chhart MCP Server Configuration Examples

## Claude Desktop Configuration

Add this to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

Replace `/absolute/path/to/chhart_MCP` with the actual path to this project.

---

## Cursor Configuration

Add to `.cursor/mcp_config.json`:

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

---

## Remote SSE Configuration

For remote access via SSE (after deploying to Railway):

```json
{
  "mcpServers": {
    "chhart": {
      "url": "https://your-app.railway.app/sse"
    }
  }
}
```

---

## Environment Variables (SSE Mode)

When running in SSE mode, you can configure:

```bash
# Port to listen on (default: 3000)
PORT=3000

# Node environment
NODE_ENV=production
```

---

## Testing the Configuration

After adding the configuration:

1. Restart your MCP client (Claude Desktop, Cursor, etc.)
2. Check the logs to ensure the server connected successfully
3. Try asking: "What tools do you have available?"
4. You should see: `create_flowchart`, `create_sankey`, `get_syntax_help`

---

## Troubleshooting

### Server not connecting
- Ensure the path to `dist/index.js` is absolute
- Check that you've run `npm run build`
- Verify Node.js is installed and in PATH

### Tools not appearing
- Restart the MCP client completely
- Check the client's logs for error messages
- Ensure the config JSON is valid (no trailing commas)

### Generated URLs not working
- The DSL is correct, but chhart.app needs URL hash parsing
- As a workaround, copy the DSL content and paste into chhart.app
- See URL_FORMAT_NOTES.md for integration details
