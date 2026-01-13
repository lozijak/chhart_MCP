#!/usr/bin/env node

/**
 * Chhart MCP Server
 * Enables AI assistants to create flowcharts and Sankey diagrams on chhart.app
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
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

// Create MCP server instance
const server = new Server(
    {
        name: 'chhart-mcp-server',
        version: '1.0.0',
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
                        flows: {
                            type: 'array',
                            description: 'Array of flows between nodes',
                            items: {
                                type: 'object',
                                properties: {
                                    source: {
                                        type: 'string',
                                        description: 'Source node name'
                                    },
                                    target: {
                                        type: 'string',
                                        description: 'Target node name'
                                    },
                                    value: {
                                        type: 'number',
                                        description: 'Flow value/weight (must be positive)'
                                    }
                                },
                                required: ['source', 'target', 'value']
                            }
                        },
                        title: {
                            type: 'string',
                            description: 'Optional title for the Sankey diagram'
                        }
                    },
                    required: ['flows']
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

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);

    // Log to stderr so it doesn't interfere with stdio communication
    console.error('Chhart MCP Server running on stdio');
    console.error('Available tools: create_flowchart, create_sankey, get_syntax_help');
}

main().catch((error) => {
    console.error('Fatal error starting server:', error);
    process.exit(1);
});
