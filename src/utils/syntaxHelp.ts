/**
 * Chhart Syntax Documentation
 * Provides comprehensive documentation and examples for Chhart's DSL syntax
 */

/**
 * Documentation for Chhart flowchart syntax.
 * Includes basic structure, attributes, styling, and examples.
 */
export const FLOWCHART_SYNTAX = `
# Chhart Flowchart Syntax

Chhart uses a simple text-based syntax that resembles an outline:

## Basic Structure
- Each line represents a node in the flowchart
- Indentation creates connections (parent → child)
- Use attributes in square brackets to customize appearance

## Basic Example
\`\`\`
Start
  Process Step 1
    Decision? [shape=diamond]
      Yes
        Action A
        End
      No
        Action B
        End
\`\`\`

## Attributes
Add attributes in square brackets after node text:

- **Shape**: [shape=diamond], [shape=circle], [shape=rectangle]
- **Color**: [color=blue], [color=#FF5733]
- **Background**: [bg=green], [bg=#E0E0E0]
- **Border**: [border=red], [border=2px solid blue]

## Styling Examples
\`\`\`
Blue Text [color=blue]
Green Background [bg=green]
Diamond Shape [shape=diamond]
Custom Border [border=2px dashed red]
\`\`\`

## Containers
Use curly braces to group related items:
\`\`\`
Container {
  Item 1
  Item 2
  Item 3
}
\`\`\`

## Tips
- Keep it simple - write like an outline
- Indent to show flow/hierarchy
- Use descriptive names for clarity
- Add attributes for visual emphasis
`;

/**
 * Documentation for Chhart Sankey diagram syntax.
 * Includes flow format, value notation, and multi-level flow examples.
 */
export const SANKEY_SYNTAX = `
# Chhart Sankey Diagram Syntax

Sankey diagrams show flows between nodes with weighted connections.

## Basic Format
Use indentation to define flows from a source node:
\`\`\`
Source Node
  [value=number] Target Node
\`\`\`

## Simple Example
\`\`\`
Revenue
  [value=60] Profit
  [value=40] Costs
Costs
  [value=25] Salaries
  [value=15] Operations
\`\`\`

## Multi-level Flows
\`\`\`
Energy Production
  [value=400] Residential
  [value=350] Commercial
  [value=250] Industrial
Residential
  [value=300] Heating
  [value=100] Lighting
\`\`\`

## Tips
- Use indentation (2 spaces) to show flows from a source
- Values represent flow magnitude/weight
- Nodes are created automatically from source/target names
- Flows can split and merge
- Total input should equal total output for balanced diagrams
`;

/**
 * Combined documentation for both flowchart and Sankey diagram syntax.
 */
export const COMBINED_SYNTAX = FLOWCHART_SYNTAX + '\n\n' + SANKEY_SYNTAX;

/**
 * Example flowcharts demonstrating common patterns and use cases.
 */
export const FLOWCHART_EXAMPLES = [
  {
    title: 'Simple Decision Flow',
    content: `Start
  Check Condition [shape=diamond]
    True
      Execute Action
      End [bg=green]
    False
      Skip Action
      End [bg=red]`
  },
  {
    title: 'Process Workflow',
    content: `Begin Process
  Gather Input
  Validate Data [shape=diamond]
    Valid
      Process Data
      Save Results [bg=green]
      Complete
    Invalid
      Show Error [bg=red]
      Request Correction
      Gather Input`
  }
];

/**
 * Example Sankey diagrams demonstrating flow visualization patterns.
 */
export const SANKEY_EXAMPLES = [
  {
    title: 'Budget Allocation',
    content: `Revenue
  [value=40] Operating Costs
  [value=30] Marketing
  [value=30] Profit
Operating Costs
  [value=25] Salaries
  [value=15] Infrastructure`
  },
  {
    title: 'Energy Flow',
    content: `Solar
  [value=500] Grid
Wind
  [value=300] Grid
Grid
  [value=400] Residential
  [value=250] Commercial
  [value=150] Industrial`
  }
];
