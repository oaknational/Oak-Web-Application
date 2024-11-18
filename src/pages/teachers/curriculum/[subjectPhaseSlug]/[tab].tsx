import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import React, { MutableRefObject } from "react";
import { useRouter } from "next/router";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { isEqual, uniq } from "lodash";

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
  SubjectCategory,
  YearSelection,
} from "@/utils/curriculum/types";
import { getMvRefreshTime } from "@/pages-helpers/curriculum/docx/getMvRefreshTime";
import {
  getUnitFeatures,
  isCycleTwoEnabled,
  UnitFeatures,
} from "@/utils/curriculum/features";
import {
  sortSubjectCategoriesOnFeatures,
  sortYears,
} from "@/utils/curriculum/sorting";
import {
  CurriculumSelectionSlugs,
  getKs4RedirectSlug,
  isValidSubjectPhaseSlug,
  parseSubjectPhaseSlug,
} from "@/utils/curriculum/slugs";

export type CurriculumUnitsYearGroup = {
  units: Unit[];
  childSubjects: Subject[];
  tiers: Tier[];
  subjectCategories: SubjectCategory[];
  ref?: MutableRefObject<HTMLDivElement>;
};

export type Pathway = {
  pathway: string;
  pathway_slug: string;
};

export type CurriculumUnitsYearData<T = Unit> = {
  [key: string]: {
    units: T[];
    childSubjects: Subject[];
    subjectCategories: SubjectCategory[];
    tiers: Tier[];
    pathways: Pathway[];
    labels: string[];
    groupAs: string | null;
    ref?: MutableRefObject<HTMLDivElement>;
  };
};

export type CurriculumUnitsTrackingData = {
  subjectSlug: string;
  subjectTitle: string;
  phaseSlug: string;
  ks4OptionSlug: string | null;
};

export type CurriculumUnitsFormattedData<T = Unit> = {
  yearData: CurriculumUnitsYearData<T>;
  threadOptions: Thread[];
  yearOptions: string[];
  initialYearSelection: YearSelection;
};

type CurriculumDownloadsTierSubjectProps = {
  child_subjects: Subject[];
  tiers: Tier[];
};

export type CurriculumInfoPageProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  subjectPhaseOptions: SubjectPhasePickerData;
  curriculumOverviewTabData: CurriculumOverviewMVData;
  curriculumOverviewSanityData: CurriculumOverviewSanityData;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  mvRefreshTime: number;
  curriculumDownloadsTabData: CurriculumDownloadsTierSubjectProps;
};

const VALID_TABS = ["overview", "units", "downloads"] as const;
export type CurriculumTab = (typeof VALID_TABS)[number];

const CurriculumInfoPage: NextPage<CurriculumInfoPageProps> = ({
  curriculumSelectionSlugs,
  subjectPhaseOptions,
  curriculumOverviewTabData,
  curriculumOverviewSanityData,
  curriculumUnitsFormattedData,
  mvRefreshTime,
  curriculumDownloadsTabData,
}) => {
  const router = useRouter();
  const tab = router.query.tab as CurriculumTab;
  const { tiers, child_subjects } = curriculumDownloadsTabData;
  const { subjectSlug, ks4OptionSlug, phaseSlug } = curriculumSelectionSlugs;
  const curriculumUnitsTrackingData: CurriculumUnitsTrackingData = {
    subjectSlug,
    phaseSlug,
    subjectTitle: curriculumOverviewTabData.subjectTitle,
    ks4OptionSlug: ks4OptionSlug,
  };

  const keyStages = uniq(
    Object.values(curriculumUnitsFormattedData.yearData).flatMap(({ units }) =>
      units.map((unit) => unit.keystage_slug),
    ),
  );

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
          formattedData={curriculumUnitsFormattedData}
          trackingData={curriculumUnitsTrackingData}
        />
      );
      break;
    case "downloads":
      tabContent = (
        <CurriculumDownloadTab
          curriculumInfo={curriculumOverviewTabData}
          mvRefreshTime={mvRefreshTime}
          slugs={curriculumSelectionSlugs}
          tiers={tiers}
          child_subjects={child_subjects}
        />
      );
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
              ks4OptionSlug: ks4OptionSlug,
              keyStages: keyStages,
              tab: tab,
            }),
            description: buildCurriculumMetadata({
              metadataType: "description",
              subjectSlug: subjectSlug,
              ks4OptionSlug: ks4OptionSlug,
              keyStages: keyStages,
              tab: tab,
            }),
          }),
        }}
        $background={"white"}
      >
        <CurriculumHeader
          subjectPhaseOptions={subjectPhaseOptions}
          curriculumSelectionSlugs={curriculumSelectionSlugs}
          keyStages={keyStages}
          color1="mint"
          color2="mint"
        />

        <Box $background={"white"}>{tabContent}</Box>
      </AppLayout>
    </OakThemeProvider>
  );
};

export type URLParams = {
  tab: "units" | "overview";
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
    const year =
      getUnitFeatures(unit)?.programmes_fields_overrides?.year ?? unit.year;
    if (yearOptions.every((yo) => yo !== year)) {
      yearOptions.push(year);
    }
  });
  // Sort year data
  yearOptions.sort(sortYears);

  return yearOptions;
}

export function createInitialYearFilterSelection(
  yearData: CurriculumUnitsYearData,
  features: UnitFeatures | null,
): YearSelection {
  const initialYearSelection = {} as YearSelection;
  Object.keys(yearData).forEach((year) => {
    const filters = yearData[year];
    if (!filters) {
      throw new Error("year filters missing");
    }
    filters.tiers.sort((a, b) => a.tier_slug.localeCompare(b.tier_slug));
    // Sort subject categories
    filters.subjectCategories
      .sort((a, b) => a.title.localeCompare(b.title))
      .sort(sortSubjectCategoriesOnFeatures(features));

    const allSubjectCategoryTag: SubjectCategory = { id: -1, title: "All" };
    // Add an "All" option if there are 2 or more subject categories. Set to -1 id as this shouldn't ever appear in the DB
    if (!features?.subjectcategories?.all_disabled) {
      if (filters.subjectCategories.length >= 2) {
        filters.subjectCategories.unshift(allSubjectCategoryTag);
      }
    }

    const subject =
      filters.childSubjects.find(
        (s) => s.subject_slug === "combined-science",
      ) ?? null;
    const subjectCategory =
      features?.subjectcategories?.all_disabled &&
      filters.subjectCategories.length > 0
        ? filters.subjectCategories[0]
        : allSubjectCategoryTag;
    initialYearSelection[year] = {
      subject,
      subjectCategory,
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

    const year =
      getUnitFeatures(unit)?.programmes_fields_overrides?.year ?? unit.year;

    let currentYearData = yearData[year];
    if (!currentYearData) {
      currentYearData = {
        units: [],
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        pathways: [],
        labels: [],
        groupAs: null,
      };
      yearData[year] = currentYearData;
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

    if (
      unit.pathway &&
      unit.pathway_slug &&
      currentYearData.pathways.every(
        (p) => p.pathway_slug !== unit.pathway_slug,
      )
    ) {
      currentYearData.pathways.push({
        pathway: unit.pathway,
        pathway_slug: unit.pathway_slug,
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

  for (const year of Object.keys(yearData)) {
    const data = yearData[year]!;
    if (data.units.length > 0) {
      const labels = getUnitFeatures(data.units[0]!)?.labels ?? [];
      if (
        data.units.every((unit) =>
          isEqual(getUnitFeatures(unit)?.labels, labels),
        )
      ) {
        data.labels = data.labels.concat(labels);
      }
    }

    if (data.units.length > 0) {
      const groupAs = getUnitFeatures(data.units[0]!)?.group_as;
      if (groupAs) {
        if (
          data.units.every(
            (unit) => getUnitFeatures(unit)?.group_as === groupAs,
          )
        ) {
          data.groupAs = groupAs;
        }
      }
    }
  }

  return yearData;
}

export function createDownloadsData(
  units: Unit[],
): CurriculumDownloadsTierSubjectProps {
  const tiers: Tier[] = [];
  const child_subjects: Subject[] = [];

  units.forEach((unit: Unit) => {
    // Populate list of child subject filter values
    if (
      unit.subject_parent &&
      unit.subject_parent_slug &&
      child_subjects.every((c) => c.subject_slug !== unit.subject_slug)
    ) {
      child_subjects.push({
        subject: unit.subject,
        subject_slug: unit.subject_slug,
      });
    }

    // Populate list of tier filter values
    if (
      unit.tier &&
      unit.tier_slug &&
      tiers.every((t) => t.tier_slug !== unit.tier_slug)
    ) {
      tiers.push({
        tier: unit.tier,
        tier_slug: unit.tier_slug,
      });
    }
  });

  const sortedChildSubjects = child_subjects.sort((a, b) => {
    if (a.subject_slug === "combined-science") {
      return -1;
    }

    if (b.subject_slug === "combined-science") {
      return 1;
    }

    return a.subject_slug.localeCompare(b.subject_slug, undefined, {
      sensitivity: "base",
    });
  });

  const sortedTiers = tiers.sort((a, b) =>
    a.tier_slug.localeCompare(b.tier_slug, undefined, {
      sensitivity: "base",
    }),
  );
  const downloadsData = {
    child_subjects: sortedChildSubjects,
    tiers: sortedTiers,
  };

  return downloadsData;
}

function sanatiseUnits(units: Unit[]): Unit[] {
  return units.filter((unit, index) => {
    // Find all units that have the same slug and year
    const similarUnits = units.filter(
      (u, i) =>
        i !== index && // Exclude the current unit itself
        u.slug === unit.slug &&
        u.year === unit.year &&
        u.subject_slug === unit.subject_slug &&
        u.subject_parent_slug === unit.subject_parent_slug,
    );

    // Check if there is a more specific unit and remove if so
    const isMoreSpecific = similarUnits.some((u) => {
      // Define an array of the optional fields (keys) that we want to check
      // These fields are considered "specific" if they are not null
      const fieldsToCheck: (keyof Unit)[] = [
        "tier_slug",
        "examboard_slug",
        "pathway_slug",
      ];

      return fieldsToCheck.some(
        (field) =>
          unit[field] === null &&
          u[field] !== null &&
          // We want to only consider the unit `u` more specific if all other fields are identical.
          fieldsToCheck.every((f) => f === field || unit[f] === u[f]),
      );
    });
    if (isMoreSpecific) {
      return false;
    }

    // If this is the first occurrence of the unit in the array, keep it
    const firstOccurrenceIndex = units.findIndex(
      (u) =>
        u.slug === unit.slug &&
        u.year === unit.year &&
        u.subject_slug === unit.subject_slug &&
        u.subject_parent_slug === unit.subject_parent_slug &&
        u.tier_slug === unit.tier_slug &&
        u.examboard_slug === unit.examboard_slug &&
        u.pathway_slug === unit.pathway_slug,
    );

    return index === firstOccurrenceIndex;
  });
}

export function formatCurriculumUnitsData(
  data: CurriculumUnitsTabData,
): CurriculumUnitsFormattedData {
  const { units } = data;
  const features = getUnitFeatures(units[0]);
  // Filtering for tiers, ideally this would be fixed in the MV, but for now we need to filter out here.
  const filteredUnits = sanatiseUnits(units);
  const yearData = createUnitsListingByYear(filteredUnits);
  const threadOptions = createThreadOptions(filteredUnits);
  const yearOptions = createYearOptions(filteredUnits);
  const initialYearSelection = createInitialYearFilterSelection(
    yearData,
    features,
  );
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
      const tab = context.params.tab;
      const isPreviewMode = context.preview === true;
      if (!VALID_TABS.includes(tab)) {
        throw new OakError({
          code: "curriculum-api/not-found",
        });
      }
      const slugs = parseSubjectPhaseSlug(context.params.subjectPhaseSlug);
      if (!slugs) {
        throw new OakError({
          code: "curriculum-api/params-incorrect",
        });
      }

      const validSubjectPhases = await curriculumApi.subjectPhaseOptions({
        cycle: isCycleTwoEnabled() ? "2" : "1",
      });

      const isValid = isValidSubjectPhaseSlug(validSubjectPhases, slugs);
      if (!isValid) {
        const redirect = getKs4RedirectSlug(validSubjectPhases, slugs);
        if (redirect) {
          const { subjectSlug, phaseSlug, ks4OptionSlug } = redirect;
          return {
            redirect: {
              destination: `/teachers/curriculum/${subjectSlug}-${phaseSlug}-${ks4OptionSlug}/${tab}`,
              permanent: false,
            },
          };
        } else {
          throw new OakError({
            code: "curriculum-api/not-found",
          });
        }
      }

      const curriculumOverviewTabData = await curriculumApi.curriculumOverview({
        subjectSlug: slugs.subjectSlug,
        phaseSlug: slugs.phaseSlug,
      });
      const curriculumOverviewSanityData =
        await CMSClient.curriculumOverviewPage({
          previewMode: isPreviewMode,
          ...{
            subjectTitle: curriculumOverviewTabData.subjectTitle,
            phaseSlug: slugs.phaseSlug,
          },
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

      const mvRefreshTime = await getMvRefreshTime();
      const curriculumDownloadsTabData = createDownloadsData(
        curriculumUnitsTabData.units,
      );

      const subjectPhaseOptions = await fetchSubjectPhasePickerData();

      const results: GetStaticPropsResult<CurriculumInfoPageProps> = {
        props: {
          curriculumSelectionSlugs: slugs,
          subjectPhaseOptions,
          curriculumOverviewTabData,
          curriculumOverviewSanityData,
          curriculumUnitsFormattedData,
          mvRefreshTime,
          curriculumDownloadsTabData,
        },
      };
      const resultsWithIsr = decorateWithIsr(results);
      return resultsWithIsr;
    },
  });
};

export default CurriculumInfoPage;
