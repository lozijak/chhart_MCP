# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Chhart MCP Server seriously. If you discover a security vulnerability, please follow these steps:

### Please Do Not

- **Do not** open a public GitHub issue for security vulnerabilities
- **Do not** disclose the vulnerability publicly until it has been addressed

### Please Do

1. **Email us** at security@chhart.app with:
   - A description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact of the vulnerability
   - Any suggested fixes (if you have them)

2. **Allow time** for us to respond and address the issue before public disclosure

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Updates**: We will keep you informed about our progress addressing the vulnerability
- **Timeline**: We aim to release a fix within 30 days for critical vulnerabilities
- **Credit**: We will credit you in the release notes (unless you prefer to remain anonymous)

## Security Best Practices

When using Chhart MCP Server:

### For Local Deployments (stdio mode)
- Keep your Node.js runtime up to date
- Only install the MCP server from trusted sources
- Review the source code before running if concerned

### For Remote Deployments (StreamableHTTP mode)
- Use HTTPS in production environments
- Implement rate limiting to prevent abuse
- Monitor server logs for suspicious activity
- Keep dependencies updated regularly
- Use environment variables for sensitive configuration
- Implement proper authentication if exposing publicly

### Legacy SSE Mode
- SSE is still available but deprecated; only use it if your client requires it

### General Recommendations
- Regularly update to the latest version
- Review the CHANGELOG for security-related updates
- Follow the principle of least privilege
- Monitor your deployment for unusual activity

## Known Security Considerations

### URL Length Limits
- Generated URLs encode chart data in the hash fragment
- Very large diagrams may exceed browser URL length limits
- This is a limitation, not a vulnerability

### CORS Configuration
- The HTTP servers enable CORS with `Access-Control-Allow-Origin: *`
- This is intentional for MCP client compatibility
- If deploying publicly, consider restricting CORS origins

### Session Management (SSE Only)
- SSE connections use session IDs for routing
- Sessions are stored in-memory and cleared on disconnect
- No persistent session storage is implemented

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find similar problems
3. Prepare fixes for all supported versions
4. Release new versions as soon as possible
5. Publish a security advisory on GitHub

## Comments on This Policy

If you have suggestions on how this process could be improved, please submit a pull request or open an issue.

Thank you for helping keep Chhart MCP Server and its users safe!
