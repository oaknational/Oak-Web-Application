import { GetStaticProps, GetStaticPropsResult } from "next";
import {
  OakPupilJourneyLayout,
  OakPupilJourneyHeader,
  OakThemeProvider,
  oakDefaultTheme,
  OakTertiaryButton,
  OakPupilJourneyListItem,
  OakFlex,
  OakInfo,
  OakHeading,
} from "@oaknational/oak-components";

import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { resolveOakHref } from "@/common-lib/urls";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";

type UnitListingPageProps = {
  curriculumData: UnitListingBrowseData;
};

type PupilUnitListingPageURLParams = {
  programmeSlug: string;
};

const PupilUnitListingPage = ({ curriculumData }: UnitListingPageProps) => {
  if (!curriculumData[0]) {
    throw new Error("No curriculum data");
  }

  const orderedCurriculumData = curriculumData.sort((a, b) => {
    const aUnitOrder = a.supplementaryData.unitOrder;
    const bUnitOrder = b.supplementaryData.unitOrder;
    return aUnitOrder - bUnitOrder;
  });

  const { programmeFields } = curriculumData[0];
  const {
    subject,
    phase,
    yearDescription,
    tier,
    examboard,
    yearSlug,
    phaseSlug,
    subjectSlug,
    examboardSlug,
    legacy,
  } = programmeFields;

  if (phase === "foundation") {
    throw new Error("Foundation phase not supported");
  }

  const baseSlug = `${subjectSlug}-${phaseSlug}-${yearSlug}`;

  const optionSlug = `options${legacy ? "-l" : ""}`;

  const lessonCount = orderedCurriculumData.reduce(
    (p, c) => p + c.lessonCount,
    0,
  );

  function pickPreviousPage(): [backHref: string, backLabel: string] {
    const hasTier = tier !== null;
    const hasExamboard = examboard !== null;

    switch (true) {
      case hasTier && hasExamboard:
        return [
          `${resolveOakHref({
            page: "pupil-programme-index",
            programmeSlug: baseSlug,
            optionSlug,
          })}?examboard=${examboardSlug}`,
          "Select tiers",
        ];
      case hasTier && !hasExamboard:
        return [
          resolveOakHref({
            page: "pupil-programme-index",
            programmeSlug: baseSlug,
            optionSlug,
          }),
          "Select tiers",
        ];
      case hasExamboard && !hasTier:
        return [
          resolveOakHref({
            page: "pupil-programme-index",
            programmeSlug: baseSlug,
            optionSlug,
          }),
          "Select examboards",
        ];
      default:
        return [
          resolveOakHref({ page: "pupil-subject-index", yearSlug }),
          "Select subjects",
        ];
    }
  }

  const [backHref, backLabel] = pickPreviousPage();

  const breadcrumbs: string[] = [yearDescription];
  if (tier) {
    breadcrumbs.push(tier);
  }
  if (examboard) {
    breadcrumbs.push(examboard);
  }

  const backgroundColor =
    phase === "primary" ? "bg-decorative4-subdued" : "bg-decorative3-subdued";

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <AppLayout
        seoProps={{
          ...getSeoProps({
            title: `${subject}, ${phase}, ${yearDescription} - Unit listing`,
            description: `Unit listing for ${subject}, ${phase}, ${yearDescription}`,
          }),
        }}
      >
        <OakPupilJourneyLayout
          phase={phase}
          sectionName="unit-listing"
          topNavSlot={
            <OakTertiaryButton
              element="a"
              href={backHref}
              iconName="arrow-left"
            >
              {backLabel}
            </OakTertiaryButton>
          }
          titleSlot={
            <OakPupilJourneyHeader
              title={subject}
              iconName={`subject-${subjectSlug}`}
              iconBackground={phase}
              breadcrumbs={breadcrumbs}
            />
          }
        >
          <OakFlex $gap="space-between-xs" $alignItems={"center"}>
            <OakInfo
              hint="Units are groups of lessons that relate to one another."
              tooltipPosition="top-left"
            />

            <OakHeading tag="h2">New lessons ({lessonCount})</OakHeading>
          </OakFlex>
          <OakFlex
            $flexDirection={"column"}
            $pa={"inner-padding-m"}
            $background={backgroundColor}
            $borderRadius={"border-radius-l"}
            $gap={"space-between-s"}
          >
            {orderedCurriculumData.map((unit, i) => {
              return (
                <OakPupilJourneyListItem
                  key={unit.unitSlug}
                  title={unit.unitData?.title}
                  index={i + 1}
                  numberOfLessons={unit.lessonCount}
                  as="a"
                  href={resolveOakHref({
                    page: "pupil-lesson-index",
                    programmeSlug: unit.programmeSlug,
                    unitSlug: unit.unitSlug,
                  })}
                />
              );
            })}
          </OakFlex>
        </OakPupilJourneyLayout>
      </AppLayout>
    </OakThemeProvider>
  );
};

export const getStaticPaths =
  getStaticPathsTemplate<PupilUnitListingPageURLParams>;

export const getStaticProps: GetStaticProps<
  UnitListingPageProps,
  PupilUnitListingPageURLParams
> = async (context) => {
  return getPageProps({
    page: "pupil-lesson-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("no context.params");
      }
      const { programmeSlug } = context.params;
      if (!programmeSlug) {
        throw new Error("unexpected context.params");
      }

      const curriculumData = await curriculumApi2023.pupilUnitListingQuery({
        programmeSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<UnitListingPageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default PupilUnitListingPage;
