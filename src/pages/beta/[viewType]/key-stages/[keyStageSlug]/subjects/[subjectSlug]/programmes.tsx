import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";

import curriculumApi, {
  TierListingData,
} from "../../../../../../../node-lib/curriculum-api";
import { getSeoProps } from "../../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../../components/AppLayout/AppLayout";
import MaxWidth from "../../../../../../../components/MaxWidth/MaxWidth";
import Breadcrumbs from "../../../../../../../components/Breadcrumbs/Breadcrumbs";
import Box from "../../../../../../../components/Box";
import SubjectTierListing from "../../../../../../../components/SubjectTierListing/SubjectTierListing";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../../../../../../node-lib/isr";
import { VIEW_TYPES, ViewType } from "../../../../../../../common-lib/urls";
import getPageProps from "../../../../../../../node-lib/getPageProps";

export type ProgrammeListingPageProps = TierListingData;

const ProgrammesListingPage: NextPage<ProgrammeListingPageProps> = (props) => {
  const { programmes } = props;
  if (!programmes[0]) {
    throw new Error("No programmes");
  }

  const keyStageSlug = programmes[0]?.keyStageSlug;
  const keyStageTitle = programmes[0]?.keyStageTitle;
  const subjectSlug = programmes[0]?.subjectSlug;
  const subjectTitle = programmes[0]?.subjectTitle;

  const programmeDetails = {
    keyStageSlug,
    keyStageTitle,
    subjectSlug,
    subjectTitle,
  };

  const tiersSEO = {
    ...getSeoProps({
      title: `${keyStageTitle} ${subjectTitle} tiers`,
      description: `We have resources for tiers: ${programmes
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
                label: keyStageTitle,
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
        <SubjectTierListing
          programmes={programmes}
          programmeDetails={programmeDetails}
        />
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  keyStageSlug: string;
  subjectSlug: string;
  viewType: ViewType;
};

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
  ProgrammeListingPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "teachers-programme-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context params");
      }
      const curriculumData = await curriculumApi.tierListing({
        keyStageSlug: context.params?.keyStageSlug,
        subjectSlug: context.params?.subjectSlug,
      });

      const results = {
        props: {
          programmes: curriculumData.programmes,
        },
      };

      return results;
    },
  });
};

export default ProgrammesListingPage;
