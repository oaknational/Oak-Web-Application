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
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";

const YearListingPage = () => {
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
    <OakThemeProvider theme={oakDefaultTheme}>
      <AppLayout
        seoProps={{
          ...getSeoProps({
            title: `Year listing`,
            description: `Listing of all years in the curriculum.`,
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
                  <OakHeading
                    tag="h2"
                    $font={["heading-light-7", "heading-light-6"]}
                  >
                    Learn or revise what you want, when you want.
                  </OakHeading>
                </OakFlex>

                <OakHandDrawnHR
                  hrColor={"border-neutral-lighter"}
                  $width={"100%"}
                />
                <OakHeading
                  tag="h3"
                  $font={["heading-6", "heading-5"]}
                  $mv={"space-between-l"}
                >
                  What year are you in?
                </OakHeading>
                <OakGrid
                  $cg={"space-between-s"}
                  $rg={"space-between-s"}
                  $gridTemplateColumns={[
                    "repeat(2 , 1fr)",
                    "repeat(5 , 1fr)",
                    "repeat(6 , 1fr)",
                  ]}
                  role="list"
                >
                  {years.map((year) => {
                    return (
                      <OakGridArea $colSpan={1} key={year.yearSlug}>
                        <OakFlex $alignItems={"stretch"} $height={"100%"}>
                          <OakPupilJourneyYearButton
                            role="listitem"
                            element="a"
                            phase={year.phase}
                            href={resolveOakHref({
                              page: "pupil-subject-index",
                              yearSlug: year.yearSlug,
                            })}
                            width={"100%"}
                          >
                            {year.yearDescription}
                          </OakPupilJourneyYearButton>
                        </OakFlex>
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
