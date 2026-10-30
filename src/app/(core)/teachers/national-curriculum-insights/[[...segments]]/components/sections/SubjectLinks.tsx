"use client";

import {
  isValidIconName,
  OakBox,
  OakFlex,
  OakFocusIndicator,
  OakHeading,
  OakIcon,
  OakLI,
  OakMaxWidth,
  OakSpan,
  OakUL,
} from "@oaknational/oak-components";
import Link from "next/link";
import { useId } from "react";

import type { ContextualSectionProps } from "./shared";

import { nationalCurriculumInsightsSubjectHref } from "@/common-lib/urls/nationalCurriculumInsights";

export const NationalCurriculumInsightsSubjectLinks = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsSubjectLinksSection">) => {
  const headingId = useId();
  const subjects = new Set(data.subjects.map(({ slug }) => slug));
  const links = section.links.filter(({ subjectSlug }) =>
    subjects.has(subjectSlug),
  );
  if (!links.length) return null;

  return (
    <OakBox
      as="nav"
      aria-labelledby={headingId}
      $background="bg-decorative2-main"
      $ph={["spacing-20", "spacing-40"]}
      $pv={["spacing-20", "spacing-20", "spacing-40"]}
      data-insights-module="subject-overview-links"
    >
      <OakMaxWidth
        $maxWidth={["spacing-1280", "spacing-1280", "spacing-960"]}
        $ph="spacing-0"
        $display="flex"
        $flexDirection="column"
        $alignItems="center"
        $gap={["spacing-40", "spacing-64", "spacing-40"]}
      >
        <OakHeading
          id={headingId}
          tag="h2"
          $font={["heading-4", "heading-4", "heading-3"]}
          $textAlign="center"
        >
          {section.heading}
        </OakHeading>
        <OakUL
          $reset
          $display="flex"
          $flexWrap="wrap"
          $justifyContent="center"
          $gap="spacing-12"
          $pb="spacing-32"
          $width="100%"
        >
          {links.map(({ title, subjectSlug, iconName }) => (
            <OakLI
              key={`${subjectSlug}-${title}`}
              $listStyle="none"
              $maxWidth="100%"
            >
              <OakFocusIndicator
                $maxWidth="100%"
                $borderRadius="border-radius-s"
                $background="bg-primary"
                $hoverBackground="bg-neutral"
              >
                <OakFlex
                  as={Link}
                  href={nationalCurriculumInsightsSubjectHref(subjectSlug)}
                  $alignItems="center"
                  $gap="spacing-8"
                  $minHeight="spacing-40"
                  $maxWidth="100%"
                  $ph="spacing-12"
                  $ba="border-solid-s"
                  $borderColor="border-neutral-lighter"
                  $borderRadius="border-radius-s"
                  $color="text-primary"
                  $textDecoration="none"
                >
                  <OakIcon
                    iconName={
                      isValidIconName(iconName) ? iconName : "question-mark"
                    }
                    $width="spacing-32"
                    $height="spacing-32"
                    $minWidth="spacing-32"
                    aria-hidden="true"
                  />
                  <OakSpan $font="heading-light-7">{title}</OakSpan>
                </OakFlex>
              </OakFocusIndicator>
            </OakLI>
          ))}
        </OakUL>
      </OakMaxWidth>
    </OakBox>
  );
};
