import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { UnitsSectionData } from "./pupils/programmes/[programmeSlug]/units";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { PupilViewsUnitListing } from "@/components/PupilViews/PupilUnitListing/PupilUnitListing.view";
import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";


const unitSections: UnitsSectionData[] = [
  {
    title: "Units",
    phase: "secondary",
    icon: "subject-maths",
    units: [
      [
        unitBrowseDataFixture({
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "Unit title 1",
          },
          lessonCount: 26,
        }),
      ],
      [
        unitBrowseDataFixture({
          unitData: {
            ...unitBrowseDataFixture({}).unitData,
            title: "Unit title 2",
          },
          programmeFields: {
            ...unitBrowseDataFixture({}).programmeFields,
            optionality: "optional title 2",
          },
          lessonCount: 52,
        }),
      ],
    ],
    counterText: "Units",
    counterLength: 2,
    breadcrumbs: ["Maths", "Year 10", "asdasd"],
  },
];

const backHrefSlugs = {
  baseSlug: "maths-secondary-year-10",
  yearSlug: "year-10",
  tierSlug: "foundation",
  examboardSlug: null,
};

export default function Testing() {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <AppLayout
        seoProps={{
          ...getSeoProps({
            title: ``,
            description: ``,
          }),
        }}
      >
        <PupilViewsUnitListing
          unitSections={unitSections}
          phase="secondary"
          backHrefSlugs={backHrefSlugs}
        />
      </AppLayout>
    </OakThemeProvider>
  );
}
