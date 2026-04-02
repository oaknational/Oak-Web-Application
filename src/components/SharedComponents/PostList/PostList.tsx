import { FC } from "react";
import {
  OakLI,
  OakPagination,
  OakUL,
  OakHandDrawnHR,
  OakBox,
} from "@oaknational/oak-components";

import UpcomingWebinarListItem from "../PostListUpcomingWebinarListItem";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import PostListItem, {
  PostListItemProps,
} from "@/components/SharedComponents/PostListItem";
import { PaginationProps } from "@/components/SharedComponents/Pagination/usePagination";
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

  const { firstItemRef, paginationRoute } = paginationProps;
  const blogsOrWebinars =
    currentPageItems[0]?.contentType === "blog-post" ? "Blogs" : "Webinars";

  return (
    <Flex
      $flexDirection="column"
      $alignItems="flex-start"
      $minHeight={[0, 840]}
    >
      {withContainingHrs && (
        <OakHandDrawnHR
          $height={"spacing-4"}
          $width={"100%"}
          $mt={"spacing-0"}
          $mb={"spacing-32"}
        />
      )}
      {withUpcomingItem && upcomingItem && (
        <>
          <UpcomingWebinarListItem
            {...upcomingItem}
            signUpHref={getBrowserConfig("webinarSignUpUrl")}
            signUpOnClick={() => null}
          />
          {withContainingHrs && (
            <OakHandDrawnHR
              $width={"100%"}
              $height={"spacing-4"}
              $mv={"spacing-32"}
            />
          )}
        </>
      )}
      {currentPageItems.length ? (
        <>
          <OakUL $reset $width={"100%"}>
            {currentPageItems.map((item, i) => (
              <OakLI key={`PostList-PostListItem-${i}`}>
                {i !== 0 && (
                  <OakHandDrawnHR
                    $width={"100%"}
                    $height={"spacing-4"}
                    $mv={"spacing-32"}
                  />
                )}
                <PostListItem
                  {...item}
                  withImage={withImage}
                  firstItemRef={i === 0 ? firstItemRef : null}
                  showImageOnTablet={showImageOnTablet}
                />
              </OakLI>
            ))}
          </OakUL>
          {withContainingHrs && (
            <OakHandDrawnHR
              $width={"100%"}
              $height={"spacing-4"}
              $mt={"spacing-32"}
              $mb={"spacing-0"}
            />
          )}
        </>
      ) : null}
      {withPagination && (
        <OakBox $width="100%" $mt={["spacing-0", "auto"]} $pt={"spacing-48"}>
          <OakPagination
            {...paginationProps}
            pageName={blogsOrWebinars}
            paginationHref={paginationRoute}
          />
        </OakBox>
      )}
    </Flex>
  );
};

export default PostList;
