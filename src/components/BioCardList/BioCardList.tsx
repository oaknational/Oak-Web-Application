import { FC } from "react";

import BioModal from "../BioModal";
import { BioData } from "../BioModal/BioModal";
import { useBioModal } from "../BioModal/useBioModal";
import Grid, { GridArea, GridProps } from "../Grid";

import BioCardListItem from "./BioCardListItem";

type BioCardListProps = GridProps & {
  people: BioData[];
};
const BioCardList: FC<BioCardListProps> = (props) => {
  const { people, ...gridProps } = props;
  const modal = useBioModal({ bios: people });

  return (
    <>
      <Grid $cg={16} $rg={32} $gridAutoRows="1fr" {...gridProps}>
        {people.map((person) => (
          <GridArea
            $colSpan={[12, 4, 3]}
            key={`bio-card-list-gridarea-${person.id}`}
          >
            <BioCardListItem {...person} onClick={modal.openModal} />
          </GridArea>
        ))}
      </Grid>
      <BioModal {...modal} />
    </>
  );
};

export default BioCardList;
