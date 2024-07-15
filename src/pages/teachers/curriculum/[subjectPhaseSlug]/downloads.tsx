import { GetServerSideProps, NextPage } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { fetchSubjectPhasePickerData } from "..";

import { CurriculumSelectionSlugs, parseSubjectPhaseSlug } from "./[tab]";

import getPageProps from "@/node-lib/getPageProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { buildCurriculumMetadata } from "@/components/CurriculumComponents/helpers/curriculumMetadata";
import CurriculumHeader from "@/components/CurriculumComponents/CurriculumHeader";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import Box from "@/components/SharedComponents/Box";
import CurriculumDownloadTab from "@/components/CurriculumComponents/CurriculumDownloadTab";
import { getMvRefreshTime } from "@/pages-helpers/curriculum/docx/getMvRefreshTime";

export type URLParams = {
  tab: "units" | "overview";
  subjectPhaseSlug: string;
};

export type DownloadsPageProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  subjectPhaseOptions: SubjectPhasePickerData;
  cache: number;
};

const DowloadCurriculumPage: NextPage<DownloadsPageProps> = ({
  curriculumSelectionSlugs,
  subjectPhaseOptions,
  cache,
}) => {
  const { subjectSlug, examboardSlug, phaseSlug } = curriculumSelectionSlugs;

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
              tab: "downloads",
            }),
            description: buildCurriculumMetadata({
              metadataType: "description",
              subjectSlug: subjectSlug,
              examboardSlug: examboardSlug,
              keyStagesData: keyStagesData,
              tab: "downloads",
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

        <Box $background={"white"}>
          <CurriculumDownloadTab
            curriculumSelectionSlugs={curriculumSelectionSlugs}
            cache={cache}
          />
        </Box>
      </AppLayout>
    </OakThemeProvider>
  );
};

export const getServerSideProps: GetServerSideProps<
  DownloadsPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "curriculum-download-page::getServerSideProps",
    context,
    withIsr: false,
    getProps: async () => {
      if (!context.params) {
        throw new Error("Missing params");
      }
      const slugs = parseSubjectPhaseSlug(context.params.subjectPhaseSlug);

      const subjectPhaseOptions = await fetchSubjectPhasePickerData();

      const cache = await getMvRefreshTime();

      return {
        props: {
          curriculumSelectionSlugs: slugs,
          cache,
          subjectPhaseOptions,
        },
      };
    },
  });
};

export default DowloadCurriculumPage;
