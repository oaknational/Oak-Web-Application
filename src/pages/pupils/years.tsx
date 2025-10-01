import { useState } from "react";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakPupilJourneyLayout,
  OakPupilJourneyYearButton,
  OakThemeProvider,
  oakDefaultTheme,
  OakHandDrawnHR,
  OakBox,
  OakP,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import useAnalytics from "@/context/Analytics/useAnalytics";

const YearListingPage = () => {
  const [trackingSent, setTrackingSent] = useState(false);
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
  if (!trackingSent) {
    track.browseAccessed({
      platform: "owa",
      product: "pupil lesson activities",
      engagementIntent: "use",
      eventVersion: "2.0.0",
      componentType: "page view",
      analyticsUseCase: "Pupil",
    });
    setTrackingSent(true);
  }
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <AppLayout
        seoProps={{
          ...getSeoProps({
            title: `Year listing`,
            description: ` Explore our lessons and resources by year group to help you learn or revise what you want, including Year 1 to 11.`,
          }),
        }}
      >
        <OakPupilJourneyLayout sectionName="year-listing">
          <OakFlex $pv={"inner-padding-xl7"}>
            <OakFlex
              $background={"bg-primary"}
              $pv="inner-padding-xl5"
              $ph={"inner-padding-xl"}
              $flexDirection={"column"}
              $alignItems={"center"}
              $borderRadius={"border-radius-l"}
              $ba={"border-solid-s"}
              $borderColor={"border-decorative1-stronger"}
            >
              <OakFlex
                $ph={"inner-padding-xl"}
                $flexDirection={"column"}
                $alignItems={"center"}
              >
                <OakFlex
                  $flexDirection={"column"}
                  $alignItems={"center"}
                  $gap={"space-between-s"}
                  $mb={"space-between-m2"}
                >
                  <OakHeading tag="h1" $font={["heading-5", "heading-4"]}>
                    Welcome to Oak!
                  </OakHeading>
                  <OakP $font={["heading-light-7", "heading-light-6"]}>
                    Learn or revise what you want, when you want.
                  </OakP>
                </OakFlex>

                <OakHandDrawnHR
                  hrColor={"border-neutral-lighter"}
                  $width={"100%"}
                  aria-hidden="true"
                />
                <OakHeading
                  tag="h2"
                  $font={["heading-6", "heading-5"]}
                  $mv={"space-between-l"}
                >
                  What year are you in?
                </OakHeading>
                <OakGrid
                  role="list"
                  $cg={"space-between-s"}
                  $rg={"space-between-s"}
                  $gridTemplateColumns={[
                    "repeat(2 , 1fr)",
                    "repeat(4 , 1fr)",
                    "repeat(6 , 1fr)",
                  ]}
                >
                  {years.map((year) => {
                    return (
                      <OakGridArea
                        $colSpan={1}
                        key={year.yearSlug}
                        role="listitem"
                      >
                        <OakPupilJourneyYearButton
                          element="a"
                          phase={year.phase}
                          href={resolveOakHref({
                            page: "pupil-subject-index",
                            yearSlug: year.yearSlug,
                          })}
                          onClick={() => {
                            track.browseRefined({
                              platform: "owa",
                              product: "pupil lesson activities",
                              engagementIntent: "use",
                              eventVersion: "2.0.0",
                              componentType: "year_keypad_button",
                              analyticsUseCase: "Pupil",
                              filterType: "Year filter",
                              filterValue: year.yearDescription,
                              activeFilters: {},
                            });
                          }}
                          width={"100%"}
                        >
                          <OakBox
                            $minWidth={[
                              "auto",
                              "all-spacing-13",
                              "all-spacing-13",
                            ]}
                            $mh={["space-between-sssx", "auto", "auto"]}
                            $textAlign={"center"}
                          >
                            {year.yearDescription}
                          </OakBox>
                        </OakPupilJourneyYearButton>
                      </OakGridArea>
                    );
                  })}
                </OakGrid>
              </OakFlex>
            </OakFlex>
          </OakFlex>
        </OakPupilJourneyLayout>
      </AppLayout>
    </OakThemeProvider>
  );
};

export default YearListingPage;
