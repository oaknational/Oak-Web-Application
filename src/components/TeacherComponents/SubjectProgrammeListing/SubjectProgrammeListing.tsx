import React, { FC } from "react";

import SubjectProgrammeListContainer from "../SubjectProgrammeListContainer";
import { SubjectProgrammeListProps } from "../SubjectProgrammeList/SubjectProgrammeList";

import SubjectProgrammeList from "@/components/TeacherComponents/SubjectProgrammeList";
import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import Grid, { GridAreaProps } from "@/components/SharedComponents/Grid";
import { Heading } from "@/components/SharedComponents/Typography";
import { SpecialistProgramme } from "@/node-lib/curriculum-api-2023/queries/specialistProgrammeListing/specialistProgrammeListing.schema";

export type LessonItemContainerProps = {
  children?: React.ReactNode;
  numberOfProgrammes?: number;
} & GridAreaProps;

const SubjectProgrammeListing: FC<
  ProgrammeListingPageData & {
    onClick: (
      props:
        | SubjectProgrammeListProps["programmes"][number]
        | SpecialistProgramme,
    ) => void;
  }
> = ({ ...props }) => {
  const { programmes } = props;

  const examBoards = Array.from(
    new Set(programmes.map((programme) => programme.examBoardTitle)),
  ).filter((examBoard) => examBoard !== null);
  const tiers = Array.from(
    new Set(programmes.map((programme) => programme.tierTitle)),
  ).filter((tier) => tier !== null);

  const tierProgrammes = programmes.filter(
    (programme) => programme.tierSlug !== null,
  );
  const examBoardProgrammes = programmes.filter(
    (programme) => programme.examBoardSlug !== null,
  );

  const tierColSpan = tierProgrammes.length === 2 ? 6 : 9;
  const examBoardColSpan = examBoardProgrammes.length === 2 ? 6 : 9;

  return (
    <>
      <Grid $cg={16} $rg={16}>
        {examBoards.length < 2 && (
          <SubjectProgrammeListContainer $colSpan={[12, 6, tierColSpan]}>
            <Heading tag="h2" $font="heading-5" $mb={30}>
              Select tier of learning
            </Heading>
            <SubjectProgrammeList {...props} programmes={tierProgrammes} />
          </SubjectProgrammeListContainer>
        )}
        {tiers.length < 2 && (
          <SubjectProgrammeListContainer $colSpan={[12, 6, examBoardColSpan]}>
            <Heading tag="h2" $font="heading-5" $mb={30}>
              Select exam board
            </Heading>
            <SubjectProgrammeList {...props} programmes={examBoardProgrammes} />
          </SubjectProgrammeListContainer>
        )}
        {tiers.length > 1 && examBoards.length > 1 && (
          <>
            {examBoards.map((examBoard, index) => {
              const programmeOfexamBoard = tierProgrammes.filter(
                (programme) => programme.examBoardTitle == examBoard,
              );
              return (
                <SubjectProgrammeListContainer
                  key={`${examBoard}-${index}`}
                  $colSpan={[12, 4]}
                >
                  <Heading tag="h2" $font="heading-5" $mb={30}>
                    {examBoard}
                  </Heading>
                  <SubjectProgrammeList
                    {...props}
                    programmes={programmeOfexamBoard}
                  />
                </SubjectProgrammeListContainer>
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
