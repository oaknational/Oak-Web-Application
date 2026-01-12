# CSP Nonce Implementation Guide

## Overview

This application implements **nonce-based Content Security Policy (CSP)** to allow styled-components to work without requiring `'unsafe-inline'` in the CSP `style-src` directive. This approach maintains security while enabling dynamic CSS-in-JS styling.

## How It Works

### 1. Nonce Generation

A cryptographically secure random nonce is generated for each request in the middleware:

**File: `src/lib/csp/generateNonce.ts`**
```typescript
export function generateNonce(): string {
  return randomBytes(16).toString("base64");
}
```

### 2. Middleware Integration

The middleware generates a nonce and adds it to the CSP header for every request:

**File: `src/middleware.ts`**
- Generates a unique nonce per request
- Injects the nonce into the CSP header via `getCspHeader(nonce)`
- Stores the nonce in a custom header `X-CSP-Nonce` for use in components
- Currently uses `Content-Security-Policy-Report-Only` for testing

### 3. CSP Header Generation

The CSP configuration dynamically includes the nonce when provided:

**File: `src/config/contentSecurityPolicy.ts`**
```typescript
export const getCspHeader = (nonce?: string) => {
  const nonceDirective = nonce ? ` 'nonce-${nonce}'` : "";

  // When nonce is present, 'unsafe-inline' is removed from style-src
  const styleSrcDirectives = nonce
    ? cspConfig.styleSrc.filter((src) => src !== "'unsafe-inline'")
    : cspConfig.styleSrc;

  return `
    ...
    style-src ${styleSrcDirectives.join(" ")}${nonceDirective};
    script-src ${cspConfig.scriptSrc.join(" ")}${nonceDirective};
    ...
  `;
};
```

### 4. Pages Router (Legacy)

For pages using the Pages Router, the nonce is applied in `_document.tsx`:

**File: `src/pages/_document.tsx`**
- Generates a nonce during `getInitialProps`
- Applies the nonce to styled-components style tags
- Passes the nonce to `<Head>` and `<NextScript>` components

### 5. App Router

For pages using the App Router, the nonce flows through the layout:

**File: `src/app/layout.tsx`**
- Retrieves the nonce from headers using `getNonce()`
- Passes it to `StyledComponentsRegistry`

**File: `src/app/styles-registry.tsx`**
- Receives the nonce prop
- Applies it to all styled-components style tags via `useServerInsertedHTML`

## Why This Solves the Cloudinary CSP Issue

### The Problem

When using `OakCloudinaryImage` from the oak-components library:

1. **styled-components generates inline styles** for every component
2. These inline styles include:
   - Dynamic sizing (`$width`, `$height`, `$minWidth`)
   - Color filters (`$colorFilter` for SVG icon coloring)
   - Positioning, padding, margins, etc.
3. Without `'unsafe-inline'` or nonces, CSP blocks these styles
4. This causes Cloudinary images and SVG icons to appear unstyled or broken

### The Solution

With nonce-based CSP:

1. ✅ Each request gets a unique, unpredictable nonce
2. ✅ Only styles with the correct nonce are allowed
3. ✅ Inline styles from styled-components work because they have the nonce
4. ✅ Malicious inline styles are still blocked (they won't have the nonce)
5. ✅ `'unsafe-inline'` is removed from CSP, maintaining security

## Enabling Strict CSP (Production)

Currently, CSP is in **report-only mode** for testing. To enable strict CSP:

### Step 1: Test in Report-Only Mode

Monitor CSP violations in PostHog dashboard:
1. Check for violations at `https://eu.i.posthog.com` (your configured endpoint)
2. Review violations to ensure no legitimate resources are blocked
3. Verify nonce-based styles are working

### Step 2: Enable Enforcement

In `src/middleware.ts`, change:

```typescript
// FROM:
response.headers.set("Content-Security-Policy-Report-Only", cspHeaderValue);

// TO:
response.headers.set("Content-Security-Policy", cspHeaderValue);
```

### Step 3: Uncomment Cloudinary img-src

In `src/config/contentSecurityPolicy.ts`, uncomment:

```typescript
const cloudinary: Partial<CspConfig> = {
  imgSrc: [
    "https://res.cloudinary.com/",
    "https://oaknationalacademy-res.cloudinary.com/",
    "https://*.cloudinary.com/",
  ],
  // ... rest of config
};
```

Then remove the wildcard `https:` from `imgSrc` in `cspBaseConfig`:

```typescript
const cspBaseConfig: CspConfig = {
  // ...
  imgSrc: [
    "'self'",
    "blob:",
    "data:",
    // Remove: "https:",  // <-- Remove this for stricter security
    "*.thenational.academy/",
    "thenational.academy/",
  ],
  // ...
};
```

## Architecture Diagram

```
┌─────────────────┐
│   User Request  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│      Middleware (middleware.ts)     │
│  1. Generate nonce                  │
│  2. Create CSP with nonce           │
│  3. Set X-CSP-Nonce header          │
└────────┬────────────────────────────┘
         │
         ├─────────────────┬──────────────────┐
         │                 │                  │
         ▼                 ▼                  ▼
   Pages Router      App Router         Response
  _document.tsx     layout.tsx          Headers
         │                 │                  │
         ▼                 ▼                  │
  Get nonce from    Get nonce from           │
  getInitialProps   getNonce()               │
         │                 │                  │
         ▼                 ▼                  │
  Apply to styled-  Pass to                  │
  components tags   StyledComponentsRegistry │
         │                 │                  │
         └────────┬────────┘                  │
                  ▼                           │
          ┌───────────────┐                   │
          │  HTML Output  │◄──────────────────┘
          │  with nonces  │
          └───────────────┘
```

## Files Modified

1. `src/lib/csp/generateNonce.ts` - Nonce generation utility
2. `src/lib/csp/getNonce.ts` - Nonce retrieval for App Router
3. `src/config/contentSecurityPolicy.ts` - CSP header with nonce support
4. `src/middleware.ts` - Middleware to inject nonces
5. `src/pages/_document.tsx` - Pages Router nonce application
6. `src/app/styles-registry.tsx` - App Router nonce application
7. `src/app/layout.tsx` - App Router nonce passing
8. `next.config.ts` - Removed static CSP header (now in middleware)

## Testing

### 1. Check Nonce in DevTools

Open browser DevTools → Network → Select any HTML page → Response Headers:

```
Content-Security-Policy-Report-Only: ...style-src 'self' 'nonce-abc123def456'...
X-CSP-Nonce: abc123def456
```

### 2. Verify Style Tags Have Nonces

Open browser DevTools → Elements → Look for `<style>` tags in `<head>`:

```html
<style data-styled="true" nonce="abc123def456">
  /* styled-components CSS */
</style>
```

### 3. Check for CSP Violations

1. Open browser console
2. Look for CSP violation warnings
3. If you see violations related to styles, verify nonces are being applied

### 4. Test Cloudinary Images

Navigate to pages with `OakCloudinaryImage` components:
- Images should load correctly
- Color filters should work
- Responsive sizing should function
- No CSP violations in console

## Troubleshooting

### Issue: Styles not loading

**Symptom:** Components appear unstyled

**Solution:**
- Check that `X-CSP-Nonce` header is present in response
- Verify `<style>` tags have the `nonce` attribute
- Ensure middleware matcher includes the route

### Issue: CSP violations in console

**Symptom:** Console shows "Refused to apply inline style..."

**Solution:**
- Verify nonce in CSP header matches nonce in style tags
- Check that middleware is running for the route
- Ensure `getCspHeader(nonce)` is being called with the nonce

### Issue: Different nonce per component

**Symptom:** Multiple different nonces in style tags

**Solution:**
- Ensure nonce is generated once per request (in middleware)
- Pass the same nonce through to all components
- Check that you're not regenerating nonce in components

## Security Considerations

1. **Nonce Uniqueness:** Each request gets a unique nonce - never reuse nonces
2. **Cryptographic Randomness:** Uses Node.js `crypto.randomBytes` for security
3. **No Nonce Leakage:** Nonces are only in HTML and headers, not logged/stored
4. **CSP Reporting:** Violations are reported to PostHog for monitoring
5. **Gradual Rollout:** Test with report-only mode before enforcing

## Further Reading

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Nonce Guide](https://content-security-policy.com/nonce/)
- [styled-components SSR](https://styled-components.com/docs/advanced#server-side-rendering)
- [Next.js CSP](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
