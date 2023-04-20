import { FC } from "react";

import Grid, { GridArea, GridProps } from "../Grid";
import { TierListingData } from "../../node-lib/curriculum-api";

import TierListItem from "./TierListItem";

type TierListProps = GridProps &
  TierListingData & {
    keyStageSlug: string;
    slug: string;
    title: string;
    keyStageTitle: string;
  };

/**
 * Clickable learning tier card list.
 *
 * ## Usage
 * Used on a key stage 4 learning tier page
 */
const TierList: FC<TierListProps> = ({
  programmes,
  keyStageSlug,
  slug,
  title,
  keyStageTitle,

  ...gridProps
}) => {
  return (
    <Grid $cg={16} {...gridProps}>
      {programmes.map((tier) => {
        return (
          <GridArea $mb={16} $colSpan={[12, 4]} key={tier.programmeSlug}>
            <TierListItem {...tier} background={"teachersPastelYellow"} />
          </GridArea>
        );
      })}
    </Grid>
  );
};

export default TierList;
