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
import Breadcrumbs from "../../../../../../../components/Breadcrumbs";
import Box from "../../../../../../../components/Box";
import UnitList from "../../../../../../../components/UnitList";
import { Tier } from "../../../../../../../components/UnitList/UnitList";
import {
  mockFetchSubjectUnits,
  subjectUnits,
} from "../../../../../../../browser-lib/fixtures/subjectUnits";
import { getSeoProps } from "../../../../../../../browser-lib/seo/getSeoProps";

export type SubjectUnits = {
  keyStageTitle: string;
  keyStageSlug: string;
  subjectTitle: string;
  subjectSlug: string;
  availableTiers: Tier[];
  units: UnitListItemProps[];
};

export type SubjectUnitsListPageProps = {
  pageData: SubjectUnits;
};

const SubjectUnitsListPage: NextPage<SubjectUnitsListPageProps> = ({
  pageData,
}) => {
  const { keyStageTitle, keyStageSlug, subjectTitle, subjectSlug } = pageData;
  return (
    <AppLayout
      seoProps={getSeoProps({
        title: "Units", // @todo add real data
        description: "Subject units",
      })}
    >
      <MaxWidth $ph={16}>
        <Box $mv={[24, 48]}>
          <Breadcrumbs
            breadcrumbs={[
              { href: "/", label: "Home" },
              { href: keyStageSlug, label: keyStageTitle },
              { href: subjectSlug, label: subjectTitle, disabled: true },
            ]}
          />
        </Box>
        <Flex $mb={32}>
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
          {...pageData}
          paginationProps={{
            currentPage: 0,
            totalPages: 0,
            prevPageUrlObject: undefined,
            nextPageUrlObject: undefined,
          }}
          headingTag={"h2"}
        />
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  subjectUnitsSlug: string;
  //   keyStageSlug: string;
};

export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  const paths = subjectUnits.map((unit) => ({
    params: {
      subjectUnitsSlug: unit.subjectSlug,
      keyStageSlug: unit.keyStageSlug,
    },
  }));

  console.log(paths);

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps: GetStaticProps<
  SubjectUnitsListPageProps,
  URLParams
> = async (context) => {
  const unitsData = mockFetchSubjectUnits(
    context.params?.subjectUnitsSlug
    // context.params?.keyStageSlug
  );

  if (!unitsData) {
    return {
      notFound: true,
    };
  }

  const results: GetStaticPropsResult<SubjectUnitsListPageProps> = {
    props: {
      pageData: unitsData,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default SubjectUnitsListPage;
