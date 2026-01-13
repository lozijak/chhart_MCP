/**
 * Test script for Chhart MCP Server
 * Verifies URL encoding and tool functionality
 */

import { generateFlowchartUrl, generateSankeyUrl, encodeChartData, decodeChartData } from './utils/urlEncoder.js';

console.log('=== Chhart MCP Server Tests ===\n');

// Test 1: URL Encoding/Decoding
console.log('Test 1: URL Encoding/Decoding');
const testContent = 'Start\n  Process\n  End';
const encoded = encodeChartData(testContent);
const decoded = decodeChartData(encoded);
console.log('Original:', testContent);
console.log('Encoded:', encoded);
console.log('Decoded:', decoded);
console.log('Match:', testContent === decoded ? '✅ PASS' : '❌ FAIL');
console.log();

// Test 2: Flowchart URL Generation
console.log('Test 2: Flowchart URL Generation');
const flowchartContent = `Start
  Decision? [shape=diamond]
    Yes
      Action A [bg=green]
      End
    No
      Action B [bg=red]
      End`;
const flowchartUrl = generateFlowchartUrl(flowchartContent, 'Test Flowchart');
console.log('Flowchart URL:', flowchartUrl);
console.log('URL includes encoded content:', flowchartUrl.includes('flowchart=') ? '✅ PASS' : '❌ FAIL');
console.log('URL includes title:', flowchartUrl.includes('title=') ? '✅ PASS' : '❌ FAIL');
console.log();

// Test 3: Sankey URL Generation
console.log('Test 3: Sankey URL Generation');
const sankeyFlows = [
    { source: 'Revenue', target: 'Costs', value: 40 },
    { source: 'Revenue', target: 'Profit', value: 60 },
    { source: 'Costs', target: 'Salaries', value: 25 },
    { source: 'Costs', target: 'Operations', value: 15 }
];
const sankeyUrl = generateSankeyUrl(sankeyFlows, 'Budget Flow');
console.log('Sankey URL:', sankeyUrl);
console.log('URL includes encoded content:', sankeyUrl.includes('sankey=') ? '✅ PASS' : '❌ FAIL');
console.log('URL includes title:', sankeyUrl.includes('title=') ? '✅ PASS' : '❌ FAIL');
console.log();

// Test 4: URL Length Check
console.log('Test 4: URL Length Check');
console.log('Flowchart URL length:', flowchartUrl.length, 'chars');
console.log('Sankey URL length:', sankeyUrl.length, 'chars');
console.log('Both under 2000 chars:', (flowchartUrl.length < 2000 && sankeyUrl.length < 2000) ? '✅ PASS' : '⚠️  WARNING');
console.log();

console.log('=== All Tests Complete ===');
console.log('\nGenerated URLs:');
console.log('Flowchart:', flowchartUrl);
console.log('Sankey:', sankeyUrl);
console.log('\n💡 Copy these URLs and open them in your browser to verify they work on chhart.app');
