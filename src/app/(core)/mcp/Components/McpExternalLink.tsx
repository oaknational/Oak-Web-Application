"use client";
import { OakLink, OakScreenReader } from "@oaknational/oak-components";

/**
 * An external link that leaves owa, with an accessible new-tab announcement.
 */
export const McpExternalLink = ({
  href,
  children,
}: Readonly<{ href: string; children: React.ReactNode }>) => (
  // `noopener` is implied by every browser this repo supports; `noreferrer`
  // stays until OWA sets a global Referrer-Policy.
  <OakLink href={href} target="_blank" rel="noreferrer">
    {children}
    <OakScreenReader> (opens in a new tab)</OakScreenReader>
  </OakLink>
);
