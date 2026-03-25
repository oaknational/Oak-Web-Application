"use client";

import {
  GoogleClassroomBrowseView,
  useGoogleClassroomAddonStore,
} from "@oaknational/google-classroom-addon/ui";

import useAnalytics from "@/context/Analytics/useAnalytics";
import { getClientEnvironment } from "@/components/GoogleClassroom/getClientEnvironment";
import {
  AnalyticsUseCase,
  ComponentType,
  EngagementIntent,
  EventVersion,
  FilterType,
  Platform,
  Product,
} from "@/browser-lib/avo/Avo";

function BrowseGoogleClassroomPage() {
  const { track } = useAnalytics();
  const googleLoginHint = useGoogleClassroomAddonStore(
    (state) => state.googleLoginHint,
  );

  const clientEnvironment = getClientEnvironment();
  const years: {
    yearSlug: string;
    yearDescription: string;
    phase: "primary" | "secondary";
  }[] = [
    { yearSlug: "year-1", yearDescription: "Year 1", phase: "primary" },
    { yearSlug: "year-2", yearDescription: "Year 2", phase: "primary" },
    { yearSlug: "year-3", yearDescription: "Year 3", phase: "primary" },
    { yearSlug: "year-4", yearDescription: "Year 4", phase: "primary" },
    { yearSlug: "year-5", yearDescription: "Year 5", phase: "primary" },
    { yearSlug: "year-6", yearDescription: "Year 6", phase: "primary" },
    { yearSlug: "year-7", yearDescription: "Year 7", phase: "secondary" },
    { yearSlug: "year-8", yearDescription: "Year 8", phase: "secondary" },
    { yearSlug: "year-9", yearDescription: "Year 9", phase: "secondary" },
    { yearSlug: "year-10", yearDescription: "Year 10", phase: "secondary" },
    { yearSlug: "year-11", yearDescription: "Year 11", phase: "secondary" },
  ];
  return (
    <GoogleClassroomBrowseView
      years={years}
      subjectsUrlTemplate={"/classroom/browse/years/:yearSlug/subjects"}
      onYearSelected={(year) => {
        track.browseRefined({
          platform: Platform.GOOGLE_CLASSROOM,
          product: Product.TEACHER_LESSON_RESOURCES,
          analyticsUseCase: AnalyticsUseCase.TEACHER,
          componentType: ComponentType.YEAR_GROUP_BUTTON,
          filterType: FilterType.YEAR_FILTER,
          filterValue: year.yearSlug,
          eventVersion: EventVersion["2_0_0"],
          engagementIntent: EngagementIntent.REFINE,
          activeFilters: {},
          googleLoginHint,
          clientEnvironment,
        });
      }}
    />
  );
}

export default BrowseGoogleClassroomPage;
