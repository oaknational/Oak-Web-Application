import { FC, MutableRefObject, useRef } from "react";

import NavigationButtons from "./NavigationButtons";
import { ModalControllerRefs } from "./useBioModal";

import {
  Image,
  PortableTextJSON,
  TeamMemberSocials,
} from "@/common-lib/cms-types";
import AspectRatio from "@/components/SharedComponents/AspectRatio";
import Box from "@/components/SharedComponents/Box";
import IconButton from "@/components/SharedComponents/Button/IconButton";
import CMSImage from "@/components/SharedComponents/CMSImage";
import Flex from "@/components/SharedComponents/Flex";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import ModalDialog from "@/components/ModalDialog";
import useModalDialog from "@/components/ModalDialog/useModalDialog";
import SocialButtons from "@/components/SharedComponents/SocialButtons";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import Svg from "@/components/SharedComponents/Svg";
import { Heading, P } from "@/components/SharedComponents/Typography";
import { PortableTextWithDefaults } from "@/components/PortableText";

export type BioData = {
  id: string;
  name: string;
  role?: string | null;
  image?: Image | null;
  socials?: TeamMemberSocials | null;
  bioPortableText?: PortableTextJSON | null;
};

export type BioModalProps = {
  isOpen: boolean;
  openModal: (initialBio: BioData) => void;
  closeModal: () => void;
  bio?: BioData;
  nextBio?: () => void;
  prevBio?: () => void;
  returnFocusRef?: MutableRefObject<HTMLButtonElement | null>;
  modalControllerRefs: ModalControllerRefs;
};
const BioModal: FC<BioModalProps> = (props) => {
  const { bio, isOpen, closeModal, nextBio, prevBio, returnFocusRef } = props;

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const modalDialogProps = useModalDialog({
    size: "fullscreen",
    closeModal,
    isDismissable: true,
    isKeyboardDismissDisabled: true,
    isOpen,
    returnFocusRef,
  });

  const { titleProps } = modalDialogProps;

  if (!isOpen) {
    return null;
  }

  if (!bio) {
    // @todo error (when modal is open, bio should be populated)
    return null;
  }

  const { name, role, socials, image, bioPortableText } = bio;

  return (
    <ModalDialog {...modalDialogProps}>
      <Flex $width={"100%"} $ph={[0, 72]}>
        <Box
          $position={"absolute"}
          $top={[16, 32]}
          $right={[16, 32]}
          $zIndex={"modalCloseButton"}
        >
          <IconButton
            icon="cross"
            onClick={closeModal}
            aria-label="close modal"
            background="blue"
            size="small"
            ref={closeButtonRef}
            aria-expanded={isOpen}
          />
        </Box>
        <MaxWidth
          $position="relative"
          $maxWidth={[480, 720, 1280]}
          /**
           * Use margin for centering to avoid overflow issue
           * @see https://stackoverflow.com/a/33455342/4031364
           */
          $ma="auto"
          $justifyContent={"unset"}
          $alignItems={"unset"}
        >
          <Grid $position="relative" $mt={[0, 16, 0]}>
            <GridArea $colSpan={[12, 5, 3]} $order={[1, 0]}>
              <Box $position={"relative"} $zIndex={"inFront"}>
                <Heading
                  {...titleProps}
                  tag="h2"
                  $font={["heading-5", "heading-4"]}
                  $mr={[0, 16]}
                  $mb={[0, 8]}
                  $textAlign={["center", "left"]}
                  // If 'next' or 'prev' buttons are clicked, read out the new name
                  aria-live="polite"
                >
                  {name}
                </Heading>
                <P
                  $font={["heading-light-7", "heading-light-6"]}
                  $color="grey60"
                  $mb={[32, 0]}
                  $textAlign={["center", "left"]}
                >
                  {role}
                </P>
              </Box>
            </GridArea>
            <GridArea $colSpan={[12, 7, 4]} $order={[0, 1]} $pt={[48, 0]}>
              <Box
                $position="relative"
                $mb={[20, 0]}
                $width={[240, "100%"]}
                $mh={["auto"]}
              >
                <BoxBorders gapPosition="rightTop" $zIndex={"inFront"} />
                <Svg
                  $display={["none", "block"]}
                  name="looping-arrow-1"
                  $position={"absolute"}
                  $width={[null, "28vw", 320]}
                  $transform={[
                    null,
                    "translate(-57%, 5%)",
                    "translate(-57%, -10%)",
                  ]}
                  $color="oakGreen"
                />
                <AspectRatio ratio={["7:8", "7:8", "2:3"]}>
                  <Box $background="white" $cover />
                  {image && (
                    <CMSImage
                      image={image}
                      $objectPosition={"center"}
                      $objectFit={"cover"}
                      width={419}
                      height={628}
                      $cover
                    />
                  )}
                </AspectRatio>
              </Box>
            </GridArea>
            <GridArea $colSpan={[12, 12, 5]} $order={[2, 2]}>
              {bioPortableText && (
                <Box
                  $ml={[0, 0, 72]}
                  $mb={[72]}
                  $mt={[0, 72, 0]}
                  $font={["body-2", "body-1"]}
                  $minHeight={["auto", 270]}
                >
                  <PortableTextWithDefaults value={bioPortableText} />
                </Box>
              )}
            </GridArea>
          </Grid>
          <Flex
            $position={["fixed", "absolute"]}
            $bottom={[0]}
            $left={[16]}
            $right={[16]}
            $pb={[16, 16, 0]}
            $pt={[16, 0]}
            $alignItems="center"
            $background={["white", "transparent"]}
          >
            <SocialButtons
              for={name}
              twitter={socials?.twitterUsername}
              linkedIn={socials?.linkedinUrl}
              $position={["absolute", "relative"]}
              $left={[0]}
              $alignItems="flex-end"
            />
            <NavigationButtons
              $ml="auto"
              $mr={["auto", 0]}
              prevBio={prevBio}
              nextBio={nextBio}
              defaultFocusRef={closeButtonRef}
            />
          </Flex>
        </MaxWidth>
      </Flex>
    </ModalDialog>
  );
};

export default BioModal;
