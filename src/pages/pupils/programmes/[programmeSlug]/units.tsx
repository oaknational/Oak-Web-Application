import { GetStaticProps, GetStaticPropsResult } from "next";
import { groupBy, uniq } from "lodash";
import {
  OakIconProps,
  OakThemeProvider,
  isValidIconName,
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
import OakError from "@/errors/OakError";

export type UnitsSectionData = {
  title: string | null;
  phase: "primary" | "secondary";
  icon?: OakIconProps["iconName"];
  units: UnitListingBrowseData[number][][];
  breadcrumbs: string[];
  labels?: { year: string; subject: string; tier?: string };
  counterText: string | null;
  counterLength: number | null;
};

export type UnitListingPageProps = {
  subject: string;
  phase: "primary" | "secondary";
  backHrefSlugs: UseBackHrefProps;
  yearDescription: string;
  unitSections: UnitsSectionData[];
  subjectCategories: string[];
  programmeFields: UnitListingBrowseData[number]["programmeFields"];
};

type PupilUnitListingPageURLParams = {
  programmeSlug: string;
};

const PupilUnitListingPage = ({
  subject,
  phase,
  backHrefSlugs,
  yearDescription,
  unitSections,
  subjectCategories,
  programmeFields,
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
          subjectCategories={subjectCategories}
          programmeFields={programmeFields}
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
        throw new OakError({ code: "curriculum-api/params-incorrect" });
      }

      const { programmeSlug } = context.params;
      if (!programmeSlug) {
        throw new OakError({ code: "curriculum-api/params-incorrect" });
      }

      const baseSlug = extractBaseSlug(programmeSlug);
      if (!baseSlug) {
        throw new OakError({ code: "curriculum-api/params-incorrect" });
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

      let selectedProgramme = curriculumData.find(
        (unit) => unit.programmeSlug === programmeSlug,
      );

      if (!selectedProgramme) {
        if (programmeSlug.substring(-2) !== "-l") {
          selectedProgramme = curriculumData.find(
            (unit) => unit.programmeSlug === `${programmeSlug}-l`,
          );

          return {
            redirect: {
              destination: `/pupils/programmes/${programmeSlug}-l/units`,
              permanent: false,
            },
          };
        } else {
          throw new OakError({ code: "curriculum-api/not-found" });
        }
      }

      const { programmeFields, isLegacy } = selectedProgramme;
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
        pathway,
        pathwaySlug,
      } = programmeFields;

      if (phase === "foundation") {
        throw new Error("Foundation phase not supported");
      }

      const unitsByProgramme = groupBy(curriculumData, "programmeSlug");

      // a unique list of subject categories that appear in the unit listing

      const allSubjectCategories = curriculumData
        .map((unit) => unit.unitData.subjectcategories?.map((s) => String(s)))
        .flat()
        .filter((s) => s?.toLocaleLowerCase() !== subjectSlug)
        .filter((s) => s !== undefined) // we do this seperately because TS doesn't recognise the filter below
        .filter((s) => !!s);

      // ts will not accept that the above removes the possibility of undefined
      const subjectCategories = uniq(allSubjectCategories) as string[];

      const mainUnits: UnitListingBrowseData[number][] =
        unitsByProgramme[programmeSlug] || [];

      const optionalityUnits: UnitListingBrowseData[number][][] = Object.values(
        groupBy(mainUnits, (unit) =>
          unit.programmeFields.optionality
            ? unit.unitSlug.replace(/-\d+?$/, "")
            : unit.unitSlug,
        ),
      );

      const breadcrumbs: string[] = [yearDescription];

      if (pathway) {
        breadcrumbs.push(pathway);
      }
      if (examboard) {
        breadcrumbs.push(examboard);
      }
      if (tierDescription) {
        breadcrumbs.push(tierDescription);
      }

      const secondUnitSection: UnitsSectionData = getSecondUnitSection({
        programmeSlug,
        baseSlug,
        tierSlug,
        subjectSlug,
        yearSlug,
        phase,
        unitsByProgramme,
        breadcrumbs,
      });

      const secondSectionLength = secondUnitSection.units.length;

      const iconSlug = `subject-${subjectSlug}`;

      const firstUnitSection: UnitsSectionData = {
        units: optionalityUnits,
        phase,
        icon: isValidIconName(iconSlug) ? iconSlug : undefined,
        breadcrumbs,
        counterText:
          secondSectionLength > 0 && isLegacy
            ? "Choose a previously released unit"
            : "Choose a unit",
        counterLength: mainUnits.length,
        title: subject,
      };

      const backHrefSlugs: UseBackHrefProps = {
        baseSlug,
        yearSlug,
        pathwaySlug,
        tierSlug,
        examboardSlug,
      };

      const results: GetStaticPropsResult<UnitListingPageProps> = {
        props: {
          subject,
          phase,
          yearDescription,
          backHrefSlugs,
          subjectCategories,
          unitSections: [firstUnitSection, secondUnitSection],
          programmeFields,
        },
      };

      return results;
    },
  });
};

export default PupilUnitListingPage;
