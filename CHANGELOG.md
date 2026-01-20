# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-01-20

### Changed
- Bump package and server version strings to 1.0.2

## [1.0.1] - 2026-01-20

### Changed
- Bump server version strings to 1.0.1
- Align documentation with StreamableHTTP as the recommended remote transport
- Update docs to reflect chhart.app URL hash parsing support

## [1.0.0] - 2026-01-13

### Added
- Initial release of Chhart MCP Server
- Support for creating flowcharts using Chhart DSL
- Support for creating Sankey diagrams using Chhart DSL
- Syntax help tool for documentation and examples
- Local mode (stdio) for Claude Desktop, Cursor, and other MCP clients
- Remote mode (SSE) for cloud deployments
- Railway deployment support with Dockerfile
- Shareable URL generation for all diagrams
- Health check endpoint for monitoring
- CORS support for cross-origin requests
- Session management for SSE connections
- Heartbeat mechanism to keep connections alive

### Documentation
- Comprehensive README with usage examples
- Configuration examples for various MCP clients
- Railway deployment guide
- URL format documentation
- Implementation notes for URL parsing

[1.0.2]: https://github.com/alwank/chhart_MCP/releases/tag/v1.0.2
[1.0.1]: https://github.com/alwank/chhart_MCP/releases/tag/v1.0.1
[1.0.0]: https://github.com/alwank/chhart_MCP/releases/tag/v1.0.0
