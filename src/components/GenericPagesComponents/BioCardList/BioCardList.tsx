import { FC } from "react";
import {
  OakFlex,
  OakFlexProps,
  OakGrid,
  OakGridArea,
  OakBox,
} from "@oaknational/oak-components";

import BioCardListItem from "@/components/GenericPagesComponents/BioCardListItem";
import BioCardListModal, {
  BioData,
} from "@/components/GenericPagesComponents/BioCardListModal";
import { useBioCardListModal } from "@/components/GenericPagesComponents/BioCardListModal/useBioCardListModal";

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
      <OakGrid
        $gridTemplateColumns={["1fr", "repeat(12, 1fr)"]}
        $cg={"all-spacing-4"}
      >
        {firstBio && firstBioHasOwnRow && (
          <>
            <OakGridArea
              $colSpan={[12, 4, 6]}
              $colStart={[null, 5, 4]}
              $colEnd={[null, 9, 10]}
              $mb={["space-between-s", "space-between-m2"]}
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
            </OakGridArea>
            {/* Empty OakGridArea to fill the gap on desktop */}
            <OakGridArea
              $colSpan={[12, 3, 2]}
              $colStart={[null, 10, 11]}
              $colEnd={[null, 12, 12]}
            />
          </>
        )}
        {firstBio && !firstBioHasOwnRow && (
          <OakGridArea
            $colSpan={[12, 4, 3]}
            $mb={["space-between-s", "space-between-m2"]}
            key={`bio-card-list-gridarea-${firstBio.id}`}
          >
            <BioCardListItem
              {...firstBio}
              onClick={onCardClick}
              modalControllerRef={modal.modalControllerRefs[firstBio.id]}
              isOpen={modal.isOpen}
            />
          </OakGridArea>
        )}
        {otherBios.map((bio) => (
          <OakGridArea
            $colSpan={[12, 4, 3]}
            key={`bio-card-list-gridarea-${bio.id}`}
            $mb={["space-between-s", "space-between-m2"]}
          >
            <BioCardListItem
              {...bio}
              onClick={onCardClick}
              modalControllerRef={modal.modalControllerRefs[bio.id]}
              isOpen={modal.isOpen}
            />
          </OakGridArea>
        ))}
      </OakGrid>
      <BioCardListModal {...modal} />
    </OakFlex>
  );
};

export default BioCardList;
