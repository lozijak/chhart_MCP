/**
 * URL Encoder for Chhart.app
 * Encodes chart data into URL-safe format for shareable links
 */

/**
 * Encodes chart content into a URL-safe base64 string.
 * Converts the content to base64 and replaces characters that are not URL-safe.
 * 
 * @param content - The chart content to encode (Chhart DSL format)
 * @returns A URL-safe base64 encoded string
 * @example
 * ```typescript
 * const encoded = encodeChartData("Start\n  End");
 * // Returns: "U3RhcnQKICBFbmQ"
 * ```
 */
export function encodeChartData(content: string): string {
    // Convert to base64 and make URL-safe
    const base64 = Buffer.from(content, 'utf-8').toString('base64');
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Generates a shareable URL for a flowchart on chhart.app.
 * The URL includes the encoded flowchart content and optional title in the hash fragment.
 * 
 * @param content - The flowchart content in Chhart DSL format
 * @param title - Optional title for the flowchart
 * @returns A complete URL to view the flowchart on chhart.app
 * @example
 * ```typescript
 * const url = generateFlowchartUrl("Start\n  End", "My Flowchart");
 * // Returns: "https://chhart.app/#flowchart=U3RhcnQKICBFbmQ&title=My%20Flowchart"
 * ```
 */
export function generateFlowchartUrl(content: string, title?: string): string {
    const encoded = encodeChartData(content);
    const baseUrl = 'https://chhart.app';

    // Build URL with encoded content
    let url = `${baseUrl}/#flowchart=${encoded}`;

    if (title) {
        const encodedTitle = encodeURIComponent(title);
        url += `&title=${encodedTitle}`;
    }

    return url;
}

/**
 * Generates a shareable URL for a Sankey diagram on chhart.app.
 * The URL includes the encoded Sankey diagram content and optional title in the hash fragment.
 * 
 * @param content - The Sankey diagram content in Chhart DSL format
 * @param title - Optional title for the Sankey diagram
 * @returns A complete URL to view the Sankey diagram on chhart.app
 * @example
 * ```typescript
 * const url = generateSankeyUrl("Revenue [value=100]\n  Profit [value=60]", "Budget");
 * // Returns: "https://chhart.app/#sankey=...&title=Budget"
 * ```
 */
export function generateSankeyUrl(content: string, title?: string): string {
    const encoded = encodeChartData(content);
    const baseUrl = 'https://chhart.app';

    let url = `${baseUrl}/#sankey=${encoded}`;

    if (title) {
        const encodedTitle = encodeURIComponent(title);
        url += `&title=${encodedTitle}`;
    }

    return url;
}

/**
 * Decodes a URL-safe base64 string back to original content.
 * Reverses the URL-safe encoding and converts base64 back to UTF-8 text.
 * 
 * @param encoded - The URL-safe base64 encoded string
 * @returns The original decoded content
 * @example
 * ```typescript
 * const decoded = decodeChartData("U3RhcnQKICBFbmQ");
 * // Returns: "Start\n  End"
 * ```
 */
export function decodeChartData(encoded: string): string {
    // Restore standard base64 format
    let base64 = encoded
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
        base64 += '=';
    }

    return Buffer.from(base64, 'base64').toString('utf-8');
}
