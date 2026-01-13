/**
 * SSE (Server-Sent Events) Transport for Remote MCP Access
 * Enables the MCP server to be accessed over HTTP
 */

import express, { Request, Response } from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

export function createSSEServer(mcpServer: Server, port: number = 3000) {
    const app = express();

    // Enable CORS for cross-origin requests
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

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

    // SSE endpoint for MCP communication
    app.get('/sse', async (req: Request, res: Response) => {
        console.error('New SSE connection established');

        const transport = new SSEServerTransport('/message', res);
        await mcpServer.connect(transport);

        // Handle client disconnect
        req.on('close', () => {
            console.error('SSE connection closed');
        });
    });

    // Message endpoint for client requests
    app.post('/message', async (req: Request, res: Response) => {
        // This will be handled by the SSE transport
        res.sendStatus(200);
    });

    // Start server
    app.listen(port, () => {
        console.error(`Chhart MCP Server (SSE mode) listening on port ${port}`);
        console.error(`Health check: http://localhost:${port}/health`);
        console.error(`SSE endpoint: http://localhost:${port}/sse`);
    });

    return app;
}
