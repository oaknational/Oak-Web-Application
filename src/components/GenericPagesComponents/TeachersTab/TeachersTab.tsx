import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakHeading,
  OakFlex,
  OakMaxWidth,
} from "@oaknational/oak-components";
import styled from "styled-components";

import ImageContainer from "@/components/GenericPagesComponents/ImageContainer";
import TeachersTabResourceSelectorCard from "@/components/GenericPagesComponents/TeachersTabResourceSelectorCard";
import { KeyStageKeypadProps } from "@/components/SharedComponents/KeyStageKeypad/KeyStageKeypad";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";

type PositionedProps = {
  bottom?: number;
  left?: number;
  right?: number;
};
const PositionedTeachersTabResourceSelectorCard = styled(
  TeachersTabResourceSelectorCard,
)<PositionedProps>`
  ${({ bottom }) => bottom && `bottom: ${bottom}px;`}
  ${({ left }) => left && `left: ${left}px;`}
  ${({ right }) => right && `right: ${right}px;`}
`;

type TeacherTabProps = {
  keyStages: KeyStageKeypadProps["keyStages"];
};
const TeachersTab: FC<TeacherTabProps> = () => {
  return (
    <OakFlex
      $background={"bg-decorative1-main"}
      $pv="spacing-24"
      $overflow={"hidden"}
    >
      <OakMaxWidth $ph={["spacing-16"]}>
        <OakGrid $cg={"spacing-16"}>
          <OakGridArea $color={"text-primary"} $colSpan={[12, 6]}>
            <OakFlex
              $flexDirection={"column"}
              $maxWidth={["spacing-640"]}
              $pt={"spacing-32"}
              $alignItems={"flex-start"}
              $gap={"spacing-24"}
              $flexGrow={0}
              $flexShrink={1}
              $flexBasis={"auto"}
            >
              <OakHeading $font={"heading-3"} tag={"h2"}>
                Helping you deliver a world-class curriculum
              </OakHeading>
              <OakTypography $font={"body-1"}>
                Free, national curriculum-aligned resources designed by subject
                experts, openly available to support innovation.
              </OakTypography>
              <OakFlex
                $width={["100%", "100%", "max-content"]}
                $flexDirection="column"
                $gap={["spacing-24", "spacing-32"]}
              >
                <OakFlex $flexDirection="column" $gap="spacing-16">
                  <OakHeading tag="h3" $font="heading-7">
                    Explore curriculum plans and teaching resources
                  </OakHeading>
                </OakFlex>
              </OakFlex>
              <SubjectPhasePicker {...curriculumPhaseOptions} />
            </OakFlex>
          </OakGridArea>
          <OakGridArea $colSpan={[12, 6]} $alignItems={"flex-end"}>
            <ImageContainer
              imageSlug={"hero-pupils"}
              width={518}
              height={313}
              sizes={getSizes([100, 518])}
            >
              <PositionedTeachersTabResourceSelectorCard
                icon={"worksheet"}
                title="Worksheets"
                angle={-4}
                bottom={30}
                left={166}
                $display={["none", "none", "flex"]}
              />
              <PositionedTeachersTabResourceSelectorCard
                icon={"slide-deck"}
                title="Slide decks"
                angle={2}
                bottom={110}
                left={-72}
                $display={["none", "none", "flex"]}
              />
              <PositionedTeachersTabResourceSelectorCard
                icon={"quiz"}
                title="Quizzes"
                angle={4}
                bottom={60}
                right={-54}
                $display={["none", "none", "flex"]}
              />
            </ImageContainer>
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </OakFlex>
  );
};

export default TeachersTab;
