import { FC, useCallback, useState } from "react";

import {
  SanityImageAsset,
  TeamMemberSocialsFragment,
} from "../../node-lib/sanity-graphql/generated/sdk";
import AspectRatio from "../AspectRatio";
import Box from "../Box";
import IconButton from "../Button/IconButton";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import Flex from "../Flex";
import Grid, { GridArea } from "../Grid";
import MaxWidth from "../MaxWidth/MaxWidth";
import ModalDialog from "../ModalDialog";
import SocialButtons from "../SocialButtons";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import Svg from "../Svg";
import { Heading, P } from "../Typography";

export type BioData = {
  id: string;
  name: string;
  role?: string | null;
  image?: SanityImageAsset | null;
  socials?: TeamMemberSocialsFragment | null;
};

type UseBioModalProps = {
  bios: BioData[];
};
export const useModalState = (props: UseBioModalProps): BioModalProps => {
  const { bios } = props;
  const [bio, setBio] = useState<BioData>();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback((initialBio: BioData) => {
    setIsOpen(true);
    setBio(initialBio);
  }, []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const currentIndex = bios.findIndex((_bio) => _bio.id === bio?.id);

  const nextBio = () => {
    const nextIndex = (currentIndex + 1) % bios.length;
    const _bio = bios.at(nextIndex);
    if (!_bio) {
      // @todo error
      return;
    }
    setBio(_bio);
  };

  const prevBio = () => {
    const prevIndex = (currentIndex - 1) % bios.length;
    const _bio = bios.at(prevIndex);
    if (!_bio) {
      // @todo error
      return;
    }
    setBio(_bio);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    nextBio,
    prevBio,
    bio,
    bios,
  };
};

type BioModalProps = {
  isOpen: boolean;
  openModal: (initialBio: BioData) => void;
  closeModal: () => void;
  bio?: BioData;
  setBio: (bio: BioData) => void;
};
const BioModal: FC<BioModalProps> = (props) => {
  const { bio, setBio, isOpen, closeModal, nextBio, prevBio } = props;
  // const [isOpen, setIsOpen] = useState(true);
  //   const bio = allBios[0];

  if (!isOpen) {
    return null;
  }

  if (!bio) {
    // @todo error (when modal is open, bio should be populated)
    return null;
  }

  const { name, role, socials } = bio;

  console.log(socials);

  return (
    <ModalDialog size="fullscreen" title="Matt Hood">
      <Box
        $position={"absolute"}
        $top={[24, 32]}
        $right={[16, 32]}
        $zIndex={"modalCloseButton"}
      >
        <IconButton
          icon="Cross"
          onClick={closeModal}
          aria-label="close modal"
          background="teachersHighlight"
          size="small"
        />
      </Box>
      <MaxWidth>
        <Grid $position="relative" $maxHeight={"100%"}>
          <GridArea $colSpan={[12, 3]}>
            <Box $zIndex={"inFront"}>
              <Heading
                tag="h2"
                $font={["heading-5", "heading-4"]}
                $mr={[48, 0]}
                $mb={[12, 0]}
              >
                Lonng n {name}
              </Heading>
              <P $font={["heading-light-6"]} $color="oakGrey4" $mb={[16, 0]}>
                {role}
              </P>
            </Box>
          </GridArea>
          <GridArea $colSpan={[12, 4]} $pt={[0, 40]}>
            <Box $position="relative" $mb={[20, 0]}>
              <BoxBorders gapPosition="rightTop" $zIndex={"inFront"} />
              <Svg
                $display={["none", "block"]}
                name="looping-arrow-1"
                $position={"absolute"}
                $transform={"translate(-37%, -28%)"}
                $color="pupilsHighlight"
              />

              <AspectRatio ratio={["7:8", "2:3"]}>
                <Box $background="white" $cover />
              </AspectRatio>
            </Box>
          </GridArea>
          <GridArea $colSpan={[12, 5]} $pt={[0, 40]}>
            <P $ml={[0, 72]} $mb={[92, 72]} $font={["body-1", "body-2"]}>
              Matt is the Principal at Oak National Academy. He is an economics
              teacher by training and was a founder at Ambition Institute. He is
              Chair of Governors at Bay Leadership Academy in Morecambe, a
              Trustee at The Brilliant Club, and an independent government
              adviser on professional development.
            </P>
          </GridArea>
          <Flex
            $position={["fixed", "absolute"]}
            $bottom={[24, 0]}
            $right={[16, 0]}
            $left={[16, 0]}
          >
            <SocialButtons
              twitter={socials?.twitterUsername}
              linkedIn={socials?.linkedinUrl}
              $alignItems="flex-end"
            />
            <ButtonGroup $ml="auto">
              <IconButton
                icon="ArrowLeft"
                aria-label="previous board member"
                onClick={nextBio}
                size="small"
              />
              <IconButton
                icon="ArrowRight"
                aria-label="previous board member"
                onClick={prevBio}
                size="small"
              />
            </ButtonGroup>
          </Flex>
        </Grid>
      </MaxWidth>
    </ModalDialog>
  );
};

export default BioModal;
