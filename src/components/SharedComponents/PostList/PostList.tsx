import { FC } from "react";
import { OakLI, OakUL } from "@oaknational/oak-components";

import UpcomingWebinarListItem from "../PostListUpcomingWebinarListItem";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import PostListItem, {
  PostListItemProps,
} from "@/components/SharedComponents/PostListItem";
import { Hr } from "@/components/SharedComponents/Typography";
import Pagination, {
  PaginationProps,
} from "@/components/SharedComponents/Pagination";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";

export type PostListProps = {
  upcomingItem?: PostListItemProps;
  currentPageItems: PostListItemProps[];
  paginationProps: PaginationProps;
  showImageOnTablet?: boolean;
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
    showImageOnTablet,
  } = props;

  const { firstItemRef } = paginationProps;
  const blogsOrWebinars =
    currentPageItems[0]?.contentType === "blog-post" ? "Blogs" : "Webinars";
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
            signUpHref={getBrowserConfig("webinarSignUpUrl")}
            signUpOnClick={() => null}
          />
          {withContainingHrs && <Hr thickness={4} $mv={32} />}
        </>
      )}
      {currentPageItems.length ? (
        <>
          <OakUL $reset $width={"100%"}>
            {currentPageItems.map((item, i) => (
              <OakLI key={`PostList-PostListItem-${i}`}>
                {i !== 0 && <Hr thickness={4} $mv={32} />}
                <PostListItem
                  {...item}
                  withImage={withImage}
                  firstItemRef={i === 0 ? firstItemRef : null}
                  showImageOnTablet={showImageOnTablet}
                />
              </OakLI>
            ))}
          </OakUL>
          {withContainingHrs && <Hr thickness={4} $mt={32} $mb={0} />}
        </>
      ) : null}
      {withPagination && (
        <Box $width="100%" $mt={[0, "auto"]} $pt={48}>
          <Pagination pageName={blogsOrWebinars} {...paginationProps} />
        </Box>
      )}
    </Flex>
  );
};

export default PostList;
