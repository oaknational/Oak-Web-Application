/**
 * Discovery link relations advertising Oak's ARD manifest.
 *
 * ARD spec v0.91 §5.1 lists an HTML `<link>` tag as a discovery mechanism, and
 * requires a conformant consumer to honour `rel="ard"`. The predecessor
 * relation `ai-catalog` is emitted alongside it for the same reason the
 * predecessor path is served — see `src/app/api/well-known/ard/route.ts`.
 *
 * Declared once here because the site renders its head from two routers
 * (`src/pages/_document.tsx` and `src/app/layout.tsx`). Two hand-maintained
 * copies would drift, and a page served by the router that lost the tag would
 * simply stop advertising the manifest, silently.
 *
 * https://agenticresourcediscovery.org/spec/
 */
export const AGENT_DISCOVERY_LINKS = [
  { rel: "ard", href: "/.well-known/ard.json" },
  { rel: "ai-catalog", href: "/.well-known/ai-catalog.json" },
] as const;
