/**
 * Streamable HTTP Transport for Remote MCP Access
 * Uses the modern StreamableHTTPServerTransport
 */

import express, { Request, Response } from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { randomUUID } from 'crypto';

export function createHTTPServer(mcpServer: Server, port: number = 3000) {
    const app = express();

    // Enable CORS for cross-origin requests
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id');

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
            timestamp: new Date().toISOString()
        });
    });

    // Create transport with session management
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
    });

    // Connect the MCP server to the transport
    mcpServer.connect(transport);

    // MCP endpoint - handles all MCP protocol messages
    app.post('/mcp', async (req: Request, res: Response) => {
        try {
            console.error('Received MCP request:', {
                method: req.method,
                headers: req.headers,
                body: req.body
            });

            await transport.handleRequest(req, res, req.body);
        } catch (error) {
            console.error('Error handling MCP request:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : String(error)
            });
        }
    });

    // Start server
    app.listen(port, () => {
        console.error(`Chhart MCP Server (Streamable HTTP) listening on port ${port}`);
        console.error(`Health check: http://localhost:${port}/health`);
        console.error(`MCP endpoint: http://localhost:${port}/mcp`);
    });

    return app;
}
