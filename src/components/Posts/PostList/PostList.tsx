import { FC } from "react";

import Flex from "../../Flex";
import Pagination, { PaginationProps } from "../../Pagination";
import { Hr, LI, UL } from "../../Typography";
import Box from "../../Box";
import config from "../../../config/browser";

import UpcomingWebinarListItem from "./UpcomingWebinarListItem";
import PostListItem, { PostListItemProps } from "./PostListItem";

export type PostListProps = {
  upcomingItem?: PostListItemProps;
  currentPageItems: PostListItemProps[];
  paginationProps: PaginationProps;
  /**
   * adds image to each item
   */
  withImage?: boolean;
  /**
   * adds 'hr's above the first and below the last item.
   */
  withContainingHrs?: boolean;
  /**
   * adds pagination controls below the last item
   */
  withPagination?: boolean;
  /**
   * whether to show the upcoming item (only relevant to webinars)
   */
  withUpcomingItem?: boolean;
};
/**
 * Contains a list of PostListItem with dividers between them. Optionally
 * displays an upcoming webinar at the top.
 *
 * ## Usage
 *
 * Use `usePostList()` to get props to pass to `<PostList />`
 */
const PostList: FC<PostListProps> = (props) => {
  const {
    upcomingItem,
    currentPageItems,
    paginationProps,
    withImage,
    withContainingHrs,
    withPagination,
    withUpcomingItem,
  } = props;

  const { firstItemRef } = paginationProps;

  return (
    <Flex
      $flexDirection="column"
      $alignItems="flex-start"
      $minHeight={[0, 840]}
    >
      {withContainingHrs && <Hr thickness={4} $mt={0} $mb={32} />}

      {withUpcomingItem && upcomingItem && (
        <>
          <UpcomingWebinarListItem
            {...upcomingItem}
            signUpHref={config.get("webinarSignUpUrl")}
            signUpOnClick={() => null}
          />
          {withContainingHrs && <Hr thickness={4} $mv={32} />}
        </>
      )}
      {currentPageItems.length ? (
        <>
          <UL $reset>
            {currentPageItems.map((item, i) => (
              <LI key={`PostList-PostListItem-${i}`}>
                {i !== 0 && <Hr thickness={4} $mv={32} />}
                <PostListItem
                  {...item}
                  withImage={withImage}
                  firstItemRef={i === 0 ? firstItemRef : null}
                />
              </LI>
            ))}
          </UL>
          {withContainingHrs && <Hr thickness={4} $mt={32} $mb={0} />}
        </>
      ) : null}
      {withPagination && (
        <Box $width="100%" $mt={[0, "auto"]} $pt={48}>
          <Pagination {...paginationProps} />
        </Box>
      )}
    </Flex>
  );
};

export default PostList;
