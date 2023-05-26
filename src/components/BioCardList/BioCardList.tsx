import { FC } from "react";

import BioModal from "../BioModal";
import { BioData } from "../BioModal/BioModal";
import { useBioModal } from "../BioModal/useBioModal";
import Grid, { GridArea } from "../Grid";
import Box from "../Box";
import Flex, { FlexProps } from "../Flex";

import BioCardListItem from "./BioCardListItem";

type BioCardListProps = FlexProps & {
  bios: BioData[];
  withModals?: boolean;
  firstBioHasOwnRow?: boolean;
};
const BioCardList: FC<BioCardListProps> = (props) => {
  const { bios, withModals, firstBioHasOwnRow, ...flexProps } = props;
  const modal = useBioModal({ bios });

  const onCardClick = withModals ? modal.openModal : undefined;
  const [firstBio, ...otherBios] = bios;

  return (
    <Flex $flexDirection="column" {...flexProps}>
      {firstBio && firstBioHasOwnRow && (
        <Grid $mb={[16, 32]} $cg={16}>
          <GridArea
            $colSpan={[12, 4, 6]}
            $colStart={[null, 5, 4]}
            $colEnd={[null, 9, 10]}
          >
            <Box $width={["100%", "100%", "50%"]} $mh="auto">
              <BioCardListItem
                {...firstBio}
                onClick={onCardClick}
                modalControllerRef={modal.modalControllerRefs[firstBio.id]}
                isOpen={modal.isOpen}
              />
            </Box>
          </GridArea>
        </Grid>
      )}
      <Grid $cg={16} $rg={[16, 32]} $gridAutoRows={[null, "1fr"]}>
        {firstBio && !firstBioHasOwnRow && (
          <GridArea $colSpan={[12, 4, 3]}>
            <BioCardListItem
              {...firstBio}
              onClick={onCardClick}
              modalControllerRef={modal.modalControllerRefs[firstBio.id]}
              isOpen={modal.isOpen}
            />
          </GridArea>
        )}
        {otherBios.map((bio) => (
          <GridArea
            $colSpan={[12, 4, 3]}
            key={`bio-card-list-gridarea-${bio.id}`}
          >
            <BioCardListItem
              {...bio}
              onClick={onCardClick}
              modalControllerRef={modal.modalControllerRefs[bio.id]}
              isOpen={modal.isOpen}
            />
          </GridArea>
        ))}
      </Grid>
      <BioModal {...modal} />
    </Flex>
  );
};

export default BioCardList;
