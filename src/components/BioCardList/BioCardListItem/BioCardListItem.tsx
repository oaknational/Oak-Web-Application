import { FC } from "react";

import {
  SanityImageAsset,
  TeamMemberSocialsFragment,
} from "../../../node-lib/sanity-graphql/generated/sdk";
// import useClickableCard from "../../../hooks/useClickableCard";
import AvatarImage from "../../AvatarImage";
// import Button from "../../Button";
import Flex from "../../Flex";
// import SocialButtons from "../../SocialButtons";
import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders";
import { Heading, P } from "../../Typography";

export type BioCardListItemProps = {
  name: string;
  role?: string | null;
  image?: SanityImageAsset | null;
  socials?: TeamMemberSocialsFragment | null;
};
const BioCardListItem: FC<BioCardListItemProps> = (props) => {
  const { name, role, image } = props;
  // const { containerProps, primaryTargetProps } =
  //   useClickableCard<HTMLButtonElement>();

  return (
    <Flex
      // {...containerProps}
      $position="relative"
      $background="white"
      $pa={16}
      $flexDirection="column"
      $height={"100%"}
    >
      <BoxBorders gapPosition="rightTop" />
      <Flex $alignItems={"flex-start"}>
        <AvatarImage image={image} $mr={12} size={[56, 72]} />
        <Flex
          // $mr={[0, 40]}
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
      {/* {socials && (
        <Flex $justifyContent="space-between" $mt={24}>
          <SocialButtons
            size="tiny"
            linkedIn={socials.linkedinUrl}
            twitter={socials.twitterUsername}
          />
          <Button
          {...primaryTargetProps}
          label="See bio"
          variant="minimal"
          icon="ArrowRight"
          iconPosition="trailing"
          iconBackground="teachersHighlight"
        />
        </Flex>
      )} */}
    </Flex>
  );
};

export default BioCardListItem;
