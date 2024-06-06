import { GetStaticProps, GetStaticPropsResult } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { PupilViewsUnitListing } from "@/components/PupilViews/PupilUnitListing/PupilUnitListing.view";

type UnitListingPageProps = {
  curriculumData: UnitListingBrowseData;
  programmeSlug: string;
};

type PupilUnitListingPageURLParams = {
  programmeSlug: string;
};

const PupilUnitListingPage = ({
  curriculumData,
  programmeSlug,
}: UnitListingPageProps) => {
  const selectedProgramme = curriculumData.find(
    (unit) => unit.programmeSlug === programmeSlug,
  );

  if (!selectedProgramme) {
    throw new Error("No curriculum data");
  }

  curriculumData.sort((a, b) => {
    const aUnitOrder = a.supplementaryData.unitOrder;
    const bUnitOrder = b.supplementaryData.unitOrder;
    return aUnitOrder - bUnitOrder;
  });

  const { programmeFields } = selectedProgramme;
  const { subject, phase, yearDescription } = programmeFields;

  if (phase === "foundation") {
    throw new Error("Foundation phase not supported");
  }

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
        <PupilViewsUnitListing
          units={curriculumData}
          programmeFields={programmeFields}
          programmeSlug={programmeSlug}
        />
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
      // TODO - Change directory structure to baseSlug
      const { programmeSlug } = context.params;
      if (!programmeSlug) {
        throw new Error("unexpected context.params");
      }

      let curriculumData = await curriculumApi2023.pupilUnitListingQuery({
        // This is gets us the base_slug
        baseSlug: programmeSlug.replace(/(\d+)(.*)$/, "$1"),
      });

      curriculumData = curriculumData.filter(
        (unit) => !unit.unitData.deprecatedFields?.isSensitive,
      );

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<UnitListingPageProps> = {
        props: {
          curriculumData,
          programmeSlug,
        },
      };
      return results;
    },
  });
};

export default PupilUnitListingPage;
