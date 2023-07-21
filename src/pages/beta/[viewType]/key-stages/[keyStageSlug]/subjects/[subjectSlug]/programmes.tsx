import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";

import curriculumApi from "../../../../../../../node-lib/curriculum-api";
import { getSeoProps } from "../../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../../components/AppLayout/AppLayout";
import MaxWidth from "../../../../../../../components/MaxWidth/MaxWidth";
import Breadcrumbs from "../../../../../../../components/Breadcrumbs/Breadcrumbs";
import Box from "../../../../../../../components/Box";
import SubjectTierListing from "../../../../../../../components/SubjectProgrammeListing/SubjectProgrammeListing";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../../../../../../node-lib/isr";
import { VIEW_TYPES, ViewType } from "../../../../../../../common-lib/urls";
import getPageProps from "../../../../../../../node-lib/getPageProps";
import curriculumApi2023 from "../../../../../../../node-lib/curriculum-api-2023";
import { ProgrammeListingPageData } from "../../../../../../../node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

const ProgrammesListingPage: NextPage<ProgrammeListingPageData> = (props) => {
  const { programmes, keyStageSlug, subjectSlug, keyStageTitle, subjectTitle } =
    props;

  if (!programmes[0]) {
    throw new Error("No programmes");
  }

  const tiersSEO = {
    ...getSeoProps({
      title: `${keyStageTitle} ${subjectTitle} tiers`,
      description: `We have resources for tiers: ${programmes
        .filter((programme) => programme.tierTitle)
        .map((programme) => programme.tierTitle)
        .join(", ")}`,
    }),
    ...{ noFollow: true, noIndex: true },
  };
  return (
    <AppLayout seoProps={tiersSEO}>
      <MaxWidth $ph={16}>
        <Box $mv={[24, 48]}>
          <Breadcrumbs
            breadcrumbs={[
              {
                oakLinkProps: { page: "home", viewType: "teachers" },
                label: "Home",
              },
              {
                oakLinkProps: {
                  page: "subject-index",
                  viewType: "teachers",
                  keyStageSlug,
                },
                label: keyStageTitle ?? "",
              },
              {
                oakLinkProps: {
                  page: "programme-index",
                  viewType: "teachers",
                  subjectSlug,
                  keyStageSlug,
                },
                label: subjectTitle,
              },
            ]}
          />
        </Box>
        <SubjectTierListing {...props} />
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  keyStageSlug: string;
  subjectSlug: string;
  viewType: ViewType;
};

console.log("====================================");
console.log("====================================");
console.log("====================================");
console.log("====================================");
console.log("====================================");
console.log("====================================");
console.log("====================================");
console.log(shouldSkipInitialBuild);
console.log("====================================");
console.log("====================================");
console.log("====================================");
console.log("====================================");
console.log("====================================");
console.log("====================================");
console.log("====================================");

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const { programmes } = await curriculumApi.programmeListingPaths();
  const paths = VIEW_TYPES.flatMap((viewType) =>
    programmes.map((programme) => ({
      params: { viewType, ...programme },
    }))
  );

  const config: GetStaticPathsResult<URLParams> = {
    fallback: false,
    paths,
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  ProgrammeListingPageData,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "teachers-programme-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context params");
      }

      const curriculumData =
        context?.params?.viewType === "teachers-2023"
          ? await curriculumApi2023.programmeListingPage({
              keyStageSlug: context.params?.keyStageSlug,
              subjectSlug: context.params?.subjectSlug,
            })
          : await curriculumApi.tierListing({
              keyStageSlug: context.params?.keyStageSlug,
              subjectSlug: context.params?.subjectSlug,
            });

      const results = {
        props: {
          ...curriculumData,
        },
      };

      return results;
    },
  });
};

export default ProgrammesListingPage;
