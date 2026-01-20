#!/usr/bin/env node

/**
 * Chhart MCP Server - SSE Mode
 * HTTP server for remote MCP access
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
    createFlowchart,
    createFlowchartSchema,
    type CreateFlowchartInput
} from './tools/createFlowchart.js';

import {
    createSankey,
    createSankeySchema,
    type CreateSankeyInput
} from './tools/createSankey.js';

import {
    getSyntaxHelp,
    getSyntaxHelpSchema,
    type GetSyntaxHelpInput
} from './tools/getSyntaxHelp.js';

import { createSSEServer } from './transports/sse.js';

// Create MCP server instance factory
export function createChhartMcpServer() {
    const server = new Server(
        {
            name: 'chhart-mcp-server',
            version: '1.0.1',
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    // Register tool list handler
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: 'create_flowchart',
                    description: 'Create a flowchart on chhart.app using text-based DSL syntax. Returns a shareable URL to view and edit the flowchart.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            content: {
                                type: 'string',
                                description: 'Flowchart content in Chhart DSL format (indented outline structure)'
                            },
                            title: {
                                type: 'string',
                                description: 'Optional title for the flowchart'
                            }
                        },
                        required: ['content']
                    }
                },
                {
                    name: 'create_sankey',
                    description: 'Create a Sankey diagram on chhart.app showing flows between nodes. Returns a shareable URL to view and edit the diagram.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            content: {
                                type: 'string',
                                description: 'Sankey diagram content in Chhart DSL format (indented outline with [value=N] attributes)'
                            },
                            title: {
                                type: 'string',
                                description: 'Optional title for the Sankey diagram'
                            }
                        },
                        required: ['content']
                    }
                },
                {
                    name: 'get_syntax_help',
                    description: 'Get documentation and examples for Chhart\'s flowchart and Sankey diagram syntax.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string',
                                enum: ['flowchart', 'sankey', 'all'],
                                description: 'Which syntax documentation to retrieve',
                                default: 'all'
                            }
                        }
                    }
                }
            ]
        };
    });

    // Register tool execution handler
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        try {
            switch (name) {
                case 'create_flowchart': {
                    const input = createFlowchartSchema.parse(args) as CreateFlowchartInput;
                    return await createFlowchart(input);
                }

                case 'create_sankey': {
                    const input = createSankeySchema.parse(args) as CreateSankeyInput;
                    return await createSankey(input);
                }

                case 'get_syntax_help': {
                    const input = getSyntaxHelpSchema.parse(args || {}) as GetSyntaxHelpInput;
                    return await getSyntaxHelp(input);
                }

                default:
                    return {
                        content: [
                            {
                                type: 'text' as const,
                                text: `Unknown tool: ${name}`
                            }
                        ],
                        isError: true
                    };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [
                    {
                        type: 'text' as const,
                        text: `Error executing tool ${name}: ${errorMessage}`
                    }
                ],
                isError: true
            };
        }
    });

    return server;
}

// Start Server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    (async () => {
        const { createSSEServer } = await import('./transports/sse.js'); // Dynamic import ensures clean startup
        const { createChhartMcpServer } = await import('./server-sse.js'); // Import factory

        const port = parseInt(process.env.PORT || '3000', 10);
        // Pass the factory function, not an instance
        createSSEServer(createChhartMcpServer, port);
    })();
}
