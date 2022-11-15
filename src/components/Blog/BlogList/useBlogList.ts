import { isPast } from "date-fns";
import { useMemo } from "react";

import isUpcomingWebinar from "../../../utils/isUpcomingWebinar";
import usePagination from "../../Pagination/usePagination";

import { BlogListProps } from "./BlogList";
import { BlogListItemProps } from "./BlogListItem";

const PAGE_SIZE = 4;

type PropsAddedByHook = "upcomingItem" | "currentPageItems" | "paginationProps";
export type UseBlogListProps = Omit<BlogListProps, PropsAddedByHook> & {
  items: BlogListItemProps[];
};
const useBlogList = (props: UseBlogListProps): BlogListProps => {
  const { items, ...rest } = props;

  const allUpcomingItems = items
    .filter(isUpcomingWebinar)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  // soonest upcoming item
  const upcomingItem = allUpcomingItems[0];
  const pastItems = useMemo(
    () =>
      items.filter((item) =>
        // @todo isPast and isFuture can throw
        isPast(new Date(item.date))
      ),
    [items]
  );

  const paginationProps = usePagination({
    totalResults: pastItems.length,
    pageSize: PAGE_SIZE,
  });
  const { currentPage } = paginationProps;
  const currentPageItems: Array<BlogListItemProps> = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;
    return pastItems.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, pastItems]);

  return {
    upcomingItem,
    currentPageItems,
    paginationProps,
    ...rest,
  };
};

export default useBlogList;
