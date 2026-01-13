/**
 * URL Encoder for Chhart.app
 * Encodes chart data into URL-safe format for shareable links
 */

/**
 * Encodes chart content into a URL-safe base64 string
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
 * Generates a shareable URL for a flowchart
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
 * Generates a shareable URL for a Sankey diagram
 */
export function generateSankeyUrl(
    flows: Array<{ source: string; target: string; value: number }>,
    title?: string
): string {
    // Group flows by source for proper indentation
    const flowsBySource = new Map<string, Array<{ target: string; value: number }>>();

    flows.forEach(f => {
        if (!flowsBySource.has(f.source)) {
            flowsBySource.set(f.source, []);
        }
        flowsBySource.get(f.source)!.push({ target: f.target, value: f.value });
    });

    // Convert flows to Chhart Sankey format with proper indentation
    const sankeyLines: string[] = [];
    flowsBySource.forEach((targets, source) => {
        sankeyLines.push(source);
        targets.forEach(t => {
            sankeyLines.push(`  [value=${t.value}] ${t.target}`);
        });
    });

    const sankeyContent = sankeyLines.join('\n');

    const encoded = encodeChartData(sankeyContent);
    const baseUrl = 'https://chhart.app';

    let url = `${baseUrl}/#sankey=${encoded}`;

    if (title) {
        const encodedTitle = encodeURIComponent(title);
        url += `&title=${encodedTitle}`;
    }

    return url;
}

/**
 * Decodes a URL-safe base64 string back to original content
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
