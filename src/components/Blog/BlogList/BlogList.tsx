import { FC } from "react";

import Flex from "../../Flex";
import Pagination, { PaginationProps } from "../../Pagination";
import { Hr, LI, UL } from "../../Typography";
import Box from "../../Box";

import UpcomingWebinarListItem from "./UpcomingWebinarListItem";
import BlogListItem, { BlogListItemProps } from "./BlogListItem";

export type BlogListProps = {
  upcomingItem?: BlogListItemProps;
  currentPageItems: BlogListItemProps[];
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
 * Contains a list of BlogListItem with dividers between them. Optionally
 * displays an upcoming webinar at the top.
 *
 * ## Usage
 *
 * Use `useBlogList()` to get props to pass to `<BlogList />`
 */
const BlogList: FC<BlogListProps> = (props) => {
  const {
    upcomingItem,
    currentPageItems,
    paginationProps,
    withImage,
    withContainingHrs,
    withPagination,
    withUpcomingItem,
  } = props;

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
            signUpHref="https://share.hsforms.com/1USsrkazESq2Il8lxUx_vPgbvumd"
            signUpOnClick={() => null}
          />
          {withContainingHrs && <Hr thickness={4} $mv={32} />}
        </>
      )}
      {currentPageItems.length ? (
        <>
          <UL $reset>
            {currentPageItems.map((item, i) => (
              <LI key={`BlogList-BlogListItem-${i}`}>
                {i !== 0 && <Hr thickness={4} $mv={32} />}
                <BlogListItem {...item} withImage={withImage} />
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

export default BlogList;
