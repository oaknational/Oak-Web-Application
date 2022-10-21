import { FC } from "react";

import BioModal from "../BioModal";
import { BioData } from "../BioModal/BioModal";
import { useBioModal } from "../BioModal/useBioModal";
import Grid, { GridArea, GridProps } from "../Grid";

import BioCardListItem from "./BioCardListItem";

type BioCardListProps = GridProps & {
  bios: BioData[];
  withModals?: boolean;
};
const BioCardList: FC<BioCardListProps> = (props) => {
  const { bios, withModals, ...gridProps } = props;
  const modal = useBioModal({ bios });

  const onCardClick = withModals ? modal.openModal : undefined;

  return (
    <>
      <Grid $cg={16} $rg={32} $gridAutoRows="1fr" {...gridProps}>
        {bios.map((person) => (
          <GridArea
            $colSpan={[12, 4, 3]}
            key={`bio-card-list-gridarea-${person.id}`}
          >
            <BioCardListItem {...person} onClick={onCardClick} />
          </GridArea>
        ))}
      </Grid>
      <BioModal {...modal} />
    </>
  );
};

export default BioCardList;
