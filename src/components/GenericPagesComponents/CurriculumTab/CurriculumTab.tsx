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
      $background={"bg-decorative1-main"}
      $pv="spacing-24"
      $ph={"spacing-16"}
      $position={"relative"}
    >
      {/* scroll wrapper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
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
            $colorFilter={"bg-decorative1-very-subdued"}
            $width={"100%"}
            $height={"100%"}
          />
        </div>
      </div>
      <OakMaxWidth $pv={"spacing-24"}>
        <OakFlex>
          <OakFlex
            $flexDirection={"column"}
            $gap={"spacing-24"}
            $pt={"spacing-32"}
            $width={"spacing-640"}
          >
            <OakHeading $font={"heading-7"} tag={"h1"} $color={"text-primary"}>
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
                <OakLI $mt={"spacing-16"}>National curriculum-aligned</OakLI>
                <OakLI $mt={"spacing-16"}>Sequenced across year groups</OakLI>
                <OakLI $mt={"spacing-16"}>Designed by curriculum experts</OakLI>
              </OakUL>
            </OakFlex>

            <OakFlex $gap="spacing-24" $flexWrap={"wrap"} $pb="spacing-24">
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
                <OakTypography
                  $font={"body-1-bold"}
                  $color="text-primary"
                  as="span"
                >
                  Our curriculum planning approach
                </OakTypography>
              </OakSecondaryLink>
            </OakFlex>
            <OakBox
              $display={["none", "none", "block"]}
              $maxWidth={"spacing-640"}
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
            <OakFlex $flexDirection={"column"} $gap="spacing-8">
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
          $maxWidth={"spacing-960"}
          $pt={"spacing-24"}
        >
          <SubjectPhasePicker {...curriculumPhaseOptions} />
        </OakBox>
      </OakMaxWidth>
    </OakBox>
  );
};

export default CurriculumTab;
