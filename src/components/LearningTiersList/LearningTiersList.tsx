import { FC } from "react";

import Flex from "../Flex";
import Grid, { GridArea } from "../Grid";
import { OakColorName } from "../../styles/theme/types";

import LearningTiersListItem from "./LearningTiersListItem";
import { LearningTiersListItemProps } from "./LearningTiersListItem/LearningTiersListItem";

type LearningTiersListProps = {
  tiers: LearningTiersListItemProps[];
  background: OakColorName;
};

/**
 * Clickable learning tier card list.
 *
 * ## Usage
 * Used on a key stage 4 learning tier page
 */
const LearningTiersList: FC<LearningTiersListProps> = ({
  tiers,
  background,
}) => {
  return (
    <Flex $flexDirection="column">
      <Grid $mb={[16, 32]} $cg={16}>
        {tiers.map((tier) => (
          <GridArea $mb={16} $colSpan={[12, 4]}>
            <LearningTiersListItem {...tier} background={background} />
          </GridArea>
        ))}
      </Grid>
    </Flex>
  );
};

export default LearningTiersList;
