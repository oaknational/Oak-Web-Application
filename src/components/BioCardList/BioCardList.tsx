import { FC } from "react";

import BioModal from "../BioModal";
import { BioData } from "../BioModal/BioModal";
import { useBioModal } from "../BioModal/useBioModal";
import Grid, { GridArea, GridProps } from "../Grid";

import BioCardListItem from "./BioCardListItem";

type BioCardListProps = GridProps & {
  bios: BioData[];
  withModals?: boolean;
  firstBioHasOwnRow?: boolean;
};
const BioCardList: FC<BioCardListProps> = (props) => {
  const { bios, withModals, firstBioHasOwnRow, ...gridProps } = props;
  const modal = useBioModal({ bios });

  const onCardClick = withModals ? modal.openModal : undefined;
  const [firstBio, ...otherBios] = bios;

  return (
    <>
      <Grid $cg={16} $rg={32} $gridAutoRows="1fr" {...gridProps}>
        {firstBio && (
          <>
            <GridArea $colSpan={[12, 4, 3]}>
              <BioCardListItem {...firstBio} onClick={onCardClick} />
            </GridArea>
            {firstBioHasOwnRow && <GridArea $colSpan={[0, 8, 9]} />}
          </>
        )}
        {otherBios.map((bio) => (
          <GridArea
            $colSpan={[12, 4, 3]}
            key={`bio-card-list-gridarea-${bio.id}`}
          >
            <BioCardListItem {...bio} onClick={onCardClick} />
          </GridArea>
        ))}
      </Grid>
      <BioModal {...modal} />
    </>
  );
};

export default BioCardList;
