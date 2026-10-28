import type { ComponentProps } from "react";
import { OakQuote } from "@oaknational/oak-components";

type CalloutSectionProps = Pick<ComponentProps<typeof OakQuote>, "quote">;

export type CalloutSection = {
  type: "callout";
  id: string;
} & CalloutSectionProps;

export function CalloutSection({ quote }: Readonly<CalloutSectionProps>) {
  return <OakQuote color="bg-decorative2-main" quote={quote} />;
}
