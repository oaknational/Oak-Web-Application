import type { ComponentProps } from "react";
import type { PortableTextProps } from "@portabletext/react";
import { merge } from "lodash/fp";

import {
  PortableTextWithDefaults,
  PTInternalLink,
} from "@/components/SharedComponents/PortableText";
import errorReporter from "@/common-lib/error-reporter";
import { resolveInternalHref } from "@/utils/portableText/resolveInternalHref";

const reportError = errorReporter("NationalCurriculumInsightsPortableText");

const InsightsInternalLink = (props: ComponentProps<typeof PTInternalLink>) => {
  const reference = props.value?.reference;
  // Unpublished or deleted targets must not hide the surrounding sentence.
  // The query resolves valid targets within the page's own preview perspective.
  if (!reference || "_ref" in reference) return <>{props.children}</>;
  try {
    if (!resolveInternalHref(reference)) return <>{props.children}</>;
  } catch (error) {
    reportError(error, { severity: "warning", internalReference: reference });
    return <>{props.children}</>;
  }
  return <PTInternalLink {...props} />;
};

export const NationalCurriculumInsightsPortableText = ({
  components,
  ...props
}: PortableTextProps) => (
  <PortableTextWithDefaults
    {...props}
    components={merge(
      { marks: { internalLink: InsightsInternalLink } },
      components,
    )}
  />
);
