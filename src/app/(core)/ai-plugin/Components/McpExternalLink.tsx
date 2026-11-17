"use client";
import { OakLink } from "@oaknational/oak-components";

export const McpExternalLink = ({
  href,
  children,
}: Readonly<{ href: string; children: React.ReactNode }>) => (
  <OakLink
    href={href}
    target="_blank"
    rel="noreferrer"
    iconName="external"
    isTrailingIcon
  >
    {children}
  </OakLink>
);
