import React from "react";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import { UnitListItemProps } from "../../../../../../../components/UnitList/UnitListItem/UnitListItem";
import { decorateWithIsr } from "../../../../../../../node-lib/isr";
import AppLayout from "../../../../../../../components/AppLayout";
import Flex from "../../../../../../../components/Flex";
import MaxWidth from "../../../../../../../components/MaxWidth/MaxWidth";
import TitleCard from "../../../../../../../components/Card/TitleCard";
import SubjectErrorCard from "../../../../../../../components/Card/SubjectErrorCard";
import UnitList from "../../../../../../../components/UnitList";
import { Tier } from "../../../../../../../components/UnitList/UnitList";
import { mockFetchSubjectUnits } from "../../../../../../../browser-lib/fixtures/subjectUnits";
import { getSeoProps } from "../../../../../../../browser-lib/seo/getSeoProps";
import usePagination from "../../../../../../../components/Pagination/usePagination";
import curriculumApi from "../../../../../../../node-lib/curriculum-api";

export type SubjectUnits = {
  keyStageTitle: string;
  keyStageSlug: string;
  subjectTitle: string;
  subjectSlug: string;
  availableTiers: Tier[];
  units: UnitListItemProps[];
};

export type SubjectUnitsListPageProps = {
  curriculumData: SubjectUnits;
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
        <Flex $mb={24} $display={"inline-flex"}>
          <TitleCard
            page={"subject"}
            keyStage={keyStageTitle}
            keyStageSlug={keyStageSlug}
            title={subjectTitle}
            iconName={"Rocket"}
          />
        </Flex>
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

export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  const keyStageSubjectPairs =
    await curriculumApi.teachersKeyStageSubjectUnitsPaths();
  const paths = keyStageSubjectPairs.map(({ subjectSlug, keyStageSlug }) => ({
    params: {
      subjectSlug,
      keyStageSlug,
    },
  }));

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps: GetStaticProps<
  SubjectUnitsListPageProps,
  URLParams
> = async (context) => {
  if (!context.params) {
    throw new Error("No context.params");
  }
  const { subjectSlug } = context.params;

  const curriculumData = mockFetchSubjectUnits(
    subjectSlug
    // context.params?.keyStageSlug
  );

  if (!curriculumData) {
    return {
      notFound: true,
    };
  }

  const results: GetStaticPropsResult<SubjectUnitsListPageProps> = {
    props: {
      curriculumData,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default SubjectUnitsListPage;
