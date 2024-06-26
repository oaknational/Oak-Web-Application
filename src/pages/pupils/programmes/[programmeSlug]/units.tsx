import { GetStaticProps, GetStaticPropsResult } from "next";
import _ from "lodash";
import {
  OakIconProps,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { PupilViewsUnitListing } from "@/components/PupilViews/PupilUnitListing/PupilUnitListing.view";
import { extractBaseSlug } from "@/pages-helpers/pupil";
import { UseBackHrefProps } from "@/components/PupilViews/PupilUnitListing/useBackHref";
import { getSecondUnitSection } from "@/pages-helpers/pupil/units-page/units-page-helper";

export type UnitsSectionData = {
  title: string | null;
  phase: "primary" | "secondary";
  icon?: OakIconProps["iconName"];
  units: UnitListingBrowseData[number][][];
  counterText: string | null;
  counterLength: number | null;
};

export type UnitListingPageProps = {
  subject: string;
  phase: "primary" | "secondary";
  backHrefSlugs: UseBackHrefProps;
  breadcrumbs: string[];
  yearDescription: string;
  unitSections: UnitsSectionData[];
};

type PupilUnitListingPageURLParams = {
  programmeSlug: string;
};

const PupilUnitListingPage = ({
  subject,
  phase,
  backHrefSlugs,
  breadcrumbs,
  yearDescription,
  unitSections,
}: UnitListingPageProps) => {
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
          unitSections={unitSections}
          phase={phase}
          backHrefSlugs={backHrefSlugs}
          breadcrumbs={breadcrumbs}
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

      const { programmeSlug } = context.params;
      if (!programmeSlug) {
        throw new Error("unexpected context.params");
      }

      const baseSlug = extractBaseSlug(programmeSlug);

      if (!baseSlug) {
        throw new Error(
          `baseSlug cannot be determined from programmeSlug: ${programmeSlug}`,
        );
      }

      let curriculumData = await curriculumApi2023.pupilUnitListingQuery({
        baseSlug,
      });

      curriculumData = curriculumData.filter(
        (unit) => !unit.unitData.deprecatedFields?.isSensitive,
      );

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      curriculumData.sort((a, b) => {
        const aUnitOrder = a.supplementaryData.unitOrder;
        const bUnitOrder = b.supplementaryData.unitOrder;
        return aUnitOrder - bUnitOrder;
      });

      const selectedProgramme = curriculumData.find(
        (unit) => unit.programmeSlug === programmeSlug,
      );
      if (!selectedProgramme) {
        throw new Error("No curriculum data");
      }

      const { programmeFields } = selectedProgramme;
      const {
        subject,
        phase,
        yearDescription,
        subjectSlug,
        tierSlug,
        tierDescription,
        yearSlug,
        examboard,
        examboardSlug,
      } = programmeFields;

      if (phase === "foundation") {
        throw new Error("Foundation phase not supported");
      }

      const unitsByProgramme = _.groupBy(curriculumData, "programmeSlug");

      const mainUnits: UnitListingBrowseData[number][] =
        unitsByProgramme[programmeSlug] || [];

      const optionalityUnits: UnitListingBrowseData[number][][] = Object.values(
        _.groupBy(mainUnits, (unit) => unit?.unitData.title),
      );

      const firstUnitSection: UnitsSectionData = {
        units: optionalityUnits,
        phase,
        icon: `subject-${subjectSlug}`,
        counterText: "Choose a unit",
        counterLength: mainUnits.length,
        title: subject,
      };

      const secondUnitSection: UnitsSectionData = getSecondUnitSection({
        programmeSlug,
        baseSlug,
        tierSlug,
        phase,
        unitsByProgramme,
      });

      const backHrefSlugs: UseBackHrefProps = {
        baseSlug,
        yearSlug,
        tierSlug,
        examboardSlug,
      };

      const breadcrumbs: string[] = [yearDescription];
      if (examboard) {
        breadcrumbs.push(examboard);
      }
      if (tierDescription) {
        breadcrumbs.push(tierDescription);
      }

      const results: GetStaticPropsResult<UnitListingPageProps> = {
        props: {
          subject,
          phase,
          yearDescription,
          backHrefSlugs,
          breadcrumbs,
          unitSections: [firstUnitSection, secondUnitSection],
        },
      };
      return results;
    },
  });
};

export default PupilUnitListingPage;
