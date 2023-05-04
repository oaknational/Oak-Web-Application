import React from "react";
import { GetServerSideProps, NextPage } from "next";

import curriculumApi, {
  TierListingData,
} from "../../../../../../../node-lib/curriculum-api";
import { getSeoProps } from "../../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../../components/AppLayout/AppLayout";
import MaxWidth from "../../../../../../../components/MaxWidth/MaxWidth";
import Breadcrumbs from "../../../../../../../components/Breadcrumbs/Breadcrumbs";
import Box from "../../../../../../../components/Box";
import SubjectTierListing from "../../../../../../../components/SubjectTierListing/SubjectTierListing";
import useTrackPageView from "../../../../../../../hooks/useTrackPageView";

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

  // Manually input in Avo.ts, confirm the avo process to ensure this is correct
  useTrackPageView({ pageName: "Programme Listing" });

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
                oakLinkProps: { page: "subject-index", slug: keyStageSlug },
                label: keyStageTitle,
              },
              {
                oakLinkProps: {
                  page: "programme-index",
                  subject: subjectSlug,
                  keyStage: keyStageSlug,
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
};

export const getServerSideProps: GetServerSideProps<
  ProgrammeListingPageProps,
  URLParams
> = async (context) => {
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
};

export default ProgrammesListingPage;
