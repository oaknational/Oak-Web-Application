import { FC } from "react";

import Grid, { GridArea, GridProps } from "../Grid";

import BioCardListItem, { BioCardListItemProps } from "./BioCardListItem";

type BioCardListProps = GridProps & {
  people: BioCardListItemProps[];
};
const BioCardList: FC<BioCardListProps> = (props) => {
  const { people, ...gridProps } = props;
  return (
    <Grid $cg={16} $rg={32} $gridAutoRows="1fr" {...gridProps}>
      {people.map((person) => (
        <GridArea $colSpan={[12, 4, 3]} key={`${person.name}`}>
          <BioCardListItem {...person} />
        </GridArea>
      ))}
    </Grid>
  );
};

export default BioCardList;
