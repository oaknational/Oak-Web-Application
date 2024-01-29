import React, { FC } from "react";
import { OakGrid } from "@oaknational/oak-components";

import ProgrammeListContainer from "@/components/TeacherComponents/ProgrammeListContainer";
import SubjectProgrammeList from "@/components/TeacherComponents/SubjectProgrammeList";
import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import { Heading } from "@/components/SharedComponents/Typography";

const SubjectProgrammeListing: FC<
  ProgrammeListingPageData & {
    onClick: (props: ProgrammeListingPageData["programmes"][number]) => void;
  }
> = ({ ...props }) => {
  const { programmes, onClick } = props;

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
      <OakGrid $cg={"all-spacing-4"} $rg={"all-spacing-4"}>
        {examBoards.length < 2 && (
          <ProgrammeListContainer $colSpan={[12, 6, tierColSpan]}>
            <Heading tag="h2" $font="heading-5" $mb={30}>
              Select tier of learning
            </Heading>
            <SubjectProgrammeList
              {...props}
              programmes={tierProgrammes}
              onClick={onClick}
            />
          </ProgrammeListContainer>
        )}
        {tiers.length < 2 && (
          <ProgrammeListContainer $colSpan={[12, 6, examBoardColSpan]}>
            <Heading tag="h2" $font="heading-5" $mb={30}>
              Select exam board
            </Heading>
            <SubjectProgrammeList
              {...props}
              programmes={examBoardProgrammes}
              onClick={onClick}
            />
          </ProgrammeListContainer>
        )}
        {tiers.length > 1 && examBoards.length > 1 && (
          <>
            {examBoards.map((examBoard, index) => {
              const programmeOfexamBoard = tierProgrammes.filter(
                (programme) => programme.examBoardTitle == examBoard,
              );
              return (
                <ProgrammeListContainer
                  key={`${examBoard}-${index}`}
                  $colSpan={[12, 4]}
                >
                  <Heading tag="h2" $font="heading-5" $mb={30}>
                    {examBoard}
                  </Heading>
                  <SubjectProgrammeList
                    {...props}
                    programmes={programmeOfexamBoard}
                    onClick={onClick}
                  />
                </ProgrammeListContainer>
              );
            })}
          </>
        )}
      </OakGrid>
    </>
  );
};

export default SubjectProgrammeListing;
