/**
 * Streamable HTTP Transport for Remote MCP Access
 * Uses the modern StreamableHTTPServerTransport
 */

import express, { Request, Response } from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createChhartMcpServer } from '../server-sse.js';

export function createHTTPServer(port: number = 3000) {
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

    app.use(express.json({ limit: '10mb' }));

    // Health check endpoint
    app.get('/health', (req: Request, res: Response) => {
        res.json({
            status: 'ok',
            service: 'chhart-mcp-server',
            version: '1.0.0',
            timestamp: new Date().toISOString()
        });
    });

    // Store active transports
    const transports = new Map<string, SSEServerTransport>();

    // SSE Endpoint - Starts a new session
    app.get('/sse', async (req: Request, res: Response) => {
        console.log('New SSE connection initiated');

        const transport = new SSEServerTransport('/message', res);
        const server = createChhartMcpServer();

        // Register session immediately to handle race conditions
        const sessionId = transport.sessionId;
        if (sessionId) {
            transports.set(sessionId, transport);
            console.log(`Session created: ${sessionId}`);
        }

        let keepAliveInterval: NodeJS.Timeout;

        req.on('close', () => {
            console.log(`Session closed: ${sessionId}`);
            clearInterval(keepAliveInterval);
            if (sessionId) {
                transports.delete(sessionId);
            }
            server.close();
        });

        await server.connect(transport);

        // Keep-alive heartbeat every 15 seconds to prevent timeout
        keepAliveInterval = setInterval(() => {
            res.write(': keepalive\n\n');
        }, 15000);
    });

    // Message Endpoint - Receives JSON-RPC messages
    app.post('/message', async (req: Request, res: Response) => {
        const sessionId = req.query.sessionId as string;

        if (!sessionId) {
            res.status(400).send('Missing sessionId parameter');
            return;
        }

        const transport = transports.get(sessionId);
        if (!transport) {
            res.status(404).send('Session not found');
            return;
        }

        await transport.handlePostMessage(req, res, req.body);
    });

    // Start server
    app.listen(port, () => {
        console.error(`Chhart MCP Server (SSE) listening on port ${port}`);
        console.error(`Health check: http://localhost:${port}/health`);
        console.error(`SSE endpoint: http://localhost:${port}/sse`);
    });

    return app;
}
