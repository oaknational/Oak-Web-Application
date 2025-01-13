import { FC } from "react";
import { OakBox, OakFlex, OakFlexProps } from "@oaknational/oak-components";

import BioCardListItem from "@/components/GenericPagesComponents/BioCardListItem";
import BioCardListModal, {
  BioData,
} from "@/components/GenericPagesComponents/BioCardListModal";
import { useBioCardListModal } from "@/components/GenericPagesComponents/BioCardListModal/useBioCardListModal";
import { GridList } from "@/components/SharedComponents/Typography/UL.deprecated";
import { GridAreaListItem } from "@/components/SharedComponents/Typography/LI.deprecated";

type BioCardListProps = OakFlexProps & {
  bios: BioData[];
  withModals?: boolean;
  firstBioHasOwnRow?: boolean;
};

const BioCardList: FC<BioCardListProps> = (props) => {
  const { bios, withModals, firstBioHasOwnRow, ...flexProps } = props;
  const modal = useBioCardListModal({ bios });

  const onCardClick = withModals ? modal.openModal : undefined;
  const [firstBio, ...otherBios] = bios;

  return (
    <OakFlex $flexDirection="column" {...flexProps}>
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
              <OakBox
                $width={["100%", "100%", "auto"]}
                $height="100%"
                $mh="auto"
              >
                <BioCardListItem
                  {...firstBio}
                  onClick={onCardClick}
                  modalControllerRef={modal.modalControllerRefs[firstBio.id]}
                  isOpen={modal.isOpen}
                />
              </OakBox>
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
      <BioCardListModal {...modal} />
    </OakFlex>
  );
};

export default BioCardList;
