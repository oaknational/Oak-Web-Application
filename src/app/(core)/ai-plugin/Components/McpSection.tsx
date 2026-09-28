"use client";
import { OakFlex, OakHeading } from "@oaknational/oak-components";

/**
 * A titled content section of the MCP landing page.
 *
 * Every section heading is an `h2` so the page keeps a single `h1` (the hero)
 * and an unbroken heading order.
 */
export const McpSection = ({
  title,
  id,
  children,
}: Readonly<{
  title: string;
  id?: string;
  children: React.ReactNode;
}>) => (
  <OakFlex
    as="section"
    $flexDirection="column"
    $gap="spacing-24"
    $width="100%"
    $minWidth="spacing-0"
    aria-labelledby={id}
  >
    <OakHeading id={id} tag="h2" $font={["heading-6", "heading-5"]}>
      {title}
    </OakHeading>
    {children}
  </OakFlex>
);
