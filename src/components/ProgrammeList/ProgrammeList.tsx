import { FC } from "react";

import Grid, { GridArea } from "../Grid";
import { ProgrammeListingPageData } from "../../node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

import ProgrammeListItem from "./ProgrammeListItem";

/**
 * Clickable learning tier card list.
 *
 * ## Usage
 * Used on a key stage 4 learning tier page
 */
const ProgrammeList: FC<ProgrammeListingPageData> = ({
  programmes,
  subjectSlug,
  keyStageSlug,
  keyStageTitle,
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
            <ProgrammeListItem
              keyStageSlug={keyStageSlug}
              keyStageTitle={keyStageTitle}
              subjectSlug={subjectSlug}
              {...programme}
            />
          </GridArea>
        );
      })}
    </Grid>
  );
};

export default ProgrammeList;
