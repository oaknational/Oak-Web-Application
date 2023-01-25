import React from "react";
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";

import AppLayout from "../../../../../../../components/AppLayout";
import Flex from "../../../../../../../components/Flex";
import MaxWidth from "../../../../../../../components/MaxWidth/MaxWidth";
import TitleCard from "../../../../../../../components/Card/TitleCard";
import SubjectErrorCard from "../../../../../../../components/Card/SubjectErrorCard";
import { getSeoProps } from "../../../../../../../browser-lib/seo/getSeoProps";
import usePagination from "../../../../../../../components/Pagination/usePagination";
import curriculumApi, {
  TeachersKeyStageSubjectUnitsData,
} from "../../../../../../../node-lib/curriculum-api";
import UnitList from "../../../../../../../components/UnitAndLessonLists/UnitList";

export type SubjectUnitsListPageProps = {
  curriculumData: TeachersKeyStageSubjectUnitsData;
};

const SubjectUnitsListPage: NextPage<SubjectUnitsListPageProps> = ({
  curriculumData,
}) => {
  const { keyStageTitle, keyStageSlug, subjectTitle, units } = curriculumData;

  const paginationProps = usePagination({
    totalResults: curriculumData.units.length,
    pageSize: 20,
    items: units,
  });

  const { currentPageItems } = paginationProps;

  return (
    <AppLayout
      seoProps={getSeoProps({
        title: "Units", // @todo add real data
        description: "Subject units",
      })}
    >
      <MaxWidth $ph={16}>
        {/* not part of mvp page, add later */}
        {/* <Box $mv={[24, 48]}>
          <Breadcrumbs
            breadcrumbs={[
              { href: "/", label: "Home" },
              { href: keyStageSlug, label: keyStageTitle },
              { href: subjectSlug, label: subjectTitle, disabled: true },
            ]}
          />
        </Box> */}
        <Flex $mt={24} $mb={32}>
          <SubjectErrorCard
            buttonProps={{
              label: "Find out why",
              page: null,
              href: "/",
            }}
            headingTag={"h3"}
            heading={"Some subjects unavailable"}
            text={"Unfortunately some subjects are now unavailable."}
          />
        </Flex>
        <TitleCard
          page={"subject"}
          keyStage={keyStageTitle}
          keyStageSlug={keyStageSlug}
          title={subjectTitle}
          iconName={"Rocket"}
          $mb={24}
          $alignSelf={"flex-start"}
        />
        {/* not part of mvp page, add later */}
        {/* <Flex $mb={64} $display={"inline-flex"}>
          <ButtonAsLink
            variant="minimal"
            page={null}
            href={"/"}
            icon={"Download"}
            $iconPosition={"trailing"}
            label="Curriculum download (PDF)"
            iconBackground="teachersHighlight"
          />
        </Flex> */}
        <UnitList
          {...curriculumData}
          currentPageItems={currentPageItems}
          paginationProps={paginationProps}
          headingTag={"h2"}
        />
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  subjectSlug: string;
  keyStageSlug: string;
};

export const getServerSideProps: GetServerSideProps<
  SubjectUnitsListPageProps,
  URLParams
> = async (context) => {
  if (!context.params) {
    throw new Error("No context.params");
  }
  const { subjectSlug, keyStageSlug } = context.params;
  // QUESTION: should we fetch the data for all tiers and handle the
  // filtering client side, so that we can use getStaticProps here?
  // It's a bigger initial download for the user, but changing tier
  // won't require a new network call.
  const { tier } = context.query;
  const tierSlug = Array.isArray(tier) ? tier[0] : tier;
  const curriculumData = await curriculumApi.teachersKeyStageSubjectUnits({
    subjectSlug,
    keyStageSlug,
    tierSlug,
  });

  const results: GetServerSidePropsResult<SubjectUnitsListPageProps> = {
    props: {
      curriculumData,
    },
  };
  return results;
};

export default SubjectUnitsListPage;
