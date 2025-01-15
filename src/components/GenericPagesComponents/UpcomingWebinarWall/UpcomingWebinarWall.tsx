import { FC } from "react";
import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakHeadingTag,
} from "@oaknational/oak-components";

import Illustration from "@/components/SharedComponents/Illustration";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex.deprecated";

export type UpcomingWebinarWallProps = {
  headingTag?: OakHeadingTag;
  headingText: string;
  buttonOnClick: () => void;
  buttonHref: string;
  buttonText: string;
  buttonSuffixA11y: string;
};

/**
 * Visual component that goes where the webinar video would be.
 *
 * ## Usage
 *
 * Place in a relatively positioned container which has implicit width and
 * height.
 *
 */
const UpcomingWebinarWall: FC<UpcomingWebinarWallProps> = (props) => {
  const {
    headingTag = "h2",
    headingText,
    buttonText,
    buttonHref,
    buttonOnClick,
    buttonSuffixA11y,
  } = props;
  return (
    <Flex
      $ph={16}
      $font={["body-3", "body-2"]}
      $textAlign="center"
      $flexDirection="column"
      $justifyContent="center"
      $alignItems="center"
      $background="white"
      $overflow="hidden"
      $cover
    >
      <OakBox $maxWidth="all-spacing-20" $zIndex="in-front">
        <OakHeading tag={headingTag} $font={["heading-6", "heading-5"]}>
          {headingText}
        </OakHeading>
        <ButtonAsLink
          $mt={28}
          background="blue"
          htmlAnchorProps={{ onClick: buttonOnClick, target: "_blank" }}
          page={null}
          href={buttonHref}
          label={buttonText}
          labelSuffixA11y={buttonSuffixA11y}
          icon="chevron-right"
          $iconPosition="trailing"
        />
      </OakBox>

      <OakGrid
        $right="all-spacing-0"
        $bottom="all-spacing-0"
        $height="100%"
        $width="100%"
        $position="absolute"
      >
        <OakGridArea $colSpan={6} $colStart={7} $position="relative">
          <Illustration
            slug={"magic-carpet"}
            $objectFit="contain"
            $objectPosition={"bottom right"}
            $opacity={0.2}
            cropRect={[0, 0, 401, 289]}
            fill
          />
        </OakGridArea>
      </OakGrid>
    </Flex>
  );
};

export default UpcomingWebinarWall;
