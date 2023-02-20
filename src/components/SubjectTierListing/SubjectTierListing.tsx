import React, { FC } from "react";

import TierList from "../TierList";
import AppLayout from "../AppLayout";
import TitleCard from "../Card/TitleCard";
import { Heading } from "../Typography";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import MaxWidth from "../MaxWidth/MaxWidth";
import { TeachersKeyStageSubjectTiersData } from "../../node-lib/curriculum-api";
// import { decorateWithIsr } from "../../../../../../node-lib/isr";

type SubjectTierListingProps = {
  curriculumData: TeachersKeyStageSubjectTiersData;
};

const SubjectTierListing: FC<SubjectTierListingProps> = (props) => {
  const { keyStageTitle, keyStageSlug, subjectTitle, subjectSlug, tiers } =
    props.curriculumData;

  return (
    <AppLayout
      seoProps={getSeoProps({
        title: `${keyStageTitle} ${subjectTitle} tiers`, // @todo add real data
        description: `We have resources for tiers: ${tiers
          .map((tier) => tier.title)
          .join(", ")}`,
      })}
    >
      <MaxWidth $ph={16}>
        <TitleCard
          page={"subject"}
          keyStage={keyStageTitle}
          keyStageSlug={keyStageSlug}
          title={subjectTitle}
          iconName={"Rocket"}
          $mb={64}
          $alignSelf={"flex-start"}
        />
        <Heading tag="h2" $font="heading-5" $mb={30}>
          Learning tiers
        </Heading>
        <TierList
          $mb={92}
          tiers={tiers}
          keyStageSlug={keyStageSlug}
          subjectSlug={subjectSlug}
        />
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  subjectSlug: string;
  keyStageSlug: string;
};

export default SubjectTierListing;
