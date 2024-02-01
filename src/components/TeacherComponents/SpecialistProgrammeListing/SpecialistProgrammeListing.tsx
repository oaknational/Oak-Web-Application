import React, { FC } from "react";
import { OakGridArea } from "@oaknational/oak-components";

import ProgrammeListContainer from "@/components/TeacherComponents/ProgrammeListContainer";
import SpecialistProgrammeListItem from "@/components/TeacherComponents/SpecialistProgrammeListItem";
import { Heading } from "@/components/SharedComponents/Typography";
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
      <Heading tag="h2" $font="heading-5" $mb={30}>
        Developmental stages
      </Heading>
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
