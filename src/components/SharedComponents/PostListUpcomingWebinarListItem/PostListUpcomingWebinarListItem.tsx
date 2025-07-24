import { FC } from "react";
import { useHover } from "react-aria";
import {
  OakBox,
  OakHeading,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import ScreenReaderOnly from "../ScreenReaderOnly";

import LineClamp from "@/components/SharedComponents/LineClamp";
import OwaLink from "@/components/SharedComponents/OwaLink";
import formatDate from "@/utils/formatDate";
import { PostListItemProps } from "@/components/SharedComponents/PostListItem";
import useClickableCard from "@/hooks/useClickableCard";
import Flex from "@/components/SharedComponents/Flex.deprecated";

type PostListUpcomingWebinarListItemProps = PostListItemProps & {
  signUpHref: string;
  signUpOnClick: () => void;
};

/**
 * Preview component for an upcoming webinar. Includes a link to the holding
 * page, and a link to the webinar participation 'sign up' form.
 *
 * ## Usage
 *
 * On the webinar listing page, it sits above the list of past webinars, on the
 * first page.
 *
 * ## Caveats
 *
 * If an invalid date is provided, text "Invalid Date" is displayed.
 */
const PostListUpcomingWebinarListItem: FC<
  PostListUpcomingWebinarListItemProps
> = (props) => {
  const { titleTag, title, date, summary, slug, signUpHref, signUpOnClick } =
    props;
  const {
    containerProps,
    primaryTargetProps,
    isHovered: cardIsHovered,
  } = useClickableCard<HTMLAnchorElement>();
  const { hoverProps: buttonHoverProps, isHovered: buttonIsHovered } = useHover(
    {},
  );
  return (
    <Flex
      {...containerProps}
      $position={"relative"}
      $flexDirection={["column", "row"]}
      $alignItems={["flex-start", "center"]}
      $width={"100%"}
      $font={["body-4", "body-3"]}
    >
      <OakBox $mr="auto">
        <OakP>Coming soon, {formatDate(date, { month: "short" })}</OakP>
        <OakHeading
          tag={titleTag}
          $font={["heading-6", "heading-5"]}
          $mt={"space-between-ssx"}
        >
          <OwaLink
            {...primaryTargetProps}
            page={"webinar-single"}
            webinarSlug={slug}
            $focusStyles={["underline"]}
            $isHovered={cardIsHovered && !buttonIsHovered}
          >
            {title}
          </OwaLink>
        </OakHeading>
        <OakP $mt="space-between-ssx">
          <LineClamp lines={2}>{summary}</LineClamp>
        </OakP>
      </OakBox>
      <OakBox
        $mt={["space-between-m2", "space-between-none"]}
        $ml={["space-between-none", "space-between-l"]}
      >
        <OakPrimaryButton
          {...buttonHoverProps}
          onClick={signUpOnClick}
          element="a"
          target="_blank"
          href={signUpHref}
          iconName="chevron-right"
          isTrailingIcon={true}
        >
          Save my place
          <ScreenReaderOnly>{`on the webinar: ${title}`}</ScreenReaderOnly>
        </OakPrimaryButton>
      </OakBox>
    </Flex>
  );
};

export default PostListUpcomingWebinarListItem;
