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

import Illustration from "@/components/SharedComponents/Illustration";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import { resolveOakHref } from "@/common-lib/urls";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import useAnalytics from "@/context/Analytics/useAnalytics";

type CurriculumDownloadTabProps = {
  curriculumPhaseOptions: SubjectPhasePickerData;
};

const CurriculumTab: FC<CurriculumDownloadTabProps> = ({
  curriculumPhaseOptions,
}) => {
  const { track } = useAnalytics();
  return (
    <OakBox
      $background={"mint"}
      $pv="inner-padding-xl"
      $ph={"inner-padding-m"}
      $position={"relative"}
    >
      {/* scroll wrapper */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {/* force this positioning */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            right: "calc(-40rem + 50vw - 200px)",
            width: 529,
            height: 420,
          }}
        >
          <OakIcon
            $display={["none", "none", "block"]}
            iconName={"looping-line-5"}
            $colorFilter={"mint30"}
            $width={"100%"}
            $height={"100%"}
          />
        </div>
      </div>
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
            <OakFlex $flexDirection={"column"} $gap="all-spacing-2">
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
              />
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
