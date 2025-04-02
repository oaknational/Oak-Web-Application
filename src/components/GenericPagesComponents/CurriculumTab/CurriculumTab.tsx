import { FC } from "react";
import {
  OakHeading,
  OakLI,
  OakUL,
  OakTypography,
  OakFlex,
  OakSecondaryLink,
  OakMaxWidth,
  OakBox,
  OakIcon,
} from "@oaknational/oak-components";
import styled from "styled-components";

import Illustration from "@/components/SharedComponents/Illustration";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import { resolveOakHref } from "@/common-lib/urls";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import useAnalytics from "@/context/Analytics/useAnalytics";

type CurriculumDownloadTabProps = {
  curriculumPhaseOptions: SubjectPhasePickerData;
};

const IconWrapper = styled.div`
  position: absolute;
  width: 72%;
  height: 540px;
  z-index: 90;
  bottom: -157px;
  right: -120px;

  @media (max-width: 1493px) and (min-width: 1450px) {
    right: calc(-120px + 1.5vw);
  }

  @media (max-width: 1450px) and (min-width: 1420px) {
    right: calc(-120px + 3vw);
  }

  @media (max-width: 1420px) and (min-width: 1400px) {
    right: calc(-120px + 4vw);
  }

  @media (max-width: 1413px) and (min-width: 1381px) {
    right: calc(-120px + 5vw);
  }

  @media (max-width: 1380px) and (min-width: 1341px) {
    right: calc(-120px + 6vw);
  }

  @media (max-width: 1340px) and (min-width: 1281px) {
    right: calc(-120px + 7.5vw);
  }

  @media (max-width: 1280px) {
    display: none;
  }
`;

const CurriculumTab: FC<CurriculumDownloadTabProps> = ({
  curriculumPhaseOptions,
}) => {
  const { track } = useAnalytics();
  return (
    <OakBox $background={"mint"} $pv="inner-padding-xl" $ph={"inner-padding-m"}>
      <OakMaxWidth $pv={"inner-padding-xl"}>
        <OakFlex>
          <OakFlex
            $flexDirection={"column"}
            $gap={"space-between-m"}
            $pt={"inner-padding-xl2"}
            $width={"all-spacing-22"}
          >
            <OakHeading $font={"heading-7"} tag={"h1"} $color={"grey70"}>
              Teachers & subject leads
            </OakHeading>
            <OakHeading
              $font={["heading-4", "heading-4", "heading-3"]}
              tag={"h2"}
            >
              Curriculum plans
            </OakHeading>
            <OakFlex $flexDirection={"column"}>
              {" "}
              <OakTypography $font={"body-1"}>
                All of our curriculum plans are:
              </OakTypography>
              <OakUL $font={"body-1"}>
                <OakLI $mt={"space-between-s"}>
                  National curriculum-aligned
                </OakLI>
                <OakLI $mt={"space-between-s"}>
                  Sequenced across year groups
                </OakLI>
                <OakLI $mt={"space-between-s"}>
                  Designed by curriculum experts
                </OakLI>
              </OakUL>
            </OakFlex>

            <OakFlex
              $gap="all-spacing-6"
              $flexWrap={"wrap"}
              $pb="inner-padding-xl"
            >
              <OakSecondaryLink
                href={resolveOakHref({ page: "curriculum-landing-page" })}
                onClick={() => {
                  track.curriculumLandingPageAccessed({
                    platform: "owa",
                    product: "curriculum resources",
                    engagementIntent: "explore",
                    componentType: "oak_curriculum_principles",
                    eventVersion: "2.0.0",
                    analyticsUseCase: "Teacher",
                  });
                }}
                iconName="chevron-right"
                isTrailingIcon
              >
                <OakTypography $font={"body-1-bold"} $color="black" as="span">
                  Our curriculum planning approach
                </OakTypography>
              </OakSecondaryLink>
            </OakFlex>
            <OakBox
              $display={["none", "none", "block"]}
              $maxWidth={"all-spacing-22"}
            >
              <SubjectPhasePicker {...curriculumPhaseOptions} />
            </OakBox>
          </OakFlex>
          {/* @todo replace with OakFlex - work out $flex prop */}
          <OakFlex
            $flexDirection={"row"}
            $justifyContent={"flex-end"}
            $alignItems={"center"}
            $flexGrow={1}
            $display={["none", "flex", "flex"]}
          >
            <OakFlex
              $flexDirection={"column"}
              $gap="all-spacing-2"
              $position={"relative"}
            >
              <Illustration
                $transform={["none", "none", "rotate(-2deg)"]}
                slug={"teacher-whiteboard"}
                noCrop
                $objectFit="contain"
                priority
                $ba={3}
                width={520}
                $borderStyle={"solid"}
                $borderColor={"black"}
                $zIndex={"fixedHeader"}
              />

              <IconWrapper>
                <OakIcon
                  iconName={"looping-line-5"}
                  $colorFilter={"mint30"}
                  $width={"100%"}
                  $height={"100%"}
                />
              </IconWrapper>
            </OakFlex>
          </OakFlex>
        </OakFlex>

        <OakBox
          $display={["block", "block", "none"]}
          $maxWidth={"all-spacing-23"}
          $pt={"inner-padding-xl"}
        >
          <SubjectPhasePicker {...curriculumPhaseOptions} />
        </OakBox>
      </OakMaxWidth>
    </OakBox>
  );
};

export default CurriculumTab;
