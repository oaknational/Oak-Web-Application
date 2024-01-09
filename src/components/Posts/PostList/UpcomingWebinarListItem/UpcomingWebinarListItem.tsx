import { FC } from "react";
import { useHover } from "react-aria";

import LineClamp from "@/components/SharedComponents/LineClamp";
import OakLink from "@/components/OakLink";
import formatDate from "@/utils/formatDate";
import { PostListItemProps } from "@/components/Posts/PostList/PostListItem";
import useClickableCard from "@/hooks/useClickableCard";
import { Heading, P } from "@/components/SharedComponents/Typography";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";

type UpcomingWebinarListItemProps = PostListItemProps & {
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
const UpcomingWebinarListItem: FC<UpcomingWebinarListItemProps> = (props) => {
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
      <Box $mr="auto">
        <P>Coming soon, {formatDate(date, { month: "short" })}</P>
        <Heading tag={titleTag} $font={["heading-6", "heading-5"]} $mt={8}>
          <OakLink
            {...primaryTargetProps}
            page={"webinar-single"}
            webinarSlug={slug}
            $focusStyles={["underline"]}
            $isHovered={cardIsHovered && !buttonIsHovered}
          >
            {title}
          </OakLink>
        </Heading>
        <P $mt={8}>
          <LineClamp lines={2}>{summary}</LineClamp>
        </P>
      </Box>
      <ButtonAsLink
        {...buttonHoverProps}
        $mt={[28, 0]}
        $ml={[0, 48]}
        background="blue"
        htmlAnchorProps={{ onClick: signUpOnClick, target: "_blank" }}
        page={null}
        href={signUpHref}
        label="Save my place"
        labelSuffixA11y={`on the webinar: ${title}`}
        icon="chevron-right"
        $iconPosition="trailing"
      />
    </Flex>
  );
};

export default UpcomingWebinarListItem;
