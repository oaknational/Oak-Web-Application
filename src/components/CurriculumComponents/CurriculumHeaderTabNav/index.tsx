import { ComponentTypeValueType, PhaseValueType } from "@/browser-lib/avo/Avo";
import { ButtonVariant } from "@/components/SharedComponents/Button/common";
import ButtonAsLink, {
  ButtonAsLinkProps,
} from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";
import useAnalytics from "@/context/Analytics/useAnalytics";

/**
 * CurriculumHeaderTabNav is a 'nav' component which renders a tab nav specific to curriculum pages.
 *
 * ## Usage
 *
 * It is only used in the CurriculumHeader component so far.
 */
const CurriculumHeaderTabNav = ({
  label,
  links,
  variant = "flat",
  ...flexProps
}: FlexProps & {
  label: string;
  links: ButtonAsLinkProps[];
  variant?: ButtonVariant;
  trackingData: {
    subjectTitle: string;
    subjectSlug: string;
    phaseSlug: PhaseValueType;
    tab: string;
  };
}) => {
  const { subjectTitle, subjectSlug, phaseSlug, tab } = flexProps.trackingData;
  const { track } = useAnalytics();
  return (
    <Flex
      as="nav"
      aria-label={label}
      $mv={0}
      $pv={0}
      $overflowY={"hidden"}
      $overflowX={"auto"}
      {...flexProps}
    >
      {links.map((link, i) => (
        <ButtonAsLink
          {...link}
          size="large"
          variant={variant}
          aria-current={link.isCurrent ? "page" : undefined}
          key={`CurriculumHeaderTabNav-${link.page}-${i}`}
          $font={["heading-7", "heading-6"]}
          $pt={[3, 0]}
          $ph={20}
          onClick={() => {
            track.curriculumVisualiserTabAccessed({
              subjectTitle: subjectTitle, // string
              subjectSlug: subjectSlug, // string
              platform: "owa", // string ( allowed values: "owa", "aila-beta")
              product: "curriculum visualiser", // string ( allowed values: "ai lesson assistant", "curriculum visualiser", "curriculum resources", "pupil lesson activities", "teacher lesson resources")
              engagementIntent: "explore", // string ( allowed values: "explore", "refine", "use", "advocate")
              componentType:
                `${tab === "overview" ? "explainer" : tab}_tab` as ComponentTypeValueType, // string ( allowed values: "hamburger_menu_button", "text_input", "regenerate_response_button", "select_oak_lesson", "type_edit", "lesson_finish_check", "continue_button", "continue_text", "go_to_share_page_button", "example_lesson_button", "homepage_primary_create_a_lesson_button", "homepage_secondary_create_a_lesson_button", "footer_menu_link", "download_button", "homepage_button", "curriculum_visualiser_button", "see_lessons_in_unit_button", "year_group_button", "learning_tier_button", "subject_category_button", "unit_info_button", "lessons_in_unit", "previous_unit_desc", "following_unit_desc", "video", "filter_link", "keystage_keypad_button", "lesson_card", "lesson_download_button", "programme_card", "search_button", "search_result_item", "share_button", "subject_card", "unit_card", "homepage_tab", "landing_page_button", "why_this_why_now", "unit_sequence_tab", "download_tab", "explainer_tab", "aims_and_purpose", "oak_curriculum_principles", "oak_subject_principles", "national_curriculum", "curriculum_delivery", "curiculum_coherence", "recommendations_from_subject_specific_reports", "subject_specific_needs", "our_curriculum_partner")
              eventVersion: "2.0.0", // string ( allowed values: "2.0.0")
              analyticsUseCase: "Teacher", // string ( allowed values: "Pupil", "Teacher")
              phase: phaseSlug, // string ( allowed values: "primary", "secondary")
            });
          }}
        />
      ))}
    </Flex>
  );
};

export default CurriculumHeaderTabNav;
