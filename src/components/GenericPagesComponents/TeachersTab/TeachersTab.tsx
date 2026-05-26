import { FC } from "react";
import styled from "styled-components";
import {
  OakTypography,
  OakHeading,
  OakFlex,
  OakIcon,
  OakBox,
  OakIconProps,
  OakP,
} from "@oaknational/oak-components";

import { getBreakpoint } from "@/styles/utils/responsive";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import Illustration from "@/components/SharedComponents/Illustration";

type TeacherTabProps = {
  readonly curriculumPhaseOptions: SubjectPhasePickerData;
};

const RESOURCE_ICONS = [
  { iconName: "additional-material", text: "Teaching resources" },
  { iconName: "curriculum-plan", text: "Curriculum plans" },
  { iconName: "ai-teaching-resources", text: "AI tools" },
] as ResourcesIconProps[];

interface ResourcesIconProps {
  iconName: OakIconProps["iconName"];
  text: string;
}

function ResourcesIcon({ iconName, text }: Readonly<ResourcesIconProps>) {
  return (
    <OakFlex
      $flexDirection={"row"}
      $maxWidth={["auto", "auto", "spacing-160"]}
      $alignItems={"center"}
      $gap="spacing-12"
    >
      <OakBox
        $borderRadius={"border-radius-circle"}
        $background={"bg-decorative1-very-subdued"}
        $pa="spacing-12"
      >
        <OakIcon
          iconHeight="spacing-24"
          iconWidth="spacing-24"
          aria-hidden={true}
          iconName={iconName}
        />
      </OakBox>
      <OakP $font="body-2-bold">{text}</OakP>
    </OakFlex>
  );
}

function ResourcesIcons() {
  return (
    <OakFlex
      $mt={["spacing-0", "spacing-24", "spacing-40"]}
      $flexDirection={["column", "column", "row"]}
      $alignItems={["start", "start", "center"]}
      $justifyContent={"center"}
      $gap={["spacing-8", "spacing-8", "spacing-32"]}
      $width={["100%", "auto"]}
    >
      {RESOURCE_ICONS.map(({ iconName, text }) => (
        <ResourcesIcon key={iconName} iconName={iconName} text={text} />
      ))}
    </OakFlex>
  );
}

function HomePageCopy() {
  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
      <OakHeading $font={["heading-4", "heading-4", "heading-3"]} tag={"h1"}>
        <OakBox $width={"fit-content"}>Helping you deliver </OakBox>
        <OakBox $width={"fit-content"}>a world-class curriculum</OakBox>
      </OakHeading>
      <OakTypography $font={"body-1"}>
        Free, national curriculum-aligned resources designed by subject experts,
        openly available to support innovation.
      </OakTypography>
    </OakFlex>
  );
}

function PhasePickerWithLegend({
  curriculumPhaseOptions,
  layout,
}: Readonly<{
  curriculumPhaseOptions: SubjectPhasePickerData;
  layout: "mobile" | "tablet" | "desktop";
}>) {
  return (
    <OakBox $width={"100%"}>
      <OakHeading
        tag="h2"
        $font="heading-7"
        $mb={["spacing-24", "spacing-24", "spacing-32"]}
      >
        Explore curriculum plans and teaching resources
      </OakHeading>
      <SubjectPhasePicker
        {...curriculumPhaseOptions}
        id={"teachers-subject-picker-" + layout}
      />
    </OakBox>
  );
}

const IMAGE_WIDTH = 524;

const BoxWithMaxWidth = styled(OakBox)`
  max-width: auto;
  @media (min-width: ${getBreakpoint("small")}px) {
    max-width: ${IMAGE_WIDTH}px;
  }
`;

function HeroImage() {
  return (
    <BoxWithMaxWidth $width="100%">
      <Illustration
        slug={"hero-pupils"}
        noCrop
        $objectFit="contain"
        priority
        $ba={3}
        $borderStyle={"solid"}
        $borderColor={"black"}
        width={IMAGE_WIDTH}
        height={313}
      />
    </BoxWithMaxWidth>
  );
}

const TeachersTab: FC<TeacherTabProps> = ({ curriculumPhaseOptions }) => {
  return (
    <OakFlex
      $background={"bg-decorative1-main"}
      $pv={["spacing-48", "spacing-48", "spacing-56"]}
      $justifyContent={"center"}
    >
      {/* Mobile Layout */}
      <OakBox $display={["block", "none", "none"]}>
        <OakFlex
          $flexDirection={"column"}
          $ph="spacing-20"
          $alignItems={"flex-start"}
          $gap={"spacing-32"}
          $flexGrow={0}
          $flexShrink={1}
          $flexBasis={"auto"}
        >
          <HomePageCopy />
          <OakFlex
            $width={["100%"]}
            $flexDirection="column"
            $gap={["spacing-24"]}
          >
            <HeroImage />
          </OakFlex>
          <PhasePickerWithLegend
            layout={"mobile"}
            curriculumPhaseOptions={curriculumPhaseOptions}
          />
          <ResourcesIcons />
        </OakFlex>
      </OakBox>
      {/* Tablet Layout */}
      <OakBox $display={["none", "block", "none"]} $ph={"spacing-40"}>
        <OakFlex
          $alignItems={"start"}
          $justifyContent={"space-between"}
          $gap="spacing-16"
          $mb={"spacing-24"}
        >
          <OakBox $width={"50%"}>
            <HomePageCopy />
          </OakBox>
          <OakBox $width={"50%"}>
            <HeroImage />
          </OakBox>
        </OakFlex>
        <PhasePickerWithLegend
          layout="tablet"
          curriculumPhaseOptions={curriculumPhaseOptions}
        />
        <ResourcesIcons />
      </OakBox>
      {/* Desktop Layout */}
      <OakBox
        $display={["none", "none", "block"]}
        $maxWidth={"spacing-1280"}
        $ph={"spacing-56"}
      >
        <OakFlex
          $alignItems={"center"}
          $justifyContent={"space-between"}
          $gap={"spacing-40"}
          $mb={"spacing-24"}
        >
          <OakFlex $flexDirection={"column"} $gap={"spacing-40"} $width={"50%"}>
            <HomePageCopy />
            <PhasePickerWithLegend
              layout="desktop"
              curriculumPhaseOptions={curriculumPhaseOptions}
            />
          </OakFlex>
          <OakFlex $flexDirection={"column"} $alignItems="end" $width={"50%"}>
            <HeroImage />
            <ResourcesIcons />
          </OakFlex>
        </OakFlex>
      </OakBox>
    </OakFlex>
  );
};

export default TeachersTab;
