import React, { FC } from "react";

import TierList from "../TierList";
import TitleCard from "../Card/SubjectUnitLessonTitleCard";
import { Heading } from "../Typography";
import { TierListingData } from "../../node-lib/curriculum-api";

type ProgrammeDetails = {
  keyStageTitle: string;
  keyStageSlug: string;
  subjectTitle: string;
  subjectSlug: string;
};

type SubjectTierListingProps = {
  programmeDetails: ProgrammeDetails;
};

const SubjectTierListing: FC<SubjectTierListingProps & TierListingData> = ({
  programmeDetails,
  programmes,
}) => {
  const { keyStageTitle, keyStageSlug, subjectTitle, subjectSlug } =
    programmeDetails;
  const tierTrackingProps = {
    keyStageTitle,
    subjectTitle,
  };

  return (
    <>
      <TitleCard
        page={"subject"}
        keyStage={keyStageTitle}
        keyStageSlug={keyStageSlug}
        title={subjectTitle}
        slug={subjectSlug}
        $mt={48}
        $mb={64}
        $alignSelf={"flex-start"}
      />
      <Heading tag="h2" $font="heading-5" $mb={30}>
        Learning tiers
      </Heading>
      <TierList
        $mb={92}
        programmes={programmes}
        keyStageSlug={keyStageSlug}
        subjectSlug={subjectSlug}
        {...tierTrackingProps}
      />
    </>
  );
};

export type URLParams = {
  subjectSlug: string;
  keyStageSlug: string;
};

export default SubjectTierListing;
