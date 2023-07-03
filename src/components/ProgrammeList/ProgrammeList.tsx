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
  return (
    <Grid $cg={16} $mb={92}>
      {programmes.map((tier) => {
        return (
          <GridArea $mb={16} $colSpan={[12, 4]} key={tier.programmeSlug}>
            <ProgrammeListItem
              keyStageSlug={keyStageSlug}
              keyStageTitle={keyStageTitle}
              subjectSlug={subjectSlug}
              {...tier}
              background={"teachersPastelYellow"}
            />
          </GridArea>
        );
      })}
    </Grid>
  );
};

export default ProgrammeList;
