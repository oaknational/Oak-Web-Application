import { FC } from "react";

import Flex from "../Flex";
import Grid, { GridArea } from "../Grid";
import { OakColorName } from "../../styles/theme/types";

import TierListItem, { TierListItemProps } from "./TierListItem";

type TierListProps = {
  tiers: Omit<TierListItemProps, "subjectSlug" | "keyStageSlug">[];
  subjectSlug: string;
  keyStageSlug: string;
  background?: OakColorName;
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
  background = "teachersYellow",
}) => {
  return (
    <Flex $flexDirection="column">
      <Grid $mb={[16, 32]} $cg={16}>
        {tiers.map((tier) => (
          <GridArea $mb={16} $colSpan={[12, 4]}>
            <TierListItem
              {...tier}
              subjectSlug={subjectSlug}
              keyStageSlug={keyStageSlug}
              background={background}
            />
          </GridArea>
        ))}
      </Grid>
    </Flex>
  );
};

export default TierList;
