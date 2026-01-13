# URL Format Investigation

## Current Status

The MCP server generates URLs in the format:
```
https://chhart.app/#flowchart=<base64_encoded_content>&title=<title>
https://chhart.app/#sankey=<base64_encoded_content>&title=<title>
```

## Testing Results

### ✅ DSL Validation
The generated DSL is **100% valid** and renders perfectly when manually entered into chhart.app:
- Flowchart nodes render correctly
- Attributes work (shape=diamond, bg=green, bg=red)
- Indentation creates proper connections
- Visual output matches expectations

### ⚠️ URL Hash Parsing
The current production version of chhart.app (as of 2026-01-13) does **not yet parse** the URL hash parameters `#flowchart=` or `#sankey=`.

When users navigate to a URL like:
```
https://chhart.app/#flowchart=U3RhcnQKICBEZWNpc2lvbj8...
```

The page loads but shows the default welcome chart instead of parsing the hash.

## Recommended Solutions

### Option 1: Update chhart.app (Recommended)
Add URL hash parsing to the production chhart.app to match the MCP's URL format. This would involve:

1. Adding a hash change listener in the app
2. Parsing `#flowchart=` and `#sankey=` parameters
3. Decoding base64 content
4. Loading the decoded content into the editor

Example implementation location: `src/hooks/useUrlState.ts` or similar

### Option 2: Manual Copy-Paste (Current Workaround)
Users can:
1. Get the shareable URL from the MCP
2. Decode the base64 content (MCP can provide this)
3. Manually paste into chhart.app editor

### Option 3: API Endpoint
Create a backend API that:
1. Receives chart data
2. Stores it with a short ID
3. Returns URL like `https://chhart.app/view/<id>`

## Next Steps

Since you own chhart.app, the recommended approach is **Option 1**: Update the production app to parse URL hash parameters. This would make the MCP fully functional with zero manual intervention.

The MCP is ready to use - it just needs the corresponding URL parsing feature in the web app.
