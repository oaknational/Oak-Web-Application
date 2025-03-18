import React, { FC } from "react";
import { OakFlex, OakHeading } from "@oaknational/oak-components";

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

  return (
    <ProgrammeListContainer
      $background="aqua"
      $colSpan={[12, 6, programmeColSpan]}
    >
      <OakHeading tag="h2" $font="heading-5" $mb="space-between-m2">
        Developmental stages
      </OakHeading>
      <OakFlex
        $justifyContent="flex-start"
        $flexDirection={["column", "row", "row"]}
        $gap={"all-spacing-3"}
      >
        {programmes.map((programme, index) => {
          return (
            <SpecialistProgrammeListItem
              key={index}
              programme={programme}
              onClick={onClick}
            />
          );
        })}
      </OakFlex>
    </ProgrammeListContainer>
  );
};

export default SpecialistProgrammeListing;
