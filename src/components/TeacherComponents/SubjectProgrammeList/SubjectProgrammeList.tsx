import { FC } from "react";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import SubjectProgrammeListItem from "@/components/TeacherComponents/SubjectProgrammeListItem/SubjectProgrammeListItem";

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
    <OakGrid $cg={"all-spacing-4"}>
      {programmes.map((programme) => {
        return (
          <OakGridArea
            $mb={"space-between-s"}
            $colSpan={[12, 12, colSpan]}
            key={programme.programmeSlug}
          >
            <SubjectProgrammeListItem programme={programme} onClick={onClick} />
          </OakGridArea>
        );
      })}
    </OakGrid>
  );
};

export default ProgrammeList;
