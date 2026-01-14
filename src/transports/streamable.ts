/**
 * StreamableHTTP Transport for Remote MCP Access
 * Modern, robust HTTP transport for MCP servers
 */

import express, { Request, Response } from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

/**
 * Creates an Express server with StreamableHTTP transport for remote MCP access.
 * This is the modern, recommended transport for production deployments.
 * 
 * @param createMcpServer - Factory function that creates a new MCP server instance
 * @param port - Port number to listen on (default: 3000)
 * @returns The Express application instance
 */
export function createStreamableServer(createMcpServer: () => Server, port: number = 3000) {
    const app = express();

    // Enable CORS for cross-origin requests
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
            return;
        }
        next();
    });

    app.use(express.json());

    // Health check endpoint
    app.get('/health', (req: Request, res: Response) => {
        res.json({
            status: 'ok',
            service: 'chhart-mcp-server',
            version: '1.0.0',
            transport: 'streamable-http',
            timestamp: new Date().toISOString()
        });
    });

    // Create a single stateless transport instance
    // Stateless mode means no session management - each request is independent
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // Stateless mode
    });

    // Create and connect the MCP server once
    const mcpServer = createMcpServer();
    mcpServer.connect(transport).catch((error) => {
        console.error('Failed to connect MCP server to transport:', error);
        process.exit(1);
    });

    // MCP endpoint for StreamableHTTP communication
    app.post('/mcp', async (req: Request, res: Response) => {
        console.error('New MCP request received');

        try {
            // Handle the request using the connected transport
            // The transport will parse the request body automatically
            await transport.handleRequest(req, res, req.body);

            console.error('MCP request completed successfully');
        } catch (error) {
            console.error('Error handling MCP request:', error);

            if (!res.headersSent) {
                res.status(500).json({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : String(error)
                });
            }
        }
    });

    // Start server
    app.listen(port, () => {
        console.error(`Chhart MCP Server (StreamableHTTP mode) listening on port ${port}`);
        console.error(`Health check: http://localhost:${port}/health`);
        console.error(`MCP endpoint: http://localhost:${port}/mcp`);
    });

    return app;
}
