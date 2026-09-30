"use client";

import {
  isValidIconName,
  OakBox,
  OakFlex,
  OakHeading,
  OakGrid,
  OakGridArea,
  OakSubjectIconButton,
  OakUL,
  parseColor,
} from "@oaknational/oak-components";
import Link from "next/link";
import styled from "styled-components";

import type { NationalCurriculumInsightsRouteData } from "../../helpers/getRouteData";

import { ContextualSectionProps, SectionMaxWidth } from "./shared";

import {
  nationalCurriculumInsightsSubjectHref,
  nationalCurriculumInsightsSubjectPhaseHref,
} from "@/common-lib/urls/nationalCurriculumInsights";

type Subject = NationalCurriculumInsightsRouteData["subjects"][number];

type Phase = "primary" | "secondary";

const getMobileColumnStart = (index: number, subjectCount: number) => {
  if (subjectCount % 2 === 1 && index === subjectCount - 1) return 2;

  return index % 2 === 0 ? 1 : 3;
};

// OakSubjectIconButton fixes these colours by phase and exposes no overrides.
const SubjectNavigationMaxWidth = styled(OakBox)`
  a {
    background: ${parseColor("bg-primary")};
    border-color: ${parseColor("grey30")};
  }
`;

// The subject button exposes width, but not its outer wrapper's height.
const HubSubjectItem = styled(OakBox)`
  > * {
    height: 100%;
  }
`;

const normaliseSubjectIcon = (subject: Subject) => {
  const preferred = `subject-${subject.slug}`;
  if (isValidIconName(preferred)) {
    return preferred;
  }

  const mapped = `subject-${subject.curriculumSubjectSlugs[0]}`;
  return isValidIconName(mapped) ? mapped : "question-mark";
};

export const NationalCurriculumInsightsSubjectNavigation = ({
  section,
  data,
}: ContextualSectionProps<"NationalCurriculumInsightsSubjectNavigationSection">) => {
  if (data.subjects.length === 0) return null;

  if (data.route.kind !== "hub") {
    const phase =
      data.activeTab && data.activeTab !== "overview"
        ? data.activeTab
        : undefined;
    const subjects = data.subjects.filter(
      (subject) => !phase || subject.tabs.some(({ kind }) => kind === phase),
    );

    return (
      <OakBox
        as="nav"
        aria-label="Explore curriculum changes by subject"
        $ph={["spacing-20", "spacing-40"]}
        $pb={["spacing-48", "spacing-64"]}
      >
        <SubjectNavigationMaxWidth
          $width="100%"
          $maxWidth="spacing-960"
          $minHeight={["auto", "auto", "spacing-180"]}
          $display={["block", "block", "flex"]}
          $alignItems="center"
          $mh="auto"
          data-insights-module="subject-navigation"
        >
          <OakUL
            $reset
            $display="flex"
            $flexWrap="wrap"
            $justifyContent="center"
            $gap="spacing-12"
          >
            {subjects.map((subject) => (
              <li key={subject.slug}>
                <OakSubjectIconButton
                  variant="horizontal"
                  element={Link}
                  phase={(phase ?? "non-curriculum") as Phase}
                  subjectIconName={normaliseSubjectIcon(subject)}
                  href={
                    phase
                      ? nationalCurriculumInsightsSubjectPhaseHref(
                          subject.slug,
                          phase,
                        )
                      : nationalCurriculumInsightsSubjectHref(subject.slug)
                  }
                >
                  {subject.title}
                </OakSubjectIconButton>
              </li>
            ))}
          </OakUL>
        </SubjectNavigationMaxWidth>
      </OakBox>
    );
  }

  return (
    <OakBox
      $ph={["spacing-20", "spacing-40"]}
      $pb={["spacing-48", "spacing-64"]}
    >
      <SectionMaxWidth $mh="auto" data-insights-module="subject-catalogue">
        <OakFlex $flexDirection="column" $gap="spacing-40">
          {section.phases
            .filter((phase) =>
              data.subjects.some(({ tabs }) =>
                tabs.some(({ kind }) => kind === phase),
              ),
            )
            .map((phase) => {
              const subjects = data.subjects.filter((subject) =>
                subject.tabs.some(({ kind }) => kind === phase),
              );
              const lastDesktopRowLength = subjects.length % 5;
              const desktopColumnStarts = [
                [1, 3, 5, 7, 9],
                [5],
                [4, 6],
                [3, 5, 7],
                [2, 4, 6, 8],
              ] as const;
              return (
                <OakBox
                  as="nav"
                  $width="100%"
                  key={phase}
                  aria-labelledby={`national-curriculum-insights-${phase}-subjects`}
                >
                  <OakFlex
                    $flexDirection="column"
                    $gap="spacing-16"
                    $alignItems={["center", "center", "stretch"]}
                  >
                    <OakHeading
                      tag="h3"
                      id={`national-curriculum-insights-${phase}-subjects`}
                      $font="heading-5"
                      $textAlign={["center", "center", "left"]}
                    >
                      {phase === "primary"
                        ? section.primaryHeading
                        : section.secondaryHeading}
                    </OakHeading>
                    <OakGrid
                      $display={["grid", "block", "grid"]}
                      $gridTemplateColumns={[
                        "repeat(4, minmax(0, 1fr))",
                        "none",
                        "repeat(10, minmax(0, 1fr))",
                      ]}
                      $rg="spacing-16"
                      $cg="spacing-16"
                    >
                      <OakFlex
                        as="ul"
                        $listStyle="none"
                        $ma="spacing-0"
                        $pa="spacing-0"
                        $display={["contents", "flex", "contents"]}
                        $flexWrap="wrap"
                        $justifyContent="center"
                        $gap="spacing-16"
                      >
                        {subjects.map((subject, index) => (
                          <OakGridArea
                            as="li"
                            key={`${phase}-${subject.slug}`}
                            $colSpan={[2, 2, 2]}
                            $colStart={[
                              getMobileColumnStart(index, subjects.length),
                              1,
                              index >= subjects.length - lastDesktopRowLength
                                ? desktopColumnStarts[lastDesktopRowLength]?.[
                                    index % 5
                                  ]
                                : desktopColumnStarts[0][index % 5],
                            ]}
                          >
                            <HubSubjectItem
                              $width={["100%", "spacing-240", "100%"]}
                              $aspectRatio="1"
                            >
                              <OakSubjectIconButton
                                width="100%"
                                $pl="spacing-8"
                                $pr="spacing-8"
                                variant="vertical"
                                innerWidth="100%"
                                element={Link}
                                phase={phase as Phase}
                                subjectIconName={normaliseSubjectIcon(subject)}
                                href={nationalCurriculumInsightsSubjectPhaseHref(
                                  subject.slug,
                                  phase,
                                )}
                              >
                                {subject.title}
                              </OakSubjectIconButton>
                            </HubSubjectItem>
                          </OakGridArea>
                        ))}
                      </OakFlex>
                    </OakGrid>
                  </OakFlex>
                </OakBox>
              );
            })}
        </OakFlex>
      </SectionMaxWidth>
    </OakBox>
  );
};
