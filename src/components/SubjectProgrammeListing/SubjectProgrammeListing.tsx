import React, { FC } from "react";

import ProgrammeList from "../ProgrammeList";
import { Heading } from "../Typography";
import { ProgrammeListingPageData } from "../../node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

const SubjectProgrammeListing: FC<ProgrammeListingPageData> = ({
  ...props
}) => {
  const { programmes } = props;

  const tierProgrammes = programmes.filter(
    (programme) => programme.tierSlug !== null
  );
  const examBoardProgrammes = programmes.filter(
    (programme) => programme.examBoardSlug !== null
  );
  const examBoardTiers = examBoardProgrammes.map(
    (programme) => programme.tierTitle
  );

  return (
    <>
      {tierProgrammes.length > 0 && (
        <>
          <Heading tag="h2" $font="heading-5" $mb={30}>
            Learning tiers
          </Heading>
          <ProgrammeList {...props} programmes={tierProgrammes} />
        </>
      )}
      {examBoardProgrammes.length > 0 && (
        <>
          <Heading tag="h2" $font="heading-5" $mb={30}>
            Exam boards
          </Heading>
          {examBoardTiers.length > 0 &&
            examBoardTiers.map((tier) => <p key={tier}>{tier}</p>)}
          <ProgrammeList {...props} programmes={examBoardProgrammes} />
        </>
      )}
    </>
  );
};

export type URLParams = {
  subjectSlug: string;
  keyStageSlug: string;
};

export default SubjectProgrammeListing;
