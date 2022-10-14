import { FC } from "react";

import Grid, { GridArea, GridProps } from "../Grid";
import { GridAreaProps } from "../Grid/GridArea";

import BioCardListItem, { BioCardListItemProps } from "./BioCardListItem";

type BioCardListProps = GridProps &
  Pick<GridAreaProps, "$colStart"> & {
    people: BioCardListItemProps[];
  };
const BioCardList: FC<BioCardListProps> = (props) => {
  const { people, $colStart, ...gridProps } = props;
  return (
    <Grid $cg={16} $rg={32} $gridAutoRows="1fr" {...gridProps}>
      {people.map((person) => (
        <GridArea
          $colSpan={[12, 4, 3]}
          key={`${person.name}`}
          $colStart={$colStart}
        >
          <BioCardListItem {...person} />
        </GridArea>
      ))}
    </Grid>
  );
};

export default BioCardList;
