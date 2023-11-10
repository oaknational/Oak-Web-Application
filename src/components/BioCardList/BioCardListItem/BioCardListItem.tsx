import { FC, MutableRefObject } from "react";

import useClickableCard from "../../../hooks/useClickableCard";
import AvatarImage from "../../AvatarImage";
import { BioData } from "../../BioModal/BioModal";
import Button from "../../Button";
import Flex from "../../Flex";
import SocialButtons from "../../SocialButtons";
import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders";
import { Heading, P } from "../../Typography";

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
    <Flex
      {...(onClick ? containerProps : {})}
      $position="relative"
      $background="white"
      $pa={16}
      $flexDirection={["row", "column"]}
      $height={"100%"}
    >
      <BoxBorders gapPosition="rightTop" />
      <Flex $alignItems={"flex-start"} $mb={"auto"}>
        <AvatarImage image={image} $mr={12} size={[56, 72]} />
        <Flex $flexDirection="column" $alignSelf={["center", "flex-start"]}>
          <Heading tag="h3" $font={["heading-7", "heading-6"]}>
            {name}
          </Heading>
          {role && (
            <P $mt={4} $font={["body-3", "heading-light-7"]} $color={"grey60"}>
              {role}
            </P>
          )}
        </Flex>
      </Flex>
      <Flex $alignItems={"center"} $mt={[0, 24]} $ml={["auto", 0]}>
        <SocialButtons
          for={name}
          linkedIn={socials?.linkedinUrl}
          twitter={socials?.twitterUsername}
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
      </Flex>
    </Flex>
  );
};

export default BioCardListItem;
