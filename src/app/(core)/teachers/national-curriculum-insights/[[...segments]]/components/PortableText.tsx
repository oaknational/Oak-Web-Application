import type { ComponentProps } from "react";
import type { PortableTextProps } from "@portabletext/react";
import { merge } from "lodash/fp";
import { OakLink } from "@oaknational/oak-components";

import { useNationalCurriculumInsightsAnalytics } from "@/context/NationalCurriculumInsightsAnalytics/useNationalCurriculumInsightsAnalytics";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import {
  PortableTextWithDefaults,
  PTInternalLink,
  PTExternalLink,
} from "@/components/SharedComponents/PortableText";
import errorReporter from "@/common-lib/error-reporter";
import { resolveInternalHref } from "@/utils/portableText/resolveInternalHref";

const reportError = errorReporter("NationalCurriculumInsightsPortableText");

const InsightsInternalLink = (props: ComponentProps<typeof PTInternalLink>) => {
  const { trackCtaClicked, section: analyticsSection } =
    useNationalCurriculumInsightsAnalytics();
  const reference = props.value?.reference;
  // Unpublished or deleted targets must not hide the surrounding sentence.
  // The query resolves valid targets within the page's own preview perspective.
  if (!reference || "_ref" in reference) return <>{props.children}</>;
  let href: string | undefined;
  try {
    href = resolveInternalHref(reference);
    if (!href) return <>{props.children}</>;
  } catch (error) {
    reportError(error, { severity: "warning", internalReference: reference });
    return <>{props.children}</>;
  }
  return (
    <OakLink
      href={getProxiedSanityAssetUrl(href)}
      onClick={() =>
        trackCtaClicked({
          sectionType: analyticsSection?.sectionType ?? "content",
          sectionId:
            analyticsSection?.sectionId ??
            analyticsSection?.sectionType ??
            "content",
          ctaAction: "navigate",
          componentType: "national_curriculum",
          ctaId: "inline-content-link",
          ctaText: props.text,
        })
      }
    >
      {props.children}
    </OakLink>
  );
};

const InsightsExternalLink = (props: ComponentProps<typeof PTExternalLink>) => {
  const { trackCtaClicked, section: analyticsSection } =
    useNationalCurriculumInsightsAnalytics();
  if (!props.value?.href) return null;
  return (
    <OakLink
      href={getProxiedSanityAssetUrl(props.value.href)}
      onClick={() =>
        trackCtaClicked({
          sectionType: analyticsSection?.sectionType ?? "content",
          sectionId:
            analyticsSection?.sectionId ??
            analyticsSection?.sectionType ??
            "content",
          ctaAction: "navigate",
          componentType: "national_curriculum",
          ctaId: "inline-content-link",
          ctaText: props.text,
        })
      }
    >
      {props.children}
    </OakLink>
  );
};

export const NationalCurriculumInsightsPortableText = ({
  components,
  ...props
}: PortableTextProps) => (
  <PortableTextWithDefaults
    {...props}
    components={merge(
      {
        marks: {
          internalLink: InsightsInternalLink,
          link: InsightsExternalLink,
        },
      },
      components,
    )}
  />
);
