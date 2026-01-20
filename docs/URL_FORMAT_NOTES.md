# URL Format Notes

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

### ✅ URL Hash Parsing
The production version of chhart.app **parses** the URL hash parameters `#flowchart=` and `#sankey=` as of **2026-01-20**.

When users navigate to a URL like:
```
https://chhart.app/#flowchart=U3RhcnQKICBEZWNpc2lvbj8...
```

The app loads the encoded diagram automatically.

## Notes

- Titles are read from the optional `&title=` parameter.
- Large diagrams may still hit browser URL length limits.
