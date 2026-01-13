/**
 * MCP Tool: Get Syntax Help
 * Returns documentation on Chhart's DSL syntax
 */

import { z } from 'zod';
import {
    FLOWCHART_SYNTAX,
    SANKEY_SYNTAX,
    COMBINED_SYNTAX,
    FLOWCHART_EXAMPLES,
    SANKEY_EXAMPLES
} from '../utils/syntaxHelp.js';

/**
 * Zod schema for validating getSyntaxHelp tool input.
 * Allows specifying which type of syntax documentation to retrieve.
 */
export const getSyntaxHelpSchema = z.object({
    type: z.enum(['flowchart', 'sankey', 'all'])
        .default('all')
        .describe('Which syntax documentation to retrieve')
});

/**
 * Input type for the getSyntaxHelp tool.
 */
export type GetSyntaxHelpInput = z.infer<typeof getSyntaxHelpSchema>;

/**
 * Returns comprehensive documentation and examples for Chhart's DSL syntax.
 * 
 * @param input - Specifies which syntax documentation to retrieve (flowchart, sankey, or all)
 * @returns MCP tool response with syntax documentation and examples
 * @example
 * ```typescript
 * const result = await getSyntaxHelp({ type: 'flowchart' });
 * ```
 */
export async function getSyntaxHelp(input: GetSyntaxHelpInput) {
    const { type } = input;

    let syntax = '';
    let examples: Array<{ title: string; content: string }> = [];

    switch (type) {
        case 'flowchart':
            syntax = FLOWCHART_SYNTAX;
            examples = FLOWCHART_EXAMPLES;
            break;
        case 'sankey':
            syntax = SANKEY_SYNTAX;
            examples = SANKEY_EXAMPLES;
            break;
        case 'all':
            syntax = COMBINED_SYNTAX;
            examples = [...FLOWCHART_EXAMPLES, ...SANKEY_EXAMPLES];
            break;
    }

    const examplesText = examples
        .map(ex => `### ${ex.title}\n\`\`\`\n${ex.content}\n\`\`\``)
        .join('\n\n');

    const responseText = `# Chhart Syntax Documentation

${syntax}

---

## Examples

${examplesText}

---

**Need help?** Visit https://chhart.app for interactive examples and more documentation.`;

    return {
        content: [
            {
                type: 'text' as const,
                text: responseText
            }
        ]
    };
}
