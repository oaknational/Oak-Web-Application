import React, { FC } from "react";

import ProgrammeList from "../ProgrammeList";
import { Heading } from "../Typography";
import { ProgrammeListingPageData } from "../../node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import Grid, { GridArea, GridAreaProps } from "../Grid";

export type LessonItemContainerProps = {
  children?: React.ReactNode;
  numberOfProgrammes?: number;
} & GridAreaProps;

const ProgrammeListContainer: FC<LessonItemContainerProps> = (props) => {
  const { children, numberOfProgrammes, ...gridAreaProps } = props;
  return (
    <GridArea
      $background={"lavender30"}
      $pa={16}
      $borderRadius={4}
      {...gridAreaProps}
    >
      {children}
    </GridArea>
  );
};

const SubjectProgrammeListing: FC<ProgrammeListingPageData> = ({
  ...props
}) => {
  const { programmes } = props;

  const examboards = Array.from(
    new Set(programmes.map((programme) => programme.examBoardTitle))
  ).filter((examboard) => examboard !== null);
  const tiers = Array.from(
    new Set(programmes.map((programme) => programme.tierTitle))
  ).filter((tier) => tier !== null);

  const tierProgrammes = programmes.filter(
    (programme) => programme.tierSlug !== null
  );
  const examBoardProgrammes = programmes.filter(
    (programme) => programme.examBoardSlug !== null
  );

  return (
    <>
      <Grid $cg={16} $rg={16}>
        {examboards.length < 2 && (
          <ProgrammeListContainer $colSpan={[12, 8, 6]}>
            <Heading tag="h2" $font="heading-5" $mb={30}>
              Select tier of learning
            </Heading>
            <ProgrammeList {...props} programmes={tierProgrammes} />
          </ProgrammeListContainer>
        )}
        {tiers.length < 2 && (
          <ProgrammeListContainer $colSpan={[12, 8, 6]}>
            <Heading tag="h2" $font="heading-5" $mb={30}>
              Select exam board
            </Heading>
            <ProgrammeList {...props} programmes={examBoardProgrammes} />
          </ProgrammeListContainer>
        )}
        {tiers.length > 1 && examboards.length > 1 && (
          <>
            {examboards.map((examboard) => {
              const programmeOfExamboard = tierProgrammes.filter(
                (programme) => programme.examBoardTitle == examboard
              );
              return (
                <ProgrammeListContainer $colSpan={[12, 6, 4]}>
                  <Heading tag="h2" $font="heading-5" $mb={30}>
                    {examboard}
                  </Heading>
                  <ProgrammeList {...props} programmes={programmeOfExamboard} />
                </ProgrammeListContainer>
              );
            })}
          </>
        )}
      </Grid>
    </>
  );
};

export type URLParams = {
  subjectSlug: string;
  keyStageSlug: string;
};

export default SubjectProgrammeListing;
