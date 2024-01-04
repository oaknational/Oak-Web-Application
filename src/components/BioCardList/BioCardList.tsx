import { FC } from "react";

import BioModal from "../BioModal";
import { BioData } from "../BioModal/BioModal";
import { useBioModal } from "../BioModal/useBioModal";
import Box from "../Box";
import Flex, { FlexProps } from "../Flex";
import { GridList } from "../Typography/UL";
import { GridAreaListItem } from "../Typography/LI";

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
      <GridList $cg={16} $gridAutoRows={[null, "1fr"]}>
        {firstBio && firstBioHasOwnRow && (
          <>
            <GridAreaListItem
              $colSpan={[12, 4, 6]}
              $colStart={[null, 5, 4]}
              $colEnd={[null, 9, 10]}
              $mb={[16, 32]}
              key={`bio-card-list-gridarea-${firstBio.id}`}
            >
              <Box $width={["100%", "100%", "50%"]} $mh="auto">
                <BioCardListItem
                  {...firstBio}
                  onClick={onCardClick}
                  modalControllerRef={modal.modalControllerRefs[firstBio.id]}
                  isOpen={modal.isOpen}
                />
              </Box>
            </GridAreaListItem>
            {/* Empty GridAreaListItem to fill the gap on desktop */}
            <GridAreaListItem
              $colSpan={[12, 3, 2]}
              $colStart={[null, 10, 11]}
              $colEnd={[null, 12, 12]}
            />
          </>
        )}
        {firstBio && !firstBioHasOwnRow && (
          <GridAreaListItem
            $colSpan={[12, 4, 3]}
            $mb={[16, 32]}
            key={`bio-card-list-gridarea-${firstBio.id}`}
          >
            <BioCardListItem
              {...firstBio}
              onClick={onCardClick}
              modalControllerRef={modal.modalControllerRefs[firstBio.id]}
              isOpen={modal.isOpen}
            />
          </GridAreaListItem>
        )}
        {otherBios.map((bio) => (
          <GridAreaListItem
            $colSpan={[12, 4, 3]}
            key={`bio-card-list-gridarea-${bio.id}`}
            $mb={[16, 32]}
          >
            <BioCardListItem
              {...bio}
              onClick={onCardClick}
              modalControllerRef={modal.modalControllerRefs[bio.id]}
              isOpen={modal.isOpen}
            />
          </GridAreaListItem>
        ))}
      </GridList>
      <BioModal {...modal} />
    </Flex>
  );
};

export default BioCardList;
