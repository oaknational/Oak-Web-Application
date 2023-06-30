import { FC } from "react";

import Grid, { GridArea } from "../Grid";
import { ProgrammeListingPageData } from "../../node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

import TierListItem from "./TierListItem";

/**
 * Clickable learning tier card list.
 *
 * ## Usage
 * Used on a key stage 4 learning tier page
 */
const TierList: FC<ProgrammeListingPageData> = ({
  programmes,
  subjectSlug,
  keyStageSlug,
}) => {
  return (
    <Grid $cg={16} $mb={92}>
      {programmes.map((tier) => {
        return (
          <GridArea $mb={16} $colSpan={[12, 4]} key={tier.programmeSlug}>
            <TierListItem
              keyStageSlug={keyStageSlug}
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

export default TierList;
