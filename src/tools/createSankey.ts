import { z } from 'zod';
import { generateSankeyUrl } from '../utils/urlEncoder.js';

/**
 * Zod schema for validating createSankey tool input.
 * Ensures content is provided and title is optional.
 */
export const createSankeySchema = z.object({
    content: z.string().describe('Sankey diagram content in Chhart DSL format (indented outline with [value=N] attributes)'),
    title: z.string().optional().describe('Optional title for the Sankey diagram')
});

/**
 * Input type for the createSankey tool.
 */
export type CreateSankeyInput = z.infer<typeof createSankeySchema>;

/**
 * Creates a Sankey diagram on chhart.app and returns a shareable URL.
 * 
 * @param input - The Sankey diagram content and optional title
 * @returns MCP tool response with the generated URL and preview
 * @example
 * ```typescript
 * const result = await createSankey({
 *   content: "Revenue [value=100]\n  Profit [value=60]",
 *   title: "Budget Flow"
 * });
 * ```
 */
export async function createSankey(input: CreateSankeyInput) {
    const { content, title } = input;

    // Validate content is not empty
    if (!content.trim()) {
        return {
            content: [
                {
                    type: 'text' as const,
                    text: 'Error: Sankey content cannot be empty'
                }
            ],
            isError: true
        };
    }

    // Generate shareable URL
    const url = generateSankeyUrl(content, title);

    // Create preview of the structure
    const lines = content.split('\n').filter(line => line.trim());
    const preview = lines.slice(0, 10).join('\n');
    const hasMore = lines.length > 10;

    const responseText = `✅ Sankey diagram created successfully!

**Shareable URL:**
${url}

**Preview:**
\`\`\`
${preview}${hasMore ? '\n... (truncated)' : ''}
\`\`\`

${title ? `**Title:** ${title}\n` : ''}**Total lines:** ${lines.length}

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
