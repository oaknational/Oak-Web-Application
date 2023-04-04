import { FC } from "react";

import Grid, { GridArea, GridProps } from "../Grid";

import TierListItem, { TierListItemProps } from "./TierListItem";

type TierListProps = GridProps & {
  tiers: Omit<
    TierListItemProps,
    "subjectSlug" | "keyStageSlug" | "subjectTitle" | "keyStageTitle"
  >[];
  subjectSlug: string;
  subjectTitle: string;
  keyStageSlug: string;
  keyStageTitle: string;
};

/**
 * Clickable learning tier card list.
 *
 * ## Usage
 * Used on a key stage 4 learning tier page
 */
const TierList: FC<TierListProps> = ({
  tiers,
  keyStageSlug,
  subjectSlug,
  subjectTitle,
  keyStageTitle,
  ...gridProps
}) => {
  return (
    <Grid $cg={16} {...gridProps}>
      {tiers.map((tier) => (
        <GridArea $mb={16} $colSpan={[12, 4]} key={`tier-list-${tier.slug}`}>
          <TierListItem
            {...tier}
            subjectSlug={subjectSlug}
            subjectTitle={subjectTitle}
            keyStageSlug={keyStageSlug}
            keyStageTitle={keyStageTitle}
            background={"teachersPastelYellow"}
          />
        </GridArea>
      ))}
    </Grid>
  );
};

export default TierList;
