"use client";
import {
  OakBasicAccordion,
  OakBox,
  OakBoxProps,
  OakCard,
  OakFlex,
  OakFlexProps,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakLI,
  OakLink,
  OakP,
  OakTagFunctional,
  OakTypography,
  OakUL,
} from "@oaknational/oak-components";

import { LessonList } from "./LessonList";
import { ProgrammeToggles } from "./ProgrammeToggles";

import type { TeachersUnitOverviewData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";
import { resolveOakHref } from "@/common-lib/urls";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import PreviousNextNav from "@/components/TeacherComponents/PreviousNextNav/PreviousNextNav";
import { keystageYearMappings } from "@/utils/curriculum/keystage";
import { getKeystagesFromPhase } from "@/fixtures/curriculum/unit";

export type UnitViewProps = Pick<
  TeachersUnitOverviewData,
  | "programmeSlug"
  | "unitSlug"
  | "unitTitle"
  | "unitDescription"
  | "subjectTitle"
  | "subjectSlug"
  | "keyStageSlug"
  | "keyStageTitle"
  | "lessons"
  | "unitIndex"
  | "unitCount"
  | "whyThisWhyNow"
  | "priorKnowledgeRequirements"
  | "threads"
  | "phaseSlug"
  | "tierOptionToggles"
  | "subjectOptionToggles"
  | "prevUnit"
  | "nextUnit"
  | "subjectCategories"
  | "yearTitle"
  | "examBoardTitle"
>;

export const UnitView = ({
  programmeSlug,
  unitSlug,
  unitTitle,
  unitDescription,
  subjectTitle,
  subjectSlug,
  keyStageSlug,
  keyStageTitle,
  lessons,
  unitIndex,
  unitCount,
  whyThisWhyNow,
  priorKnowledgeRequirements,
  threads,
  phaseSlug,
  tierOptionToggles,
  subjectOptionToggles,
  nextUnit,
  prevUnit,
  subjectCategories,
  yearTitle,
  examBoardTitle,
}: UnitViewProps) => {
  const hasToggles =
    tierOptionToggles.length > 1 || subjectOptionToggles.length > 1;
  return (
    <OakBox $ph="spacing-40">
      <OakGrid
        $cg="spacing-16"
        $rg="spacing-56"
        $mb={["spacing-0", "spacing-48", "spacing-48"]}
        $mh="auto"
        $mt={["spacing-48", "spacing-56"]}
        $width={"100%"}
        $maxWidth={"spacing-1280"}
        $position="relative"
      >
        <OakBox
          $position="absolute"
          $zIndex="in-front"
          $top="spacing-0"
          $left="spacing-0"
        >
          <SkipLink href="#lessons">Skip to lessons</SkipLink>
        </OakBox>
        <OakGridArea $colSpan={[12, 4]} $gap={"spacing-56"}>
          {hasToggles && (
            <OakFlex $flexDirection="column" $gap="spacing-32">
              <ProgrammeToggles
                heading="Learning tier (KS4)"
                headingId="tier-toggle-heading"
                unitSlug={unitSlug}
                programmeToggles={tierOptionToggles}
              />
              <ProgrammeToggles
                heading="Exam subject (KS4)"
                headingId="subject-toggle-heading"
                unitSlug={unitSlug}
                programmeToggles={subjectOptionToggles}
              />
            </OakFlex>
          )}
          <UnitThreads
            threads={threads}
            $display={["flex", "flex", "none"]}
            phaseSlug={phaseSlug}
          />
          <UnitInfo
            whyThisWhyNow={whyThisWhyNow}
            priorKnowledgeRequirements={priorKnowledgeRequirements}
            $display={["flex", "none", "flex"]}
          />
          <UnitThreads
            threads={threads}
            $display={["none", "none", "flex"]}
            phaseSlug={phaseSlug}
          />
          <HelpLinkCard $display={["none", "block"]} />
        </OakGridArea>
        <OakGridArea
          $colSpan={[12, 7]}
          $colStart={[1, 6]}
          $gap="spacing-56"
          id="lessons"
        >
          <UnitInfo
            whyThisWhyNow={whyThisWhyNow}
            priorKnowledgeRequirements={priorKnowledgeRequirements}
            $display={["none", "flex", "none"]}
          />
          <LessonList
            programmeSlug={programmeSlug}
            unitSlug={unitSlug}
            unitTitle={unitTitle}
            unitDescription={unitDescription}
            subjectTitle={subjectTitle}
            subjectSlug={subjectSlug}
            keyStageSlug={keyStageSlug}
            keyStageTitle={keyStageTitle}
            lessons={lessons}
            unitIndex={unitIndex}
            unitCount={unitCount}
            lessonCount={lessons.length}
            subjectCategories={subjectCategories}
          />
          <HelpLinkCard $display={["block", "none"]} />
        </OakGridArea>
        <OakGridArea $colSpan={12} $rowStart={[3, 2]} $mb={"spacing-48"}>
          <UnitViewSeoAccordion
            examBoardTitle={examBoardTitle ?? undefined}
            yearGroup={yearTitle}
            keyStage={keyStageTitle}
            unitTitle={unitTitle}
            subjectTitle={subjectTitle}
            phaseSlug={phaseSlug}
            programmeSlug={programmeSlug}
          />
          <PreviousNextNav
            backgroundColorLevel={getBackgroundColorLevel(phaseSlug)}
            currentIndex={unitIndex}
            navItemType="unit"
            previous={
              prevUnit
                ? {
                    href: resolveOakHref({
                      page: "integrated-unit-overview",
                      programmeSlug,
                      unitSlug: prevUnit.slug,
                    }),
                    title: prevUnit.title,
                  }
                : undefined
            }
            next={
              nextUnit
                ? {
                    href: resolveOakHref({
                      page: "integrated-unit-overview",
                      programmeSlug,
                      unitSlug: nextUnit.slug,
                    }),
                    title: nextUnit.title,
                  }
                : undefined
            }
          />
        </OakGridArea>
      </OakGrid>
    </OakBox>
  );
};

const UnitViewSeoAccordion = ({
  examBoardTitle,
  yearGroup,
  keyStage,
  unitTitle,
  subjectTitle,
  phaseSlug,
  programmeSlug,
}: {
  examBoardTitle?: string;
  yearGroup: string;
  keyStage: string;
  unitTitle: string;
  subjectTitle: string;
  phaseSlug: string;
  programmeSlug: string;
}) => {
  const subjectPhaseSlug = `${programmeSlug}`;
  const examBoardText = examBoardTitle ? `${examBoardTitle} ` : "";

  // Generate keystages and years based on phase
  const getPhaseContent = (phase: string) => {
    const result: string[] = [];
    const keystages = getKeystagesFromPhase(phase);

    keystages.forEach((ks) => {
      result.push(ks.toUpperCase());
      const years =
        keystageYearMappings[ks as keyof typeof keystageYearMappings];
      if (years) {
        years.forEach((year) => {
          result.push(`Year ${year}`);
        });
      }
    });

    return result;
  };

  const phaseContent = getPhaseContent(phaseSlug);

  return (
    <OakBasicAccordion
      id={"units-seo-accordion"}
      header={`Explore this ${examBoardText}${yearGroup} ${keyStage} unit to find free lesson teaching resources, including...`}
    >
      <OakFlex $flexDirection="column" $gap="spacing-16">
        <OakP>
          slide decks, worksheet PDFs, quizzes and lesson overviews. You can
          select individual lessons from the {unitTitle} unit and download the
          resources you need, or download the entire unit now.
        </OakP>
        <OakP>
          See every unit listed in our{" "}
          <OakLink
            href={resolveOakHref({
              page: "curriculum-overview",
              subjectPhaseSlug,
            })}
          >
            {examBoardText}
            {phaseSlug} {subjectTitle} curriculum
          </OakLink>{" "}
          and discover more of our teaching resources for{" "}
          <OakLink
            href={resolveOakHref({
              page: "curriculum-units",
              subjectPhaseSlug,
            })}
          >
            {examBoardText} {phaseSlug} {subjectTitle} programmes
          </OakLink>
          , covering:
        </OakP>
        <OakUL>
          {phaseContent.map((item) => (
            <OakLI key={item}>
              {item} {subjectTitle}
            </OakLI>
          ))}
        </OakUL>
      </OakFlex>
    </OakBasicAccordion>
  );
};

const getBackgroundColorLevel = (phaseSlug: UnitViewProps["phaseSlug"]) => {
  return phaseSlug === "primary" ? 4 : 3;
};

const UnitInfo = ({
  whyThisWhyNow,
  priorKnowledgeRequirements,
  $display,
}: {
  whyThisWhyNow: UnitViewProps["whyThisWhyNow"];
  priorKnowledgeRequirements: UnitViewProps["priorKnowledgeRequirements"];
  $display: OakFlexProps["$display"];
}) => {
  return (
    <OakFlex $display={$display} $flexDirection={"column"} $gap={"spacing-56"}>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-20"}
        $display={whyThisWhyNow ? "flex" : "none"}
      >
        <OakHeading tag="h2" $font={"heading-7"}>
          Why this why now
        </OakHeading>
        <OakTypography $font={"body-3"}>{whyThisWhyNow}</OakTypography>
      </OakFlex>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-20"}
        $display={priorKnowledgeRequirements?.length ? "flex" : "none"}
      >
        <OakHeading tag="h2" $font={"heading-7"}>
          Prior knowledge requirements
        </OakHeading>
        <OakUL>
          {priorKnowledgeRequirements?.map((r) => (
            <OakLI key={r}>
              <OakTypography $font={"body-3"}>{r}</OakTypography>
            </OakLI>
          ))}
        </OakUL>
      </OakFlex>
    </OakFlex>
  );
};

const UnitThreads = ({
  threads,
  $display,
  phaseSlug,
}: {
  threads: UnitViewProps["threads"];
  $display: OakFlexProps["$display"];
  phaseSlug: UnitViewProps["phaseSlug"];
}) => {
  if (threads.length) {
    return (
      <OakFlex
        $flexDirection={"column"}
        $display={$display}
        $gap={"spacing-20"}
      >
        <OakHeading tag={"h2"} $font={"heading-7"}>
          Threads
        </OakHeading>
        <OakFlex $gap={"spacing-8"} $flexWrap={"wrap"}>
          {threads.map((thread) => (
            <OakTagFunctional
              key={thread}
              label={thread}
              $background={`bg-decorative${getBackgroundColorLevel(phaseSlug)}-very-subdued`}
              $borderColor={`border-decorative${getBackgroundColorLevel(phaseSlug)}`}
              $ba={"border-solid-s"}
            />
          ))}
        </OakFlex>
      </OakFlex>
    );
  }
  return null;
};

const HelpLinkCard = ({ $display }: { $display: OakBoxProps["$display"] }) => {
  return (
    <OakBox
      $dropShadow={"drop-shadow-centred-standard"}
      $borderRadius={"border-radius-m2"}
      $display={$display}
    >
      <OakCard
        heading="Learn how you can make the best use of Oak resources"
        headingLevel="h2"
        href={resolveOakHref({ page: "guide-to-oak" })}
        subCopy="A step-by-step guide to getting started"
        linkText="Get more out of Oak"
        linkIconName="arrow-right"
        imageSrc={getCloudinaryImageUrl(
          "v1734018546/OWA/illustrations/hero-aila_wgpmas.jpg",
        )}
        aspectRatio="4/3"
      />
    </OakBox>
  );
};
