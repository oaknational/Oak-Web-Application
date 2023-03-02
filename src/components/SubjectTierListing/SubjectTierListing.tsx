import React, { FC } from "react";

import TierList from "../TierList";
import TitleCard from "../Card/TitleCard";
import { Heading } from "../Typography";
import { TeachersKeyStageSubjectTiersData } from "../../node-lib/curriculum-api";

type SubjectTierListingProps = {
  curriculumData: TeachersKeyStageSubjectTiersData;
};

const SubjectTierListing: FC<SubjectTierListingProps> = (props) => {
  const { keyStageTitle, keyStageSlug, subjectTitle, subjectSlug, tiers } =
    props.curriculumData;

  return (
    <>
      <TitleCard
        page={"subject"}
        keyStage={keyStageTitle}
        keyStageSlug={keyStageSlug}
        title={subjectTitle}
        iconName={"rocket"}
        $mt={48}
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
    </>
  );
};

export type URLParams = {
  subjectSlug: string;
  keyStageSlug: string;
};

export default SubjectTierListing;
