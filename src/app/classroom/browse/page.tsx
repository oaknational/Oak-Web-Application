"use client";

import { GoogleClassroomBrowseView } from "@oaknational/google-classroom-addon/ui";

import useAnalytics from "@/context/Analytics/useAnalytics";

function BrowseGoogleClassroomPage() {
  const { track } = useAnalytics();
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
          platform: "google-classroom",
          product: "teacher lesson resources",
          analyticsUseCase: "Teacher",
          componentType: "year_group_button",
          filterType: "Year filter",
          filterValue: year.yearSlug,
          eventVersion: "2.0.0",
          engagementIntent: "refine",
          activeFilters: {},
        });
      }}
    />
  );
}

export default BrowseGoogleClassroomPage;
