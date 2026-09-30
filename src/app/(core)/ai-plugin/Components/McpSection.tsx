"use client";
import {
  OakFlex,
  OakHeading,
  type OakFlexProps,
} from "@oaknational/oak-components";

/**
 * A titled content section of the MCP landing page.
 *
 * Every section heading is an `h2` so the page keeps a single `h1` (the hero)
 * and an unbroken heading order.
 */
export const McpSection = ({
  title,
  id,
  gap = "spacing-24",
  children,
}: Readonly<{
  title: string;
  id?: string;
  gap?: OakFlexProps["$gap"];
  children: React.ReactNode;
}>) => (
  <OakFlex
    as="section"
    $flexDirection="column"
    $gap={gap}
    $width="100%"
    $minWidth="spacing-0"
    aria-labelledby={id}
  >
    <OakHeading id={id} tag="h2" $font="heading-5">
      {title}
    </OakHeading>
    {children}
  </OakFlex>
);
