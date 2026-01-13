/**
 * MCP Tool: Create Sankey Diagram
 * Creates a Sankey diagram on chhart.app and returns a shareable URL
 */

import { z } from 'zod';
import { generateSankeyUrl } from '../utils/urlEncoder.js';

export const createSankeySchema = z.object({
    flows: z.array(
        z.object({
            source: z.string().describe('Source node name'),
            target: z.string().describe('Target node name'),
            value: z.number().positive().describe('Flow value/weight (must be positive)')
        })
    ).min(1).describe('Array of flows between nodes'),
    title: z.string().optional().describe('Optional title for the Sankey diagram')
});

export type CreateSankeyInput = z.infer<typeof createSankeySchema>;

export async function createSankey(input: CreateSankeyInput) {
    const { flows, title } = input;

    // Validate flows
    if (flows.length === 0) {
        return {
            content: [
                {
                    type: 'text' as const,
                    text: 'Error: At least one flow is required'
                }
            ],
            isError: true
        };
    }

    // Generate shareable URL
    const url = generateSankeyUrl(flows, title);

    // Create preview of flows
    const flowPreview = flows
        .slice(0, 10)
        .map(f => `  ${f.source} → ${f.target} (${f.value})`)
        .join('\n');
    const hasMore = flows.length > 10;

    // Calculate total flow
    const totalFlow = flows.reduce((sum, f) => sum + f.value, 0);

    // Get unique nodes
    const nodes = new Set<string>();
    flows.forEach(f => {
        nodes.add(f.source);
        nodes.add(f.target);
    });

    const responseText = `✅ Sankey diagram created successfully!

**Shareable URL:**
${url}

**Flow Preview:**
${flowPreview}${hasMore ? '\n  ... (truncated)' : ''}

${title ? `**Title:** ${title}\n` : ''}**Statistics:**
- Total flows: ${flows.length}
- Unique nodes: ${nodes.size}
- Total flow value: ${totalFlow}

Open the URL in your browser to view and edit the Sankey diagram on chhart.app.`;

    return {
        content: [
            {
                type: 'text' as const,
                text: responseText
            }
        ]
    };
}
