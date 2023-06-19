import { isPast } from "date-fns";
import { useMemo } from "react";

import isUpcomingWebinar from "../../../utils/isUpcomingWebinar";
import usePagination from "../../Pagination/usePagination";

import { PostListProps } from "./PostList";
import { PostListItemProps } from "./PostListItem";

export const PAGE_SIZE = 4;

type PropsAddedByHook = "upcomingItem" | "currentPageItems" | "paginationProps";
export type UsePostListProps = Omit<PostListProps, PropsAddedByHook> & {
  items: PostListItemProps[];
};
const usePostList = (props: UsePostListProps): PostListProps => {
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
    items: pastItems,
  });
  const { currentPageItems } = paginationProps;

  return {
    upcomingItem,
    currentPageItems,
    paginationProps,
    ...rest,
  };
};

export default usePostList;
