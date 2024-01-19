import { FC } from "react";

import SpecialistProgrammeListItem from "../SpecialistProgrammeListItem";

import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import SubjectProgrammeListItem from "@/components/TeacherComponents/SubjectProgrammeListItem/SubjectProgrammeListItem";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
import {
  SpecialistProgramme,
  SpecialistProgrammes,
} from "@/node-lib/curriculum-api-2023/queries/specialistProgrammeListing/specialistProgrammeListing.schema";

/**
 * Clickable programme card list.
 *
 * ## Usage
 * Used on subject and specialist programmes pages
 */
export type ProgrammeListProps =
  | {
      programmes: ProgrammeListingPageData["programmes"];
      onClickSubject: (
        props: ProgrammeListingPageData["programmes"][number],
      ) => void;
    }
  | {
      programmes: SpecialistProgrammes;
      onClickSpecialist: (props: SpecialistProgramme) => void;
    };

const ProgrammeList: FC<ProgrammeListProps> = ({ programmes }, props) => {
  const colSpan = programmes.length === 2 ? 6 : 4;

  return (
    <Grid $cg={16}>
      {programmes.map((programme) => {
        return (
          <GridArea
            $mb={16}
            $colSpan={[12, 12, colSpan]}
            key={programme.programmeSlug}
          >
            {"developmentalStageTitle" in programme ? (
              <SpecialistProgrammeListItem
                programme={programme}
                onClick={props.onClickSpecialist}
              />
            ) : (
              <SubjectProgrammeListItem
                programme={programme}
                onClick={props.onClickSubject}
              />
            )}
          </GridArea>
        );
      })}
    </Grid>
  );
};

export default ProgrammeList;
