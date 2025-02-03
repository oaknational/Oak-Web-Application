import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import React from "react";
import { useRouter } from "next/router";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { uniq } from "lodash";

import CMSClient from "@/node-lib/cms";
import CurriculumHeader from "@/components/CurriculumComponents/CurriculumHeader";
import OverviewTab from "@/components/CurriculumComponents/OverviewTab";
import UnitsTab from "@/components/CurriculumComponents/UnitsTab";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import getPageProps from "@/node-lib/getPageProps";
import OakError from "@/errors/OakError";
import { buildCurriculumMetadata } from "@/components/CurriculumComponents/helpers/curriculumMetadata";
import CurriculumDownloadTab from "@/components/CurriculumComponents/CurriculumDownloadTab";
import { getMvRefreshTime } from "@/pages-helpers/curriculum/docx/getMvRefreshTime";
import {
  getKs4RedirectSlug,
  isValidSubjectPhaseSlug,
  parseSubjectPhaseSlug,
} from "@/utils/curriculum/slugs";
import { ENABLE_OPEN_API } from "@/utils/curriculum/constants";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  createDownloadsData,
  CurriculumInfoPageProps,
  CurriculumTab,
  CurriculumUnitsTrackingData,
  fetchSubjectPhasePickerData,
  formatCurriculumUnitsData,
  VALID_TABS,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import openApiRequest from "@/utils/curriculum/openapi";

const CurriculumInfoPage: NextPage<CurriculumInfoPageProps> = ({
  curriculumSelectionSlugs,
  curriculumPhaseOptions,
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
          curriculumPhaseOptions={curriculumPhaseOptions}
          curriculumSelectionSlugs={curriculumSelectionSlugs}
          keyStages={keyStages}
          color1="mint"
          color2="mint"
        />

        <OakBox $background={"white"}>{tabContent}</OakBox>
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

      const validSubjectPhases =
        await curriculumApi2023.curriculumPhaseOptions();

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

      const curriculumOverviewTabData =
        await curriculumApi2023.curriculumOverview({
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
      let curriculumUnitsTabData;
      if (ENABLE_OPEN_API) {
        curriculumUnitsTabData = await openApiRequest(
          context.params.subjectPhaseSlug,
          slugs,
        );
      } else {
        curriculumUnitsTabData =
          await curriculumApi2023.curriculumSequence(slugs);
      }

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

      const curriculumPhaseOptions = await fetchSubjectPhasePickerData();

      const results: GetStaticPropsResult<CurriculumInfoPageProps> = {
        props: {
          curriculumSelectionSlugs: slugs,
          curriculumPhaseOptions,
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
