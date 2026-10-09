"use client";

import {
  isValidIconName,
  OakBox,
  OakFlex,
  OakHeading,
  OakIcon,
  OakMaxWidth,
  OakSubjectIconButton,
  OakUL,
} from "@oaknational/oak-components";
import Link from "next/link";
import { useId } from "react";

import { normaliseSubjectIcon } from "../../helpers/subjectIcon";

import type { ContextualSectionProps } from "./shared";

import {
  nationalCurriculumInsightsSubjectPhaseHref,
  nationalCurriculumInsightsSubjectPhaseKeyStageHref,
} from "@/common-lib/urls/nationalCurriculumInsights";
import {
  nationalCurriculumInsightsKeyStageSlug,
  nationalCurriculumInsightsKeyStagesForPhase,
} from "@/common-lib/cms-types/nationalCurriculumInsights";

type Props =
  ContextualSectionProps<"NationalCurriculumInsightsSubjectNavigationSection">;

const getPhaseLinks = (data: Props["data"]) =>
  data.hub?.phaseLinks ??
  data.subjects.flatMap((subject) =>
    subject.tabs.map(({ kind }) => ({
      title: subject.title,
      phase: kind,
      subjectSlug: subject.slug,
      iconName: null,
      keyStage: null,
    })),
  );

export const NationalCurriculumInsightsSubjectPhaseChips = ({
  section,
  data,
}: Props) => {
  const id = useId();
  const groups = section.phases.flatMap((phase) => {
    const links = getPhaseLinks(data).flatMap((link) => {
      if (link.phase !== phase) return [];

      const subject = data.subjects.find(
        ({ slug, tabs }) =>
          slug === link.subjectSlug && tabs.some(({ kind }) => kind === phase),
      );
      if (!subject) return [];
      if (
        link.keyStage &&
        (!nationalCurriculumInsightsKeyStagesForPhase[phase].some(
          (keyStage) => keyStage === link.keyStage,
        ) ||
          !subject.tabs
            .find(({ kind }) => kind === phase)
            ?.page.availableKeyStages?.includes(link.keyStage))
      ) {
        return [];
      }

      const iconName =
        link.iconName && isValidIconName(link.iconName)
          ? link.iconName
          : normaliseSubjectIcon(subject);

      const href = link.keyStage
        ? nationalCurriculumInsightsSubjectPhaseKeyStageHref(
            link.subjectSlug,
            phase,
            nationalCurriculumInsightsKeyStageSlug(link.keyStage),
          )
        : nationalCurriculumInsightsSubjectPhaseHref(link.subjectSlug, phase);
      return [{ ...link, iconName, href }];
    });
    return links.length ? [{ phase, links }] : [];
  });
  if (!groups.length) return null;

  return (
    <OakBox
      $background="bg-primary"
      $color="text-primary"
      $pt="spacing-56"
      $pb="spacing-40"
    >
      <OakMaxWidth
        $ph={["spacing-20", "spacing-40"]}
        $maxWidth="spacing-1280"
        data-insights-module="subject-phase-chips"
      >
        <OakFlex $flexDirection="column" $gap="spacing-40" $width="100%">
          {section.heading && (
            <OakHeading tag="h2" $font={["heading-4", "heading-3"]}>
              {section.heading}
            </OakHeading>
          )}
          {groups.map(({ phase, links }) => (
            <OakFlex
              as="nav"
              key={phase}
              aria-labelledby={`${id}-${phase}`}
              $flexDirection="column"
              $gap="spacing-40"
            >
              <OakHeading tag="h3" id={`${id}-${phase}`} $font="heading-5">
                {phase === "primary"
                  ? section.primaryHeading
                  : section.secondaryHeading}
              </OakHeading>
              <OakUL $reset $display="flex" $flexWrap="wrap" $gap="spacing-20">
                {links.map(({ title, subjectSlug, iconName, href }) => (
                  <OakBox
                    as="li"
                    key={`${subjectSlug}-${title}`}
                    $maxWidth="100%"
                  >
                    <OakSubjectIconButton
                      element={Link}
                      variant="horizontal"
                      phase={phase}
                      subjectIconName={iconName}
                      iconOverride={
                        <OakIcon
                          iconName={iconName}
                          $width="spacing-48"
                          $height="spacing-48"
                          $minWidth="spacing-48"
                          aria-hidden="true"
                        />
                      }
                      iconGap="spacing-4"
                      $pl="spacing-12"
                      $pr="spacing-12"
                      maxWidth="100%"
                      href={href}
                    >
                      {title} {phase}
                    </OakSubjectIconButton>
                  </OakBox>
                ))}
              </OakUL>
            </OakFlex>
          ))}
        </OakFlex>
      </OakMaxWidth>
    </OakBox>
  );
};
