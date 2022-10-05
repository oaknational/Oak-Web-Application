import { FC } from "react";

import useClickableCard from "../../../hooks/useClickableCard";
import AvatarImage from "../../AvatarImage";
import { BioData } from "../../BioModal/BioModal";
import Button from "../../Button";
import Flex from "../../Flex";
import SocialButtons from "../../SocialButtons";
import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders";
import { Heading, P } from "../../Typography";

export type BioCardListItemProps = BioData & {
  onClick: (bio: BioData) => void;
};
const BioCardListItem: FC<BioCardListItemProps> = (props) => {
  const { name, role, image, socials, onClick } = props;
  const { containerProps, primaryTargetProps } =
    useClickableCard<HTMLButtonElement>();

  return (
    <Flex
      {...containerProps}
      $position="relative"
      $background="white"
      $pa={16}
      $flexDirection={["row", "column"]}
      $height={"100%"}
    >
      <BoxBorders gapPosition="rightTop" />
      <Flex $alignItems={"flex-start"} $mb={"auto"}>
        <AvatarImage image={image} $mr={12} size={[56, 72]} />
        <Flex
          $mr={[0, 40]}
          $flexDirection="column"
          $alignSelf={["center", "flex-start"]}
        >
          <Heading tag="h3" $font={["heading-7", "heading-6"]}>
            {name}
          </Heading>
          {role && (
            <P
              $mt={4}
              $font={["body-3", "heading-light-7"]}
              $color={"oakGrey4"}
            >
              {role}
            </P>
          )}
        </Flex>
      </Flex>
      <Flex
        $justifyContent="space-between"
        $alignItems={"center"}
        $mt={[0, 24]}
        $ml={["auto", 0]}
      >
        <SocialButtons
          size="tiny"
          linkedIn={socials?.linkedinUrl}
          twitter={socials?.twitterUsername}
          $display={["none", "flex"]}
        />
        <Button
          {...primaryTargetProps}
          label="See bio"
          variant="minimal"
          icon="ArrowRight"
          iconPosition="trailing"
          iconBackground="teachersHighlight"
          onClick={() => onClick(props)}
          iconOnlyOnMobile
        />
      </Flex>
    </Flex>
  );
};

export default BioCardListItem;
