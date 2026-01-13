/**
 * MCP Tool: Create Flowchart
 * Creates a flowchart on chhart.app and returns a shareable URL
 */

import { z } from 'zod';
import { generateFlowchartUrl } from '../utils/urlEncoder.js';

export const createFlowchartSchema = z.object({
    content: z.string().describe('Flowchart content in Chhart DSL format (indented outline)'),
    title: z.string().optional().describe('Optional title for the flowchart')
});

export type CreateFlowchartInput = z.infer<typeof createFlowchartSchema>;

export async function createFlowchart(input: CreateFlowchartInput) {
    const { content, title } = input;

    // Validate content is not empty
    if (!content.trim()) {
        return {
            content: [
                {
                    type: 'text' as const,
                    text: 'Error: Flowchart content cannot be empty'
                }
            ],
            isError: true
        };
    }

    // Generate shareable URL
    const url = generateFlowchartUrl(content, title);

    // Create preview of the structure
    const lines = content.split('\n').filter(line => line.trim());
    const preview = lines.slice(0, 10).join('\n');
    const hasMore = lines.length > 10;

    const responseText = `✅ Flowchart created successfully!

**Shareable URL:**
${url}

**Preview:**
\`\`\`
${preview}${hasMore ? '\n... (truncated)' : ''}
\`\`\`

${title ? `**Title:** ${title}\n` : ''}**Total nodes:** ${lines.length}

Open the URL in your browser to view and edit the flowchart on chhart.app.`;

    return {
        content: [
            {
                type: 'text' as const,
                text: responseText
            }
        ]
    };
}
