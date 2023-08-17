import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import React from "react";
import { useRouter } from "next/router";

import OverviewTab from "./tabs/overview";
import UnitsTab from "./tabs/units";
import DownloadsTab from "./tabs/downloads";

import AppLayout from "@/components/AppLayout/AppLayout";
import Box from "@/components/Box/Box";
import Flex from "@/components/Flex/Flex";
import { Heading, Hr } from "@/components/Typography";
import SubjectIcon from "@/components/SubjectIcon/SubjectIcon";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import TabularNav from "@/components/TabularNav/TabularNav";
import curriculumApi, {
  CurriculumOverviewTabData,
  CurriculumUnitsTabData,
  CurriculumDownloadsTabData,
  Subject,
  Phase,
} from "@/node-lib/curriculum-api-2023";
import { BETA_SEO_PROPS } from "@/browser-lib/seo/Seo";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SubjectPhasePicker/SubjectPhasePicker";
import { fetchSubjectPhasePickerData } from "@/pages/beta/[viewType]/curriculum/index";
import getPageProps from "@/node-lib/getPageProps";
import { ViewType } from "@/common-lib/urls";

export type CurriculumInfoPageProps = {
  subject: Subject;
  phase: Phase;
  subjectPhaseOptions: SubjectPhasePickerData;
  overviewTabData: CurriculumOverviewTabData;
  downloadsTabData: CurriculumDownloadsTabData;
  unitsTabData: CurriculumUnitsTabData;
};

const VALID_TABS = ["overview", "units", "downloads"] as const;
type TabType = typeof VALID_TABS[number];

const CurriculumInfoPage: NextPage<CurriculumInfoPageProps> = (props) => {
  const router = useRouter();
  const slug = router.query.subjectPhaseSlug as string;
  const tab = router.query.tab as TabType;
  const { subject, phase, overviewTabData, unitsTabData, downloadsTabData } =
    props;
  let content;
  switch (tab) {
    case "overview":
      content = (
        <OverviewTab subject={subject} phase={phase} data={overviewTabData} />
      );
      break;
    case "units":
      content = (
        <UnitsTab subject={subject} phase={phase} data={unitsTabData} />
      );
      break;
    case "downloads":
      content = (
        <DownloadsTab subject={subject} phase={phase} data={downloadsTabData} />
      );
      break;
  }

  return (
    <AppLayout
      seoProps={BETA_SEO_PROPS}
      $background={"white"}
      headerVariant="landing-pages"
    >
      <Flex $background={"aqua"} $justifyContent={"center"} $pv={[20]}>
        <Box $width={"80%"}>
          <Breadcrumbs
            breadcrumbs={[
              {
                oakLinkProps: {
                  page: "home",
                  viewType: "teachers",
                },
                label: "Home",
              },
              {
                oakLinkProps: {
                  page: "home",
                  viewType: "teachers",
                },
                label: "Curriculum resource",
              },
              {
                oakLinkProps: {
                  page: "home",
                  viewType: "teachers",
                },
                label: "Secondary English",
              },
            ]}
          />
          <Hr $color={"white"} />
          <SubjectPhasePicker {...props.subjectPhaseOptions} />
        </Box>
      </Flex>
      <Box $background={"aqua50"}>
        <Flex $justifyContent={"center"} $pv={32}>
          <Box $width={"80%"}>
            <Flex $alignItems={"center"} $justifyContent={"left"}>
              <Box $background={"aqua"} $borderRadius={6} $mr={12}>
                <SubjectIcon
                  subjectSlug="maths"
                  $maxHeight={56}
                  $maxWidth={56}
                  $color="white"
                  $borderColor="white"
                />
              </Box>

              <Heading
                tag={"h1"}
                $font={"heading-light-3"}
                data-testid="curriculum-info"
                $mr={26}
              >
                Secondary Maths
              </Heading>
            </Flex>
          </Box>
        </Flex>
        <TabularNav
          $width={"80%"}
          $ma={"auto"}
          label="Curriculum Selection"
          links={[
            {
              label: "Overview",
              page: "curriculum-overview",
              viewType: "teachers",
              subjectPhaseSlug: slug,
              isCurrent: tab == "overview",
              currentStyles: ["underline"],
            },
            {
              label: "Unit sequence",
              page: "curriculum-units",
              viewType: "teachers",
              subjectPhaseSlug: slug,
              isCurrent: tab == "units",
              currentStyles: ["underline"],
            },
            {
              label: "Downloads",
              page: "curriculum-downloads",
              viewType: "teachers",
              subjectPhaseSlug: slug,
              isCurrent: tab == "downloads",
              currentStyles: ["underline"],
            },
          ]}
        />
      </Box>
      {content}
    </AppLayout>
  );
};

export type URLParams = {
  viewType: ViewType;
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

export const getStaticProps: GetStaticProps<CurriculumInfoPageProps> = async (
  context
) => {
  return getPageProps({
    page: "curriculum-info::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params || !context.params.subjectPhaseSlug) {
        throw new Error("Missing params");
      }
      const tab = context.params.tab as TabType;
      if (!VALID_TABS.includes(tab)) {
        throw new Error(`Invalid tab: ${context.params.tab}`);
      }
      // Parse and use params instead of "maths" and "secondary" when MV is ready
      const overviewTabData = await curriculumApi.curriculumOverview({
        slug: "secondary-maths",
      });
      const unitsTabData = await curriculumApi.curriculumUnits({
        slug: "secondary-maths",
      });
      const downloadsTabData = await curriculumApi.curriculumDownloads({
        slug: "secondary-maths",
      });
      const subjectPhaseData = await fetchSubjectPhasePickerData();
      const results: GetStaticPropsResult<CurriculumInfoPageProps> = {
        props: {
          subject: { title: "Maths", slug: "maths" },
          phase: { title: "Secondary", slug: "secondary" },
          subjectPhaseOptions: subjectPhaseData,
          overviewTabData: overviewTabData,
          unitsTabData: unitsTabData,
          downloadsTabData: downloadsTabData,
        },
      };
      const resultsWithIsr = decorateWithIsr(results);
      return resultsWithIsr;
    },
  });
};

export default CurriculumInfoPage;
