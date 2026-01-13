# Chhart.app URL Hash Parsing Implementation Plan

Add URL hash parsing to chhart.app to support MCP-generated shareable URLs, enabling seamless diagram sharing via links.

---

## Overview

The Chhart MCP server generates URLs in the format:
```
https://chhart.app/#flowchart=<base64_encoded_content>&title=<title>
https://chhart.app/#sankey=<base64_encoded_content>&title=<title>
```

This implementation will enable chhart.app to automatically parse these URLs and load the encoded diagrams.

---

## User Review Required

> [!IMPORTANT]
> **Breaking Changes**: None - This is a purely additive feature that enhances existing functionality.

> [!NOTE]
> **Compatibility**: The implementation should maintain backward compatibility with existing URL structures and local storage behavior.

---

## Proposed Changes

### Core URL Parsing Module

#### [NEW] [src/utils/urlParser.ts](file:///src/utils/urlParser.ts)

Utility functions for parsing and decoding URL hash parameters.

**Key Functions:**
```typescript
// Parse URL hash into structured data
parseUrlHash(hash: string): {
  type: 'flowchart' | 'sankey' | null;
  content: string | null;
  title: string | null;
}

// Decode base64 URL-safe string
decodeUrlContent(encoded: string): string

// Encode content to URL-safe base64
encodeUrlContent(content: string): string
```

**Implementation Details:**
- Parse hash parameters (`#flowchart=...&title=...`)
- Decode URL-safe base64 (replace `-` with `+`, `_` with `/`, add padding)
- Handle malformed URLs gracefully with error handling
- Support both `flowchart` and `sankey` types

---

### URL State Management Hook

#### [MODIFY] [src/hooks/useUrlState.ts](file:///src/hooks/useUrlState.ts)

Enhance existing URL state management to support hash parsing.

**Changes:**
1. **Add hash parsing on mount**
   - Check for `#flowchart=` or `#sankey=` parameters
   - Decode content if present
   - Load into editor

2. **Add hash change listener**
   - Listen for `hashchange` events
   - Update editor when URL changes
   - Support browser back/forward navigation

3. **Update share functionality**
   - Generate hash-based URLs when sharing
   - Include title parameter if present
   - Copy to clipboard

**Example Implementation:**
```typescript
useEffect(() => {
  const handleHashChange = () => {
    const parsed = parseUrlHash(window.location.hash);
    if (parsed.content) {
      // Load content into editor
      loadChartFromUrl(parsed.type, parsed.content, parsed.title);
    }
  };

  // Parse on mount
  handleHashChange();

  // Listen for changes
  window.addEventListener('hashchange', handleHashChange);
  return () => window.removeEventListener('hashchange', handleHashChange);
}, []);
```

---

### Chart Loading Logic

#### [MODIFY] [src/store/flowStore.ts](file:///src/store/flowStore.ts)

Add method to load chart from URL-parsed data.

**New Method:**
```typescript
loadChartFromUrl(
  type: 'flowchart' | 'sankey',
  content: string,
  title?: string
): void
```

**Behavior:**
- Create new chart tab with URL content
- Set chart type (flowchart or sankey)
- Apply title if provided
- Mark as "from URL" to prevent auto-save conflicts
- Switch to the new chart tab

**Priority Logic:**
1. URL hash parameters take precedence over local storage
2. Only load from URL on initial page load or explicit hash change
3. Preserve existing charts in other tabs

---

### Share Button Enhancement

#### [MODIFY] [src/components/Toolbar.tsx](file:///src/components/Toolbar.tsx) (or similar)

Update the "Share via URL" button to generate hash-based URLs.

**Changes:**
1. **Generate URL with hash**
   ```typescript
   const shareUrl = generateShareUrl(chartType, content, title);
   // Returns: https://chhart.app/#flowchart=<encoded>&title=<title>
   ```

2. **Copy to clipboard**
   - Show success toast notification
   - Include preview of URL

3. **Optional: Add QR code**
   - Generate QR code for easy mobile sharing
   - Display in modal

---

### URL Format Utilities

#### [NEW] [src/utils/shareUrl.ts](file:///src/utils/shareUrl.ts)

Centralized URL generation for sharing.

**Functions:**
```typescript
// Generate shareable URL
generateShareUrl(
  type: 'flowchart' | 'sankey',
  content: string,
  title?: string
): string

// Validate URL format
isValidShareUrl(url: string): boolean

// Extract chart data from URL
extractChartFromUrl(url: string): ChartData | null
```

---

## Implementation Steps

### Phase 1: Core Parsing (Priority: High)

1. **Create URL parser utility**
   - Implement `urlParser.ts` with base64 decoding
   - Add comprehensive error handling
   - Write unit tests

2. **Update URL state hook**
   - Add hash parsing on mount
   - Implement hash change listener
   - Test with sample URLs

3. **Integrate with chart store**
   - Add `loadChartFromUrl` method
   - Handle chart type switching
   - Test with both flowchart and Sankey

### Phase 2: Share Enhancement (Priority: Medium)

4. **Update share button**
   - Generate hash-based URLs
   - Update clipboard functionality
   - Add success notifications

5. **Create share URL utilities**
   - Centralize URL generation logic
   - Add validation functions
   - Document URL format

### Phase 3: Polish & Testing (Priority: Medium)

6. **Error handling**
   - Handle malformed URLs gracefully
   - Show user-friendly error messages
   - Log errors for debugging

7. **Edge cases**
   - Very long URLs (>2000 chars)
   - Special characters in content
   - Missing or invalid parameters

8. **Browser compatibility**
   - Test on Chrome, Firefox, Safari, Edge
   - Verify mobile browser support
   - Test back/forward navigation

---

## Technical Specifications

### URL Format

**Flowchart:**
```
https://chhart.app/#flowchart=<base64>&title=<encoded_title>
```

**Sankey:**
```
https://chhart.app/#sankey=<base64>&title=<encoded_title>
```

**Base64 Encoding:**
- Standard base64 with URL-safe modifications
- Replace `+` with `-`
- Replace `/` with `_`
- Remove padding `=` characters

**Title Encoding:**
- Use `encodeURIComponent()` for title parameter
- Optional parameter

### Example URLs

**Flowchart:**
```
https://chhart.app/#flowchart=U3RhcnQKICBQcm9jZXNzCiAgRW5k&title=My%20Flowchart
```

**Sankey:**
```
https://chhart.app/#sankey=UmV2ZW51ZQogIFt2YWx1ZT02MF0gUHJvZml0&title=Budget%20Flow
```

---

## Verification Plan

### Automated Tests

1. **Unit Tests**
   ```typescript
   // Test URL parsing
   test('parseUrlHash extracts flowchart data', () => {
     const hash = '#flowchart=U3RhcnQ&title=Test';
     const result = parseUrlHash(hash);
     expect(result.type).toBe('flowchart');
     expect(result.content).toBe('Start');
     expect(result.title).toBe('Test');
   });
   ```

2. **Integration Tests**
   - Test full flow: URL → parse → load → render
   - Verify chart type switching
   - Test with MCP-generated URLs

### Manual Verification

1. **MCP Integration Test**
   - Use Chhart MCP to generate URLs
   - Open URLs in chhart.app
   - Verify diagrams load correctly

2. **Share Flow Test**
   - Create diagram in chhart.app
   - Click "Share via URL"
   - Open shared URL in new tab/browser
   - Verify diagram matches original

3. **Browser Testing**
   - Test on Chrome, Firefox, Safari, Edge
   - Verify mobile browsers (iOS Safari, Chrome Mobile)
   - Test back/forward navigation

---

## Edge Cases & Error Handling

### Malformed URLs

**Scenario:** Invalid base64 encoding
```typescript
try {
  const content = decodeUrlContent(encoded);
} catch (error) {
  showToast('Invalid URL format', 'error');
  // Fall back to default welcome chart
}
```

### Long URLs

**Scenario:** URL exceeds browser limits (~2000 chars)
- Consider compression (gzip + base64)
- Or implement backend storage with short IDs
- Show warning if URL is very long

### Conflicting State

**Scenario:** URL hash vs. local storage
- **Priority:** URL hash takes precedence
- Only apply on initial load or explicit hash change
- Preserve other tabs in local storage

### Missing Parameters

**Scenario:** Hash has `#flowchart=` but no content
```typescript
if (!parsed.content) {
  console.warn('URL missing content parameter');
  return; // Don't override current state
}
```

---

## Migration & Rollout

### Backward Compatibility

- ✅ Existing URLs without hash continue to work
- ✅ Local storage behavior unchanged
- ✅ No breaking changes to current functionality

### Feature Flag (Optional)

Consider adding a feature flag for gradual rollout:
```typescript
const URL_PARSING_ENABLED = true; // or from config
```

### Analytics

Track URL parsing usage:
- Count of charts loaded from URLs
- Success/failure rates
- Most common error types

---

## Future Enhancements

### Compression

For very large diagrams, consider adding compression:
```typescript
// Compress before encoding
const compressed = pako.deflate(content);
const encoded = btoa(compressed);
```

### Backend Storage (Optional)

For even shorter URLs:
```
https://chhart.app/view/abc123
```

Where `abc123` maps to stored chart data.

### URL Versioning

Add version parameter for future format changes:
```
https://chhart.app/#v=2&flowchart=...
```

---

## Dependencies

**Required:**
- No new dependencies (use native browser APIs)

**Optional:**
- `pako` - For gzip compression (if implementing compression)
- `qrcode` - For QR code generation (if implementing QR sharing)

---

## Success Criteria

✅ MCP-generated URLs load correctly in chhart.app
✅ Share button generates valid hash-based URLs
✅ Browser back/forward navigation works
✅ No breaking changes to existing functionality
✅ Error handling for malformed URLs
✅ Mobile browser support
✅ Unit tests pass with >90% coverage

---

## Timeline Estimate

- **Phase 1 (Core Parsing):** 4-6 hours
- **Phase 2 (Share Enhancement):** 2-3 hours
- **Phase 3 (Polish & Testing):** 3-4 hours

**Total:** ~10-13 hours of development time

---

## Example Code Snippets

### URL Parser Implementation

```typescript
// src/utils/urlParser.ts
export function parseUrlHash(hash: string): {
  type: 'flowchart' | 'sankey' | null;
  content: string | null;
  title: string | null;
} {
  if (!hash || !hash.startsWith('#')) {
    return { type: null, content: null, title: null };
  }

  // Remove leading #
  const params = new URLSearchParams(hash.substring(1));
  
  let type: 'flowchart' | 'sankey' | null = null;
  let content: string | null = null;
  
  if (params.has('flowchart')) {
    type = 'flowchart';
    content = decodeUrlContent(params.get('flowchart')!);
  } else if (params.has('sankey')) {
    type = 'sankey';
    content = decodeUrlContent(params.get('sankey')!);
  }
  
  const title = params.get('title');
  
  return { type, content, title };
}

export function decodeUrlContent(encoded: string): string {
  // Restore standard base64 format
  let base64 = encoded
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }
  
  // Decode base64
  return atob(base64);
}

export function encodeUrlContent(content: string): string {
  // Encode to base64 and make URL-safe
  return btoa(content)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
```

### Share URL Generation

```typescript
// src/utils/shareUrl.ts
export function generateShareUrl(
  type: 'flowchart' | 'sankey',
  content: string,
  title?: string
): string {
  const encoded = encodeUrlContent(content);
  const baseUrl = window.location.origin;
  
  let url = `${baseUrl}/#${type}=${encoded}`;
  
  if (title) {
    url += `&title=${encodeURIComponent(title)}`;
  }
  
  return url;
}
```

---

## Questions for Review

1. Should URL hash take precedence over local storage on every page load, or only on initial load?
2. Do we want to implement compression for very large diagrams?
3. Should we add analytics to track URL parsing usage?
4. Do we need a backend storage option for shorter URLs?

---

This implementation will make the Chhart MCP server fully functional, enabling seamless AI-generated diagram sharing! 🚀
