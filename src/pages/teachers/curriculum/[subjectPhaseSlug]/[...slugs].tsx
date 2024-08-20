import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import React, { MutableRefObject } from "react";
import { useRouter } from "next/router";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { usePathname } from "next/navigation";

import CMSClient from "@/node-lib/cms";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import CurriculumHeader from "@/components/CurriculumComponents/CurriculumHeader";
import OverviewTab from "@/components/CurriculumComponents/OverviewTab";
import UnitsTab from "@/components/CurriculumComponents/UnitsTab";
import AppLayout from "@/components/SharedComponents/AppLayout";
import Box from "@/components/SharedComponents/Box";
import curriculumApi, {
  CurriculumUnitsTabData,
  CurriculumOverviewMVData,
} from "@/node-lib/curriculum-api-2023";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { fetchSubjectPhasePickerData } from "@/pages/teachers/curriculum/index";
import getPageProps from "@/node-lib/getPageProps";
import OakError from "@/errors/OakError";
import { buildCurriculumMetadata } from "@/components/CurriculumComponents/helpers/curriculumMetadata";
import CurriculumDownloadTab from "@/components/CurriculumComponents/CurriculumDownloadTab";
import {
  Thread,
  Subject,
  Tier,
  Unit,
  Filter,
  SubjectCategory,
} from "@/components/CurriculumComponents/CurriculumVisualiser";
import { YearSelection } from "@/components/CurriculumComponents/UnitsTab/UnitsTab";

export type CurriculumSelectionSlugs = {
  phaseSlug: string;
  subjectSlug: string;
  examboardSlug: string | null;
};

export type CurriculumUnitsYearGroup = {
  units: Unit[];
  childSubjects: Subject[];
  tiers: Tier[];
  subjectCategories: SubjectCategory[];
  ref?: MutableRefObject<HTMLDivElement>;
};

export type CurriculumUnitsYearData = {
  [key: string]: {
    units: Unit[];
    childSubjects: Subject[];
    subjectCategories: SubjectCategory[];
    tiers: Tier[];
    ref?: MutableRefObject<HTMLDivElement>;
  };
};

export type CurriculumUnitsTrackingData = {
  subjectSlug: string;
  subjectTitle: string;
  phaseSlug: string;
  examboardSlug: string | null;
};

export type CurriculumUnitsFormattedData = {
  yearData: CurriculumUnitsYearData;
  threadOptions: Thread[];
  yearOptions: string[];
  initialYearSelection: YearSelection;
};

export type CurriculumInfoPageProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  subjectPhaseOptions: SubjectPhasePickerData;
  curriculumOverviewTabData: CurriculumOverviewMVData;
  curriculumOverviewSanityData: CurriculumOverviewSanityData;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  searchParams?: Filter;
};

const VALID_TABS = ["overview", "units", "downloads"] as const;
export type CurriculumTab = (typeof VALID_TABS)[number];

const CurriculumInfoPage: NextPage<CurriculumInfoPageProps> = ({
  curriculumSelectionSlugs,
  subjectPhaseOptions,
  curriculumOverviewTabData,
  curriculumOverviewSanityData,
  curriculumUnitsFormattedData,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [tab, ...slugs] = router.query.slugs as CurriculumTab;
  const basePath = pathname.replace(slugs.join("/"), "");

  const { subjectSlug, examboardSlug, phaseSlug } = curriculumSelectionSlugs;
  const curriculumUnitsTrackingData: CurriculumUnitsTrackingData = {
    subjectSlug,
    phaseSlug,
    subjectTitle: curriculumOverviewTabData.subjectTitle,
    examboardSlug: examboardSlug,
  };

  let keyStagesData: string;
  switch (phaseSlug) {
    case "primary":
      keyStagesData = `KS1-2`;
      break;
    case "secondary":
      keyStagesData = `KS3-4`;
      break;
    default:
      keyStagesData = "";
      break;
  }

  let tabContent: JSX.Element;
  switch (tab) {
    case "overview":
      tabContent = (
        <OverviewTab
          data={{
            curriculumInfo: curriculumOverviewTabData,
            curriculumCMSInfo: curriculumOverviewSanityData,
            curriculumSelectionSlugs,
          }}
        />
      );

      break;
    case "units":
      tabContent = (
        <UnitsTab
          basePath={basePath}
          selectedUnit={slugs[0]}
          formattedData={curriculumUnitsFormattedData}
          trackingData={curriculumUnitsTrackingData}
        />
      );
      break;
    case "downloads":
      tabContent = <CurriculumDownloadTab />;
      break;
    default:
      throw new Error("Not a valid tab");
  }

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <AppLayout
        seoProps={{
          ...getSeoProps({
            title: buildCurriculumMetadata({
              metadataType: "title",
              subjectSlug: subjectSlug,
              examboardSlug: examboardSlug,
              keyStagesData: keyStagesData,
              tab: tab,
            }),
            description: buildCurriculumMetadata({
              metadataType: "description",
              subjectSlug: subjectSlug,
              examboardSlug: examboardSlug,
              keyStagesData: keyStagesData,
              tab: tab,
            }),
          }),
        }}
        $background={"white"}
      >
        <CurriculumHeader
          subjectPhaseOptions={subjectPhaseOptions}
          curriculumSelectionSlugs={curriculumSelectionSlugs}
          color1="mint"
          color2="mint30"
        />

        <Box $background={"white"}>{tabContent}</Box>
      </AppLayout>
    </OakThemeProvider>
  );
};

export type URLParams = {
  slugs: string[];
  subjectPhaseSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const parseSubjectPhaseSlug = (slug: string) => {
  const parts = slug.split("-");
  const lastSlug = parts.pop() ?? null;
  let phaseSlug: string | null, examboardSlug: string | null;
  // Use phase to determine if examboard is present
  if (lastSlug && ["primary", "secondary"].includes(lastSlug)) {
    examboardSlug = null;
    phaseSlug = lastSlug;
  } else {
    examboardSlug = lastSlug;
    phaseSlug = parts.pop() ?? null;
  }
  const subjectSlug = parts.join("-");
  if (!subjectSlug || !phaseSlug) {
    throw new OakError({
      code: "curriculum-api/params-incorrect",
    });
  }
  return {
    phaseSlug: phaseSlug,
    subjectSlug: subjectSlug,
    examboardSlug: examboardSlug,
  };
};

export function createThreadOptions(units: Unit[]): Thread[] {
  const threadOptions = [] as Thread[];

  units.forEach((unit: Unit) => {
    // Populate threads object

    unit.threads.forEach((thread) => {
      if (threadOptions.every((to) => to.slug !== thread.slug)) {
        threadOptions.push(thread);
      }
    });
  });

  // Sort threads

  const threadOrders = new Set(threadOptions.map((to) => to.order));
  if (threadOptions.length > threadOrders.size) {
    // In secondary science multiple threads can have the same order value due
    // to multiple subjects (eg biology, chemistry, physics) being shown, so
    // if orders are not unique, sort alphabetically by slug

    threadOptions.sort((a, b) => a.slug.localeCompare(b.slug));
  } else {
    // If orders are unique, use them to sort

    threadOptions.sort((a, b) => a.order - b.order);
  }
  return threadOptions;
}

export function createYearOptions(units: Unit[]): string[] {
  const yearOptions = [] as string[];

  units.forEach((unit: Unit) => {
    // Populate years object
    if (yearOptions.every((yo) => yo !== unit.year)) {
      yearOptions.push(unit.year);
    }
  });
  // Sort year data
  yearOptions.sort((a, b) => Number(a) - Number(b));

  return yearOptions;
}

export function createInitialYearFilterSelection(
  yearData: CurriculumUnitsYearData,
): YearSelection {
  const initialYearSelection = {} as YearSelection;
  Object.keys(yearData).forEach((year) => {
    const filters = yearData[year];
    if (!filters) {
      throw new Error("year filters missing");
    }
    filters.tiers.sort((a, b) => a.tier_slug.localeCompare(b.tier_slug));
    // Sort subject categories
    filters.subjectCategories.sort((a, b) => a.title.localeCompare(b.title));

    // Add an "All" option if there are 2 or more subject categories. Set to -1 id as this shouldn't ever appear in the DB
    const allSubjectCategoryTag: SubjectCategory = { id: -1, title: "All" };
    if (filters.subjectCategories.length >= 2) {
      filters.subjectCategories.unshift(allSubjectCategoryTag);
    }

    initialYearSelection[year] = {
      subject:
        filters.childSubjects.find(
          (s) => s.subject_slug === "combined-science",
        ) ?? null,
      subjectCategory: allSubjectCategoryTag,
      tier: filters.tiers.length ? filters.tiers[0] : null,
    };
  });

  return initialYearSelection;
}

export function createUnitsListingByYear(
  units: Unit[],
): CurriculumUnitsYearData {
  const yearData = {} as CurriculumUnitsYearData;
  units.forEach((unit: Unit) => {
    // Check if the yearData object has an entry for the unit's year
    // If not, initialize it with default values

    let currentYearData = yearData[unit.year];
    if (!currentYearData) {
      currentYearData = {
        units: [],
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
      };
      yearData[unit.year] = currentYearData;
    }

    // Add the current unit

    currentYearData.units.push(unit);

    // Populate list of child subject filter values
    if (
      unit.subject_parent &&
      unit.subject_parent_slug &&
      currentYearData.childSubjects.every(
        (c) => c.subject_slug !== unit.subject_slug,
      )
    ) {
      currentYearData.childSubjects.push({
        subject: unit.subject,
        subject_slug: unit.subject_slug,
      });
    }

    // Populate list of tier filter values

    if (
      unit.tier &&
      unit.tier_slug &&
      currentYearData.tiers.every((t) => t.tier_slug !== unit.tier_slug)
    ) {
      currentYearData.tiers.push({
        tier: unit.tier,
        tier_slug: unit.tier_slug,
      });
    }

    // Loop through tags array and populate subject categories.
    unit.subjectcategories?.forEach((subjectCategory) => {
      if (
        currentYearData?.subjectCategories.findIndex(
          (d) => d.id === subjectCategory.id,
        ) === -1
      ) {
        currentYearData.subjectCategories.push({
          id: subjectCategory.id,
          title: subjectCategory.title,
        });
      }
    });
  });
  return yearData;
}

export function formatCurriculumUnitsData(
  data: CurriculumUnitsTabData,
): CurriculumUnitsFormattedData {
  const { units } = data;
  const yearData = createUnitsListingByYear(units);
  const threadOptions = createThreadOptions(units);
  const yearOptions = createYearOptions(units);
  const initialYearSelection = createInitialYearFilterSelection(yearData);
  const formattedDataCurriculumUnits = {
    yearData,
    threadOptions,
    yearOptions,
    initialYearSelection,
  };
  return formattedDataCurriculumUnits;
}

export const getStaticProps: GetStaticProps<
  CurriculumInfoPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "curriculum-info::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("Missing params");
      }
      const [tab] = context.params.slugs;

      if (!(tab && VALID_TABS.includes(tab as (typeof VALID_TABS)[number]))) {
        throw new Error("Invalid tab");
      }

      const isPreviewMode = context.preview === true;
      if (!VALID_TABS.includes(tab as (typeof VALID_TABS)[number])) {
        throw new OakError({
          code: "curriculum-api/not-found",
        });
      }
      const slugs = parseSubjectPhaseSlug(context.params.subjectPhaseSlug);
      const curriculumOverviewTabData = await curriculumApi.curriculumOverview({
        subjectSlug: slugs.subjectSlug,
        phaseSlug: slugs.phaseSlug,
      });

      const curriculumOverviewSanityData =
        await CMSClient.curriculumOverviewPage({
          previewMode: isPreviewMode,
          ...slugs,
        });

      if (!curriculumOverviewSanityData) {
        return {
          notFound: true,
        };
      }
      const curriculumUnitsTabData = await curriculumApi.curriculumUnits(slugs);

      // Sort the units to have examboard versions first - this is so non-examboard units are removed
      // in the visualiser
      curriculumUnitsTabData.units.sort((a) => {
        if (a.examboard) {
          return -1;
        }
        return 1;
      });

      // Sort by unit order
      curriculumUnitsTabData.units.sort((a, b) => a.order - b.order);

      const curriculumUnitsFormattedData = formatCurriculumUnitsData(
        curriculumUnitsTabData,
      );

      const subjectPhaseOptions = await fetchSubjectPhasePickerData();
      const results: GetStaticPropsResult<CurriculumInfoPageProps> = {
        props: {
          curriculumSelectionSlugs: slugs,
          subjectPhaseOptions,
          curriculumOverviewTabData,
          curriculumOverviewSanityData,
          curriculumUnitsFormattedData,
        },
      };
      const resultsWithIsr = decorateWithIsr(results);
      return resultsWithIsr;
    },
  });
};

export default CurriculumInfoPage;
