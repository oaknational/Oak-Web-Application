import { FC, MutableRefObject, useRef } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakIcon,
  OakBox,
  OakFlex,
  OakMaxWidth,
} from "@oaknational/oak-components";

import { ModalControllerRefs } from "./useBioCardListModal";

import BioCardListModalNavigationButtons from "@/components/GenericPagesComponents/BioCardListModalNavigationButtons/BioCardListModalNavigationButtons";
import {
  Image,
  PortableTextJSON,
  TeamMemberSocials,
} from "@/common-lib/cms-types";
import AspectRatio from "@/components/SharedComponents/AspectRatio";
import IconButton from "@/components/SharedComponents/Button/IconButton";
import CMSImage from "@/components/SharedComponents/CMSImage";
import BioCardListModalDialog from "@/components/GenericPagesComponents/BioCardListModalDialog";
import useBioCardListModalDialog from "@/components/GenericPagesComponents/BioCardListModalDialog/useBioCardListModalDialog";
import SocialButtons from "@/components/SharedComponents/SocialButtons";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

export type BioData = {
  id: string;
  name: string;
  role?: string | null;
  image?: Image | null;
  socials?: TeamMemberSocials | null;
  bioPortableText?: PortableTextJSON | null;
};

export type BioCardListModalProps = {
  isOpen: boolean;
  openModal: (initialBio: BioData) => void;
  closeModal: () => void;
  bio?: BioData;
  nextBio?: () => void;
  prevBio?: () => void;
  returnFocusRef?: MutableRefObject<HTMLButtonElement | null>;
  modalControllerRefs: ModalControllerRefs;
};
const BioCardListModal: FC<BioCardListModalProps> = (props) => {
  const { bio, isOpen, closeModal, nextBio, prevBio, returnFocusRef } = props;

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const modalDialogProps = useBioCardListModalDialog({
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
    <BioCardListModalDialog {...modalDialogProps}>
      {/* @todo replace with OakFlex - work out the padding */}
      <OakFlex
        $width={"100%"}
        $ph={["inner-padding-none", "inner-padding-xl7"]}
      >
        <OakBox
          $position={"absolute"}
          $top={["all-spacing-4", "all-spacing-7"]}
          $right={["all-spacing-4", "all-spacing-7"]}
          $zIndex={"modal-close-button"}
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
        </OakBox>
        <OakMaxWidth
          $position="relative"
          $maxWidth={["all-spacing-21", "all-spacing-22", "all-spacing-24"]}
          /**
           * Use margin for centering to avoid overflow issue
           * @see https://stackoverflow.com/a/33455342/4031364
           */
          $ma="auto"
          $justifyContent={"unset"}
          $alignItems={"unset"}
        >
          <OakGrid
            $position="relative"
            $mt={[
              "space-between-none",
              "space-between-s",
              "space-between-none",
            ]}
          >
            <OakGridArea $colSpan={[12, 5, 3]} $order={[1, 0]}>
              <OakBox $position={"relative"} $zIndex={"in-front"}>
                <OakHeading
                  {...titleProps}
                  tag="h2"
                  $font={["heading-5", "heading-4"]}
                  $mr={["space-between-none", "space-between-s"]}
                  $mb={["space-between-none", "space-between-ssx"]}
                  $textAlign={["center", "left"]}
                  // If 'next' or 'prev' buttons are clicked, read out the new name
                  aria-live="polite"
                >
                  {name}
                </OakHeading>
                <OakP
                  $font={["heading-light-7", "heading-light-6"]}
                  $color="grey60"
                  $mb={["space-between-m2", "space-between-none"]}
                  $textAlign={["center", "left"]}
                >
                  {role}
                </OakP>
              </OakBox>
            </OakGridArea>
            <OakGridArea
              $colSpan={[12, 7, 4]}
              $order={[0, 1]}
              $pt={["inner-padding-xl", "inner-padding-none"]}
            >
              <OakBox
                $position="relative"
                $mb={["space-between-m", "space-between-none"]}
                $width={["all-spacing-19", "100%"]}
                $mh={["auto"]}
              >
                <BoxBorders gapPosition="rightTop" $zIndex={"in-front"} />
                <OakIcon
                  iconName="looping-arrow-1"
                  $colorFilter={"oakGreen"}
                  $display={["none", "block"]}
                  $position={"absolute"}
                  $top={"all-spacing-15"}
                  $transform={[
                    null,
                    "translate(-57%, 5%)",
                    "translate(-57%, -10%)",
                  ]}
                  $width={[null, "all-spacing-19", "all-spacing-20"]}
                  $height={[null, "all-spacing-19", "all-spacing-20"]}
                />
                <AspectRatio ratio={["7:8", "7:8", "2:3"]}>
                  <OakBox $background="white" $objectFit={"cover"} />
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
              </OakBox>
            </OakGridArea>
            <OakGridArea $colSpan={[12, 12, 5]} $order={[2, 2]}>
              {bioPortableText && (
                <OakBox
                  $ml={[
                    "space-between-none",
                    "space-between-none",
                    "space-between-xxl",
                  ]}
                  $mb={["space-between-xxl"]}
                  $mt={[
                    "space-between-none",
                    "space-between-xxl",
                    "space-between-none",
                  ]}
                  $font={["body-2", "body-1"]}
                  $minHeight={["auto", "all-spacing-19"]}
                >
                  <PortableTextWithDefaults value={bioPortableText} />
                </OakBox>
              )}
            </OakGridArea>
          </OakGrid>
          <OakFlex
            $position={["fixed", "absolute"]}
            $bottom={["all-spacing-0"]}
            $left={["all-spacing-4"]}
            $right={["all-spacing-4"]}
            $pb={["inner-padding-m", "inner-padding-m", "inner-padding-none"]}
            $pt={["inner-padding-m", "inner-padding-none"]}
            $alignItems="center"
            $background={["white", "transparent"]}
          >
            <SocialButtons
              for={name}
              x={socials?.twitterUsername}
              linkedIn={socials?.linkedinUrl}
              $position={["absolute", "relative"]}
              $left={["all-spacing-0"]}
              $alignItems="flex-end"
            />
            <BioCardListModalNavigationButtons
              $ml="auto"
              $mr={["auto", 0]}
              prevBio={prevBio}
              nextBio={nextBio}
              defaultFocusRef={closeButtonRef}
            />
          </OakFlex>
        </OakMaxWidth>
      </OakFlex>
    </BioCardListModalDialog>
  );
};

export default BioCardListModal;
