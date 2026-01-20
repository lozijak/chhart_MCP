/**
 * SSE (Server-Sent Events) Transport for Remote MCP Access
 * Enables the MCP server to be accessed over HTTP
 */

import express, { Request, Response } from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';


/**
 * Creates an Express server with SSE transport for remote MCP access.
 * Enables the MCP server to be accessed over HTTP with Server-Sent Events.
 * 
 * @param createMcpServer - Factory function that creates a new MCP server instance
 * @param port - Port number to listen on (default: 3000)
 * @returns The Express application instance
 */
export function createSSEServer(createMcpServer: () => Server, port: number = 3000) {
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
            version: '1.0.1',
            timestamp: new Date().toISOString()
        });
    });

    // SSE endpoint for MCP communication (changed to /mcp as requested)
    app.get('/mcp', async (req: Request, res: Response) => {
        console.error('New SSE connection initiated');

        // Set headers for SSE
        // We use setHeader because the SSEServerTransport calls writeHead internally.
        // Node.js merges these headers with the ones sent by writeHead.
        res.setHeader('X-Accel-Buffering', 'no'); // Prevent buffering by proxies

        // Initialize transport
        // The endpoint URL passed here tells the client where to send POST messages
        // We use /messages so it's distinct from the SSE stream
        const transport = new SSEServerTransport('/messages', res);

        // Create a new MCP server instance for this connection
        // This is the correct pattern - each SSE connection gets its own server instance
        const mcpServer = createMcpServer();

        console.error('Connecting transport to MCP server...');
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
            console.error(`Transport connected with Session ID: ${sessionId}`);
        }

        // Heartbeat to keep connection alive
        const heartbeatInterval = setInterval(() => {
            try {
                res.write(': keepalive\n\n');
            } catch (error) {
                console.error('Error writing heartbeat:', error);
                clearInterval(heartbeatInterval);
            }
        }, 15000); // 15 seconds

        // Cleanup on disconnect
        req.on('close', () => {
            console.error(`SSE connection closed for session: ${sessionId}`);
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
            console.error(`Session not found: ${sessionId}. Active sessions:`, Array.from(transports.keys()));
            res.status(404).send(`Session not found: ${sessionId}`);
            return;
        }

        try {
            await transport.handlePostMessage(req, res, req.body);
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
