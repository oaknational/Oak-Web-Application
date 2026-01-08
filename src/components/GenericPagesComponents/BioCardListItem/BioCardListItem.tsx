import { FC, MutableRefObject } from "react";
import { OakHeading, OakP, OakFlex } from "@oaknational/oak-components";

import useClickableCard from "@/hooks/useClickableCard";
import { BioData } from "@/components/GenericPagesComponents/BioCardListModal/BioCardListModal";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import SocialButtons from "@/components/SharedComponents/SocialButtons";
import AvatarImage from "@/components/SharedComponents/AvatarImage";
import Button from "@/components/SharedComponents/Button";

export type BioCardListItemProps = BioData & {
  onClick?: (bio: BioData) => void;
  modalControllerRef?: MutableRefObject<HTMLButtonElement | null>;
  isOpen: boolean;
};
const BioCardListItem: FC<BioCardListItemProps> = (props) => {
  const { name, role, image, socials, onClick, modalControllerRef, isOpen } =
    props;
  const { containerProps, primaryTargetProps } =
    useClickableCard<HTMLButtonElement>();

  return (
    <OakFlex
      {...(onClick ? containerProps : {})}
      $position="relative"
      $background="bg-primary"
      $pa="spacing-16"
      $flexDirection={["row", "column"]}
      $height={"100%"}
    >
      <BoxBorders gapPosition="rightTop" />
      <OakFlex $alignItems={"flex-start"} $mb={"auto"}>
        <AvatarImage image={image} $mr={12} size={[56, 72]} />
        <OakFlex $flexDirection="column" $alignSelf={["center", "flex-start"]}>
          <OakHeading tag="h3" $font={["heading-7", "heading-6"]}>
            {name}
          </OakHeading>
          {role && (
            <OakP
              $mt="spacing-4"
              $font={["body-3", "heading-light-7"]}
              $color={"text-subdued"}
            >
              {role}
            </OakP>
          )}
        </OakFlex>
      </OakFlex>
      <OakFlex
        $alignItems={"center"}
        $mt={["spacing-0", "spacing-24"]}
        $ml={["auto", "spacing-0"]}
      >
        <SocialButtons
          for={name}
          linkedIn={socials?.linkedinUrl}
          x={socials?.twitterUsername}
          $display={["none", "flex"]}
        />
        {onClick && (
          <Button
            {...primaryTargetProps}
            ref={(node) => {
              primaryTargetProps.ref.current = node;
              if (modalControllerRef) {
                modalControllerRef.current = node;
              }
            }}
            label="See bio"
            labelSuffixA11y={`for ${name}`}
            variant="minimal"
            icon="arrow-right"
            $iconPosition="trailing"
            iconBackground="blue"
            $ml="auto"
            onClick={() => onClick(props)}
            shouldHideLabel={[true, false]}
            aria-expanded={isOpen}
          />
        )}
      </OakFlex>
    </OakFlex>
  );
};

export default BioCardListItem;
