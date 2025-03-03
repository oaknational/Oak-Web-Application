import {
  OakFlex,
  OakHandDrawnHR,
  OakHomepageTabButton,
} from "@oaknational/oak-components";

import { ProductValueType } from "@/browser-lib/avo/Avo";
import useAnalytics from "@/context/Analytics/useAnalytics";

export type HomePageTab = "teachers" | "curriculum" | "ai" | "pupils";

const trackingTabMapping = {
  teachers: "teacher lesson resources",
  curriculum: "curriculum visualiser",
  ai: "ai lesson assistant",
  pupils: "pupil lesson activities",
};

const HomePageTabImageNav = ({ current }: { current: HomePageTab }) => {
  const { track } = useAnalytics();

  const handleAnalytics = () => {
    track.productHomepageAccessed({
      platform: current === "ai" ? "aila-beta" : "owa", // string ( allowed values: "owa", "aila-beta")
      product: trackingTabMapping[current] as ProductValueType, // string ( allowed values: "ai lesson assistant", "curriculum visualiser", "curriculum resources", "pupil lesson activities", "teacher lesson resources")
      engagementIntent: "explore", // string ( allowed values: "explore", "refine", "use", "advocate")
      componentType: "homepage_tab", // string ( allowed values: "hamburger_menu_button", "text_input", "regenerate_response_button", "select_oak_lesson", "type_edit", "lesson_finish_check", "continue_button", "continue_text", "go_to_share_page_button", "example_lesson_button", "homepage_primary_create_a_lesson_button", "homepage_secondary_create_a_lesson_button", "footer_menu_link", "download_button", "homepage_button", "curriculum_visualiser_button", "see_lessons_in_unit_button", "year_group_button", "learning_tier_button", "subject_category_button", "unit_info_button", "lessons_in_unit", "previous_unit_desc", "following_unit_desc", "video", "filter_link", "keystage_keypad_button", "lesson_card", "lesson_download_button", "programme_card", "search_button", "search_result_item", "share_button", "subject_card", "unit_card", "homepage_tab", "landing_page_button", "why_this_why_now", "unit_sequence_tab", "download_tab", "explainer_tab", "aims_and_purpose", "oak_curriculum_principles", "oak_subject_principles", "national_curriculum", "curriculum_delivery", "curiculum_coherence", "recommendations_from_subject_specific_reports", "subject_specific_needs", "our_curriculum_partner")
      eventVersion: "2.0.0", // string ( allowed values: "2.0.0")
      analyticsUseCase: current === "pupils" ? "Pupil" : "Teacher", // string ( allowed values: "Pupil", "Teacher")
    });
  };
  return (
    <OakFlex $flexDirection={"column"} $justifyContent={"center"}>
      <OakFlex
        as="nav"
        $background={"mint"}
        $width={"100%"}
        $alignItems={"stretch"}
        $justifyContent={"center"}
        $gap={["space-between-s", "space-between-m2"]}
        $pt={["inner-padding-xl3", "inner-padding-xl2"]}
        $ph={["inner-padding-s", null]}
        aria-label="Site sections"
      >
        <OakHomepageTabButton
          title="Teaching resources"
          iconName="homepage-teacher"
          href="/teachers"
          element="a"
          isActive={current === "teachers"}
          onClick={handleAnalytics}
        />
        <OakHomepageTabButton
          title="Curriculum plans"
          iconName="homepage-teacher-map"
          href="/curriculum"
          element="a"
          isActive={current === "curriculum"}
          onClick={handleAnalytics}
        />
        <OakHomepageTabButton
          title="AI experiments"
          iconName="homepage-robot-waving"
          href="/ai"
          element="a"
          isActive={current === "ai"}
          showNewIcon={true}
          onClick={handleAnalytics}
        />
        <OakHomepageTabButton
          title="Pupils"
          iconName="homepage-three-pupils"
          href="/pupils"
          element="a"
          isActive={current === "pupils"}
          onClick={handleAnalytics}
        />
      </OakFlex>
      <OakHandDrawnHR hrColor={"white"} $height={"all-spacing-05"} />
    </OakFlex>
  );
};

export default HomePageTabImageNav;
