"use client";
import { OakSpan } from "@oaknational/oak-components";
import type { ComponentProps } from "react";

import type { McpTextSegment } from "@/app/(core)/teachers/mcp/mcpContent";

type OakSpanFont = ComponentProps<typeof OakSpan>["$font"];

/**
 * Renders a run of copy where some phrases are emphasised, so the bold parts
 * can live in `mcpContent` alongside the rest of the copy.
 *
 * `boldFont` has to match the size of the surrounding paragraph, or the
 * emphasised phrase renders larger than the text it sits in.
 */
export const McpRichText = ({
  segments,
  boldFont = "body-2-bold",
}: Readonly<{
  segments: readonly McpTextSegment[];
  boldFont?: OakSpanFont;
}>) => (
  <>
    {segments.map((segment) =>
      segment.bold ? (
        <OakSpan key={segment.text} $font={boldFont}>
          {segment.text}
        </OakSpan>
      ) : (
        segment.text
      ),
    )}
  </>
);
