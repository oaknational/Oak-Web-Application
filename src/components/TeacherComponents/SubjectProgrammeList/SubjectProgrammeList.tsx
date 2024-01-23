import { FC } from "react";

import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import SubjectProgrammeListItem from "@/components/TeacherComponents/SubjectProgrammeListItem/SubjectProgrammeListItem";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";

/**
 * Clickable programme card list.
 *
 * ## Usage
 * Used on subject and specialist programmes pages
 */
export type ProgrammeListProps = {
  programmes: ProgrammeListingPageData["programmes"];
  onClick: (props: ProgrammeListingPageData["programmes"][number]) => void;
};

const ProgrammeList: FC<ProgrammeListProps> = ({ programmes, onClick }) => {
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

export default ProgrammeList;
