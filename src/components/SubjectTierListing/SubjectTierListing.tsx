import React, { FC } from "react";

import TierList from "../TierList";
import TitleCard from "../Card/SubjectUnitLessonTitleCard";
import { Heading } from "../Typography";
import { ProgrammeListingPageData } from "../../node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

const SubjectTierListing: FC<ProgrammeListingPageData> = ({ ...props }) => {
  const { programmes, keyStageSlug, subjectSlug, keyStageTitle = "" } = props;
  const subjectTitle = programmes[0]?.subjectTitle ?? "";

  return (
    <>
      <TitleCard
        page={"subject"}
        keyStage={keyStageTitle ?? ""}
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
        programmes={programmes}
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
