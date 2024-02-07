import React, { FC } from "react";
import { OakGridArea, OakHeading } from "@oaknational/oak-components";

import ProgrammeListContainer from "@/components/TeacherComponents/ProgrammeListContainer";
import SpecialistProgrammeListItem from "@/components/TeacherComponents/SpecialistProgrammeListItem";
import {
  SpecialistProgramme,
  SpecialistProgrammes,
} from "@/node-lib/curriculum-api-2023/queries/specialistProgrammeListing/specialistProgrammeListing.schema";

const SpecialistProgrammeListing: FC<{
  onClick: (props: SpecialistProgramme) => void;
  programmes: SpecialistProgrammes;
}> = ({ ...props }) => {
  const { programmes, onClick } = props;
  const programmeColSpan = programmes.length === 2 ? 6 : 9;
  const colSpan = programmes.length === 2 ? 6 : 4;
  return (
    <ProgrammeListContainer
      $background="aqua"
      $colSpan={[12, 6, programmeColSpan]}
    >
      <OakHeading tag="h2" $font="heading-5" $mb="space-between-m2">
        Developmental stages
      </OakHeading>
      {programmes.map((programme) => {
        return (
          <OakGridArea
            $mb={"space-between-s"}
            $colSpan={[12, 12, colSpan]}
            key={programme.programmeSlug}
          >
            <SpecialistProgrammeListItem
              programme={programme}
              onClick={onClick}
            />
          </OakGridArea>
        );
      })}
    </ProgrammeListContainer>
  );
};

export default SpecialistProgrammeListing;
