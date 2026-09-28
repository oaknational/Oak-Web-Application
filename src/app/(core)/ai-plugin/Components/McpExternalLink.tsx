"use client";
import { OakLink, OakScreenReader } from "@oaknational/oak-components";

export const McpExternalLink = ({
  href,
  children,
}: Readonly<{ href: string; children: React.ReactNode }>) => (
  <OakLink href={href} target="_blank" rel="noreferrer">
    {children}
    <OakScreenReader> (opens in a new tab)</OakScreenReader>
  </OakLink>
);
