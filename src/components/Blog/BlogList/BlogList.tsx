import { FC, useMemo } from "react";
import { isPast } from "date-fns";

import isFutureWebinar from "../../../utils/isUpcomingWebinar";
import Flex from "../../Flex";
import { Pagination } from "../../Pagination";
import { Hr, LI, UL } from "../../Typography";
import usePagination from "../../Pagination/usePagination";
import Box from "../../Box";

import UpcomingWebinarListItem from "./UpcomingWebinarListItem";
import BlogListItem, { BlogListItemProps } from "./BlogListItem";

const PAGE_SIZE = 4;

export type BlogListProps = {
  items: BlogListItemProps[];
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
 * Contains a list of BlogListItem with dividers between them.
 */
const BlogList: FC<BlogListProps> = (props) => {
  const {
    items,
    withImage,
    withContainingHrs,
    withPagination,
    withUpcomingItem,
  } = props;

  const paginationProps = usePagination({
    totalResults: items.length,
    pageSize: PAGE_SIZE,
  });

  const { currentPage } = paginationProps;

  const [upcomingItem] = items.filter(isFutureWebinar);
  const pastItems = useMemo(
    () =>
      items.filter((item) =>
        // @todo isPast and isFuture can throw
        isPast(new Date(item.date))
      ),
    [items]
  );

  const currentTableData: Array<BlogListItemProps> = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;
    return pastItems.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, pastItems]);

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
      <UL $reset>
        {currentTableData.map((item, i) => (
          <LI key={`BlogList-BlogListItem-${i}`}>
            {i !== 0 && <Hr thickness={4} $mv={32} />}
            <BlogListItem {...item} withImage={withImage} />
          </LI>
        ))}
      </UL>
      {withContainingHrs && <Hr thickness={4} $mt={32} $mb={0} />}
      {withPagination && (
        <Box $width="100%" $mt={[0, "auto"]} $pt={48}>
          <Pagination {...paginationProps} />
        </Box>
      )}
    </Flex>
  );
};

export default BlogList;
