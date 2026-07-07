import Link from "next/link";
import { FC } from "react";
import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakHeadingTag,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import Cover from "@/components/SharedComponents/Cover";
import Illustration from "@/components/SharedComponents/Illustration";

export type UpcomingWebinarWallProps = {
  headingTag?: OakHeadingTag;
  headingText: string;
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
    buttonSuffixA11y,
  } = props;
  return (
    <Cover
      $ph={"spacing-16"}
      $font={["body-3", "body-2"]}
      $textAlign="center"
      $flexDirection="column"
      $justifyContent="center"
      $alignItems="center"
      $background="bg-primary"
      $overflow="hidden"
    >
      <OakBox $maxWidth="spacing-360" $zIndex="in-front">
        <OakHeading tag={headingTag} $font={["heading-6", "heading-5"]}>
          {headingText}
        </OakHeading>
        <OakTertiaryButton
          $mt={"spacing-24"}
          element={Link}
          iconName="arrow-right"
          isTrailingIcon
          href={buttonHref}
          aria-label={`${buttonText} ${buttonSuffixA11y}`}
        >
          {buttonText}
        </OakTertiaryButton>
      </OakBox>
      <OakGrid
        $right="spacing-0"
        $bottom="spacing-0"
        $height="100%"
        $width="100%"
        $position="absolute"
      >
        <OakGridArea $colSpan={6} $colStart={7} $position="relative">
          <Illustration
            slug={"magic-carpet"}
            $objectFit="contain"
            $opacity={0.2}
            $objectPosition={"bottom right"}
            cropRect={[0, 0, 401, 289]}
            fill
          />
        </OakGridArea>
      </OakGrid>
    </Cover>
  );
};

export default UpcomingWebinarWall;
