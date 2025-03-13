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

  const handleAnalytics = (clickedTabSlug: keyof typeof trackingTabMapping) => {
    track.productHomepageAccessed({
      platform: current === "ai" ? "aila-beta" : "owa",
      product: trackingTabMapping[clickedTabSlug] as ProductValueType,
      engagementIntent: "explore",
      componentType: "homepage_tab",
      eventVersion: "2.0.0",
      analyticsUseCase: current === "pupils" ? "Pupil" : "Teacher",
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
          onClick={() => handleAnalytics("teachers")}
        />
        <OakHomepageTabButton
          title="Curriculum plans"
          iconName="homepage-teacher-map"
          href="/curriculum"
          element="a"
          isActive={current === "curriculum"}
          onClick={() => handleAnalytics("curriculum")}
        />
        <OakHomepageTabButton
          title="AI experiments"
          iconName="homepage-robot-waving"
          href="/ai"
          element="a"
          isActive={current === "ai"}
          showNewIcon={true}
          onClick={() => handleAnalytics("ai")}
        />
        <OakHomepageTabButton
          title="Pupils"
          iconName="homepage-three-pupils"
          href="/pupils"
          element="a"
          isActive={current === "pupils"}
          onClick={() => handleAnalytics("pupils")}
        />
      </OakFlex>
      <OakHandDrawnHR hrColor={"white"} $height={"all-spacing-05"} />
    </OakFlex>
  );
};

export default HomePageTabImageNav;
