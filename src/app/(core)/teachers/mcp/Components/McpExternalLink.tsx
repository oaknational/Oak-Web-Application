"use client";
import { OakLink, OakScreenReader } from "@oaknational/oak-components";

/**
 * An external link that leaves owa, with an accessible new-tab announcement.
 */
export const McpExternalLink = ({
  href,
  children,
}: Readonly<{ href: string; children: React.ReactNode }>) => (
  <OakLink href={href} target="_blank" rel="noopener noreferrer">
    {children}
    <OakScreenReader> (opens in a new tab)</OakScreenReader>
  </OakLink>
);
