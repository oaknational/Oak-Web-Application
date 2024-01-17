import { FC } from "react";

import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import SubjectProgrammeListItem from "@/components/TeacherComponents/SubjectProgrammeListItem/SubjectProgrammeListItem";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
import {
  SpecialistProgramme,
  SpecialistProgrammes,
} from "@/node-lib/curriculum-api-2023/queries/specialistProgrammeListing/specialistProgrammeListing.schema";

/**
 * Clickable learning tier card list.
 *
 * ## Usage
 * Used on a key stage 4 learning tier page
 */
export type SubjectProgrammeListProps = {
  onClick: (
    props:
      | SubjectProgrammeListProps["programmes"][number]
      | SpecialistProgramme,
  ) => void;
  programmes: ProgrammeListingPageData["programmes"] | SpecialistProgrammes;
};

const SubjectProgrammeList: FC<SubjectProgrammeListProps> = ({
  programmes,
  onClick,
}) => {
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
            <SubjectProgrammeListItem programme={programme} onClick={onClick} />
          </GridArea>
        );
      })}
    </Grid>
  );
};

export default SubjectProgrammeList;
