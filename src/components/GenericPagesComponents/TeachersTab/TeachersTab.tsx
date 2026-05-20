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

import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import Illustration from "@/components/SharedComponents/Illustration";

type TeacherTabProps = {
  readonly curriculumPhaseOptions: SubjectPhasePickerData;
};

const RESOURCE_ICONS = [
  { iconName: "additional-material", text: "Teaching resources" },
  { iconName: "curriculum-plan", text: "Curriculum plans" },
  { iconName: "ai-slide-deck", text: "AI tools" },
] as const;

function ResourcesIcon({
  iconName,
  text,
}: {
  readonly iconName: OakIconProps["iconName"];
  readonly text: string;
}) {
  return (
    <OakFlex
      $flexDirection={"row"}
      $maxWidth={["auto", "spacing-160"]}
      $alignItems={"center"}
      $gap="spacing-12"
    >
      <OakBox
        $borderRadius={"border-radius-circle"}
        $background={"bg-decorative1-very-subdued"}
        $pa={"spacing-8"}
      >
        <OakIcon $height={"spacing-32"} iconName={iconName} />
      </OakBox>
      <OakP $font="body-2-bold">{text}</OakP>
    </OakFlex>
  );
}

function ResourcesIcons() {
  return (
    <OakFlex
      $mt="spacing-40"
      $flexDirection={["column", "column", "row"]}
      $alignItems={["start", "start", "center"]}
      $flexWrap={"wrap"}
      $justifyContent={"center"}
      $gap="spacing-32"
      $width={"100%"}
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
      <OakHeading $font={"heading-3"} tag={"h2"}>
        Helping you deliver a world-class curriculum
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
}: Readonly<{
  curriculumPhaseOptions: SubjectPhasePickerData;
}>) {
  return (
    <OakBox>
      <OakHeading tag="h3" $font="heading-7" $mb={"spacing-32"}>
        Explore curriculum plans and teaching resources
      </OakHeading>
      <SubjectPhasePicker {...curriculumPhaseOptions} />
    </OakBox>
  );
}

const StyledBox = styled(OakBox)`
  max-width: 524px;
`;

function HeroImage() {
  return (
    <Illustration
      slug={"hero-pupils"}
      $objectFit="contain"
      priority
      $ba={3}
      width={524}
      height={276}
      $borderStyle={"solid"}
      $borderColor={"black"}
    />
  );
}

const TeachersTab: FC<TeacherTabProps> = () => {
  return (
    <OakFlex
      $background={"bg-decorative1-main"}
      $pv={["spacing-80", "spacing-56", "spacing-48"]}
      $justifyContent={"center"}
    >
      {/* Mobile Layout */}
      <OakBox $display={["block", "none", "none"]} $ph={["spacing-16"]}>
        <OakFlex
          $flexDirection={"column"}
          $maxWidth={["spacing-640"]}
          $pt={"spacing-32"}
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
            curriculumPhaseOptions={curriculumPhaseOptions}
          />
        </OakFlex>

        <ResourcesIcons />
      </OakBox>
      {/* Tablet Layout */}
      <OakBox $display={["none", "block", "none"]} $ph={["spacing-16"]}>
        <OakFlex
          $alignItems={"center"}
          $justifyContent={"space-between"}
          $gap="spacing-12"
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
          curriculumPhaseOptions={curriculumPhaseOptions}
        />
        <ResourcesIcons />
      </OakBox>
      {/* Desktop Layout */}
      <OakBox
        $display={["none", "none", "block"]}
        $maxWidth={"spacing-1280"}
        $ph={["spacing-16"]}
      >
        <OakFlex
          $alignItems={"center"}
          $justifyContent={"space-between"}
          $gap={"spacing-40"}
          $mb={"spacing-24"}
        >
          <OakBox $width={"50%"}>
            <HomePageCopy />
            <PhasePickerWithLegend
              curriculumPhaseOptions={curriculumPhaseOptions}
            />
          </OakBox>
          <StyledBox $width={"50%"}>
            <HeroImage />
            <ResourcesIcons />
          </StyledBox>
        </OakFlex>
      </OakBox>
    </OakFlex>
  );
};

export default TeachersTab;
