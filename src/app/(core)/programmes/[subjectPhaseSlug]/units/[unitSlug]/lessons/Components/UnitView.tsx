"use client";
import {
  OakBox,
  OakBoxProps,
  OakCard,
  OakFlex,
  OakFlexProps,
  OakGrid,
  OakGridArea,
  OakLI,
  OakTagFunctional,
  OakTypography,
  OakUL,
} from "@oaknational/oak-components";

import { LessonList } from "./LessonList";

import type { TeachersUnitOverviewData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";
import { resolveOakHref } from "@/common-lib/urls";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

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
}: UnitViewProps) => {
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
          />
          <HelpLinkCard $display={["block", "none"]} />
        </OakGridArea>
      </OakGrid>
    </OakBox>
  );
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
        <OakTypography $font={"heading-7"}>Why this why now</OakTypography>
        <OakTypography $font={"body-3"}>{whyThisWhyNow}</OakTypography>
      </OakFlex>
      <OakFlex
        $flexDirection={"column"}
        $gap={"spacing-20"}
        $display={priorKnowledgeRequirements?.length ? "flex" : "none"}
      >
        <OakTypography $font={"heading-7"}>
          Prior knowledge requirements
        </OakTypography>
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
  const backgroundColorLevel = phaseSlug === "primary" ? 4 : 3;
  if (threads) {
    return (
      <OakFlex
        $flexDirection={"column"}
        $display={$display}
        $gap={"spacing-20"}
      >
        <OakTypography $font={"heading-7"}>Threads</OakTypography>
        <OakFlex $gap={"spacing-8"} $flexWrap={"wrap"}>
          {threads.map((thread) => (
            <OakTagFunctional
              key={thread}
              label={thread}
              $background={`bg-decorative${backgroundColorLevel}-very-subdued`}
              $borderColor={`border-decorative${backgroundColorLevel}`}
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
        heading="Learn how you can can make the best use of Oak resources"
        href={resolveOakHref({ page: "guide-to-oak" })}
        subCopy="A step-by-step guide to getting started"
        linkText="Get more out of Oak"
        linkIconName="arrow-right"
        imageSrc={getCloudinaryImageUrl(
          "v1734018546/OWA/illustrations/hero-aila_wgpmas.jpg",
        )}
      />
    </OakBox>
  );
};
