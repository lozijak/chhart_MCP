# Contributing to Chhart MCP Server

Thank you for your interest in contributing to the Chhart MCP Server! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue using the bug report template. Include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your environment (OS, Node.js version, MCP client)
- Any relevant logs or error messages

### Suggesting Features

Feature requests are welcome! Please create an issue using the feature request template and describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternative solutions you've considered
- Additional context or examples

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** using the PR template

## Development Setup

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/chhart-mcp-server.git
cd chhart-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Test locally (stdio mode)
node dist/index.js

# Test SSE mode
npm run start:sse
```

### Project Structure

```
chhart_MCP/
├── src/
│   ├── index.ts           # Main entry point (stdio mode)
│   ├── server-sse.ts      # SSE server entry point
│   ├── tools/             # MCP tool implementations
│   │   ├── createFlowchart.ts
│   │   ├── createSankey.ts
│   │   └── getSyntaxHelp.ts
│   ├── utils/             # Utility functions
│   │   ├── urlEncoder.ts
│   │   └── syntaxHelp.ts
│   └── transports/        # Transport implementations
│       └── sse.ts
├── dist/                  # Compiled JavaScript (generated)
└── docs/                  # Documentation files
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Provide type annotations for function parameters and return values
- Use meaningful variable and function names
- Avoid `any` types when possible

### Code Style

- Use 4 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Keep lines under 100 characters when reasonable
- Use ES6+ features (arrow functions, destructuring, etc.)

### Documentation

- Add JSDoc comments for all exported functions, classes, and types
- Include parameter descriptions and return value documentation
- Add inline comments for complex logic
- Update README.md if adding new features

### Example

```typescript
/**
 * Generates a shareable URL for a flowchart
 * @param content - The flowchart content in Chhart DSL format
 * @param title - Optional title for the flowchart
 * @returns A complete URL to view the flowchart on chhart.app
 */
export function generateFlowchartUrl(content: string, title?: string): string {
    // Implementation...
}
```

## Testing

Before submitting a PR:

1. **Build the project**: `npm run build`
2. **Test stdio mode**: Verify the server works with a local MCP client
3. **Test SSE mode**: Start the server and test with HTTP requests
4. **Check for TypeScript errors**: `npx tsc --noEmit`

## Commit Messages

Write clear, concise commit messages:

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and PRs when relevant

Examples:
```
Add support for custom color schemes
Fix session cleanup in SSE transport
Update README with deployment instructions
```

## Release Process

Maintainers will handle releases. Version numbers follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with your question
- Check existing issues and discussions
- Review the documentation in the `docs/` directory

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
