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
                    platform: "owa", // string ( allowed values: "owa", "aila-beta")
                    product: "curriculum resources", // string ( allowed values: "ai lesson assistant", "curriculum visualiser", "curriculum resources", "pupil lesson activities", "teacher lesson resources")
                    engagementIntent: "explore", // string ( allowed values: "explore", "refine", "use", "advocate")
                    componentType: "oak_curriculum_principles", // string ( allowed values: "hamburger_menu_button", "text_input", "regenerate_response_button", "select_oak_lesson", "type_edit", "lesson_finish_check", "continue_button", "continue_text", "go_to_share_page_button", "example_lesson_button", "homepage_primary_create_a_lesson_button", "homepage_secondary_create_a_lesson_button", "footer_menu_link", "download_button", "homepage_button", "curriculum_visualiser_button", "see_lessons_in_unit_button", "year_group_button", "learning_tier_button", "subject_category_button", "unit_info_button", "lessons_in_unit", "previous_unit_desc", "following_unit_desc", "video", "filter_link", "keystage_keypad_button", "lesson_card", "lesson_download_button", "programme_card", "search_button", "search_result_item", "share_button", "subject_card", "unit_card", "homepage_tab", "landing_page_button", "why_this_why_now", "unit_sequence_tab", "download_tab", "explainer_tab", "aims_and_purpose", "oak_curriculum_principles", "oak_subject_principles", "national_curriculum", "curriculum_delivery", "curiculum_coherence", "recommendations_from_subject_specific_reports", "subject_specific_needs", "our_curriculum_partner")
                    eventVersion: "2.0.0", // string ( allowed values: "2.0.0")
                    analyticsUseCase: "Teacher", // string ( allowed values: "Pupil", "Teacher")
                  });
                }}
                iconName="chevron-right"
                isTrailingIcon
              >
                <OakTypography $font={"body-1-bold"} $color="black">
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
