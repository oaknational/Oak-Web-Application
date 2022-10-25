import { FC, useMemo } from "react";

import Flex from "../../Flex";
import { Pagination } from "../../Pagination";
import { Hr, LI, UL } from "../../Typography";
import usePagination from "../../Pagination/usePagination";
import Box from "../../Box";

import BlogListItem, { BlogListItemProps } from "./BlogListItem";

const PAGE_SIZE = 4;

export type BlogListProps = {
  items: BlogListItemProps[];
  withImage?: boolean;
  withContainingHrs?: boolean;
  withPagination?: boolean;
};
/**
 * Contains a title of set size and a list of BlogListItem,
 * with dividers between them.
 */
const BlogList: FC<BlogListProps> = (props) => {
  const { items, withImage, withContainingHrs, withPagination } = props;

  const paginationProps = usePagination({
    totalResults: items.length,
    pageSize: PAGE_SIZE,
  });

  const { currentPage } = paginationProps;

  const currentTableData: Array<BlogListItemProps> = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;
    return items.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, items]);

  return (
    <Flex
      $flexDirection="column"
      $alignItems="flex-start"
      $minHeight={[0, 840]}
    >
      {withContainingHrs && <Hr thickness={4} $mt={0} $mb={32} />}
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
