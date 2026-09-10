/**
 * Declared once because the site renders its head from two routers
 * (`src/pages/_document.tsx` and `src/app/layout.tsx`); a drifted copy would
 * silently stop advertising the manifest on half the site.
 *
 * Why both relations: `docs/agent-discovery.md`.
 */
export const AGENT_DISCOVERY_LINKS = [
  { rel: "ard", href: "/.well-known/ard.json" },
  { rel: "ai-catalog", href: "/.well-known/ai-catalog.json" },
] as const;
