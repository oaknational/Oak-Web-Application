import React, { FC } from "react";
import { OakGrid, OakHeading } from "@oaknational/oak-components";

import ProgrammeListContainer from "@/components/TeacherComponents/ProgrammeListContainer";
import SubjectProgrammeList from "@/components/TeacherComponents/SubjectProgrammeList";
import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

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

  const tierProgrammes = programmes
    .filter((programme) => programme.tierSlug !== null)
    .sort((a, b) => {
      if (a.tierTitle === null) return 1;
      if (b.tierTitle === null) return -1;
      return a.tierTitle.localeCompare(b.tierTitle);
    });

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
            <OakHeading tag="h2" $font="heading-5" $mb="space-between-m2">
              Select tier of learning
            </OakHeading>
            <SubjectProgrammeList
              {...props}
              programmes={tierProgrammes}
              onClick={onClick}
            />
          </ProgrammeListContainer>
        )}
        {tiers.length < 2 && (
          <ProgrammeListContainer $colSpan={[12, 6, examBoardColSpan]}>
            <OakHeading tag="h2" $font="heading-5" $mb="space-between-m2">
              Select exam board
            </OakHeading>
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
                  <OakHeading tag="h2" $font="heading-5" $mb="space-between-m2">
                    {examBoard}
                  </OakHeading>
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
