"use client";

import {
  getMediaQuery,
  isValidIconName,
  OakBox,
  OakFlex,
  OakHeading,
  OakSubjectIconButton,
  parseColor,
} from "@oaknational/oak-components";
import Link from "next/link";
import styled from "styled-components";

import type { NationalCurriculumInsightsRouteData } from "../getNationalCurriculumInsightsData";

import { ContextualSectionProps, SectionMaxWidth } from "./shared";

import {
  nationalCurriculumInsightsSubjectHref,
  nationalCurriculumInsightsSubjectPhaseHref,
} from "@/common-lib/urls/nationalCurriculumInsights";

type Subject = NationalCurriculumInsightsRouteData["subjects"][number];

type Phase = "primary" | "secondary";

const SubjectList = styled(OakFlex)`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SubjectNavigationMaxWidth = styled(OakBox)`
  width: 100%;
  max-width: 998px;

  @media (${getMediaQuery("desktop")}) {
    min-height: 176px;
    display: flex;
    align-items: center;
  }

  a {
    background: ${parseColor("bg-primary")};
    border-color: ${parseColor("grey30")};
  }
`;

const HubSubjectItem = styled.li`
  width: 225px;
  height: 225px;

  @media (${getMediaQuery("mobile")}) {
    width: calc(50% - 8px);
    height: auto;
    aspect-ratio: 1;
  }

  > * {
    width: 100%;
    height: 100%;
  }

  a {
    box-sizing: border-box;
    width: 100%;
    padding-inline: 8px;
  }
`;

const HubSubjectList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const HubPhaseNavigation = styled.nav`
  width: 100%;

  @media (${getMediaQuery("desktop")}) {
    max-width: 1189px;
    margin-inline: auto;
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
          $mh="auto"
          data-insights-module="subject-navigation"
        >
          <SubjectList
            as="ul"
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
          </SubjectList>
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
            .map((phase) => (
              <HubPhaseNavigation
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
                  <HubSubjectList>
                    {data.subjects
                      .filter((subject) =>
                        subject.tabs.some(({ kind }) => kind === phase),
                      )
                      .map((subject) => (
                        <HubSubjectItem key={`${phase}-${subject.slug}`}>
                          <OakSubjectIconButton
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
                      ))}
                  </HubSubjectList>
                </OakFlex>
              </HubPhaseNavigation>
            ))}
        </OakFlex>
      </SectionMaxWidth>
    </OakBox>
  );
};
