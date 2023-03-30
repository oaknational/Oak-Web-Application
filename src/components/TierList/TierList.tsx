import { FC } from "react";

import Grid, { GridArea, GridProps } from "../Grid";

import TierListItem, { TierListItemProps } from "./TierListItem";

type TierListProps = GridProps & {
  tiers: Omit<
    TierListItemProps,
    "subjectSlug" | "keyStageSlug" | "subjectName" | "keyStageName"
  >[];
  subjectSlug: string;
  subjectName: string;
  keyStageSlug: string;
  keyStageName: string;
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
  subjectName,
  keyStageName,
  ...gridProps
}) => {
  return (
    <Grid $cg={16} {...gridProps}>
      {tiers.map((tier) => (
        <GridArea $mb={16} $colSpan={[12, 4]} key={`tier-list-${tier.slug}`}>
          <TierListItem
            {...tier}
            subjectSlug={subjectSlug}
            subjectName={subjectName}
            keyStageSlug={keyStageSlug}
            keyStageName={keyStageName}
            background={"teachersPastelYellow"}
          />
        </GridArea>
      ))}
    </Grid>
  );
};

export default TierList;
