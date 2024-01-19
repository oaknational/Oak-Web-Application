import React, { FC } from "react";

import ProgrammeListContainer from "../ProgrammeListContainer";

import ProgrammeList from "@/components/TeacherComponents/ProgrammeList";
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

  return (
    <ProgrammeListContainer
      $background="aqua"
      $colSpan={[12, 6, programmeColSpan]}
    >
      <Heading tag="h2" $font="heading-5" $mb={30}>
        Developmental stages
      </Heading>
      <ProgrammeList
        {...props}
        programmes={programmes}
        onClickSpecialist={onClick}
      />
    </ProgrammeListContainer>
  );
};

export type URLParams = {
  subjectSlug: string;
  keyStageSlug: string;
};

export default SpecialistProgrammeListing;
