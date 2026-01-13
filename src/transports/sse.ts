/**
 * SSE (Server-Sent Events) Transport for Remote MCP Access
 * Enables the MCP server to be accessed over HTTP
 */

import express, { Request, Response } from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';


export function createSSEServer(mcpServer: Server, port: number = 3000) {
    const app = express();

    // Map to store active transports by session ID
    const transports = new Map<string, SSEServerTransport>();

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
            timestamp: new Date().toISOString()
        });
    });

    // SSE endpoint for MCP communication (changed to /mcp as requested)
    app.get('/mcp', async (req: Request, res: Response) => {
        console.log('New SSE connection initiated');

        // Set headers for SSE
        // We use setHeader because the SSEServerTransport calls writeHead internally.
        // Node.js merges these headers with the ones sent by writeHead.
        res.setHeader('X-Accel-Buffering', 'no'); // Prevent buffering by proxies

        // Initialize transport
        // The endpoint URL passed here tells the client where to send POST messages
        // We use /messages so it's distinct from the SSE stream
        const transport = new SSEServerTransport('/messages', res);

        // Store transport properly - getting sessionId requires accessing internal property or handling it differently
        // For SSEServerTransport, the session ID is generated internally or we need to manage it.
        // The SDK's SSEServerTransport writes the 'endpoint' event with the session ID appended if we provide a base URL.
        // actually, sdk implementation details: 
        // new SSEServerTransport(endpoint, res) -> sends `event: endpoint\ndata: {endpoint}?sessionId={uuid}`

        console.log('Connecting transport to MCP server...');
        await mcpServer.connect(transport);

        // We need to capture the sessionId to store the transport for POST requests.
        // Since the SDK doesn't expose it easily in the public API of the transport instance before connection,
        // we might rely on the fact that for simple use cases (single active connection per transport instance),
        // we need to know which transport handles which request.
        // 
        // WORKAROUND: The current SDK SSEServerTransport logic keeps the res open. 
        // Incoming POSTs need to be routed to the correct transport.
        // We will intercept the sessionId from the query string in the POST handler.
        // But we need to know WHICH transport corresponds to that ID.
        // 
        // Since we can't easily extract the ID from the `transport` object (it's private or generated inside start),
        // we will override the session handling slightly or use a workaround:
        // The SDK's `transport.sessionId` is public.

        const sessionId = transport.sessionId;
        if (sessionId) {
            transports.set(sessionId, transport);
            console.log(`Transport connected with Session ID: ${sessionId}`);
        }

        // Heartbeat to keep connection alive
        const heartbeatInterval = setInterval(() => {
            res.write(': keepalive\n\n');
        }, 15000); // 15 seconds

        // Cleanup on disconnect
        req.on('close', () => {
            console.log(`SSE connection closed for session: ${sessionId}`);
            clearInterval(heartbeatInterval);
            if (sessionId) {
                transports.delete(sessionId);
            }
            // Ensure we close the transport connection to the MCP server
            // transport.close() // method might not exist or be async, SDK handles cleanup usually
        });
    });

    // Message endpoint for client requests
    app.post('/messages', async (req: Request, res: Response) => {
        const sessionId = req.query.sessionId as string;

        if (!sessionId) {
            res.status(400).send('Missing sessionId parameter');
            return;
        }

        const transport = transports.get(sessionId);

        if (!transport) {
            res.status(404).send(`Session not found: ${sessionId}`);
            return;
        }

        try {
            await transport.handlePostMessage(req, res);
        } catch (error) {
            console.error('Error handling POST message:', error);
            res.status(500).json({ error: String(error) });
        }
    });

    // Start server
    app.listen(port, () => {
        console.error(`Chhart MCP Server (SSE mode) listening on port ${port}`);
        console.error(`Health check: http://localhost:${port}/health`);
        console.error(`MCP endpoint: http://localhost:${port}/mcp`);
    });

    return app;
}
