import { encode } from "querystring";

import { useRouter } from "next/router";
import { useMemo, useRef } from "react";

import { PaginationProps } from "./Pagination";

type Items<T> = { items: T[] };

export type UsePaginationProps = {
  totalResults: number;
  pageSize: number;
};

const usePagination = <T>(
  props: UsePaginationProps & Items<T>
): { currentPageItems: T[] } & UsePaginationProps & PaginationProps => {
  const { pageSize, totalResults, items } = props;
  const totalPages = Math.ceil(totalResults / pageSize);
  const router = useRouter();
  const { page: pageRaw } = router.query;
  const pageString = (Array.isArray(pageRaw) ? pageRaw[0] : pageRaw) || "";
  const pageNumber = Math.max(Math.min(parseInt(pageString), totalPages), 1);

  const currentPage = isNaN(pageNumber) ? 1 : pageNumber;

  const nextPageParams = new URLSearchParams(encode(router.query));
  nextPageParams.set("page", (currentPage + 1).toString());

  const prevPageParams = new URLSearchParams(encode(router.query));
  prevPageParams.set("page", (currentPage - 1).toString());

  const isLastPage = currentPage === totalPages;
  const isFirstPage = currentPage === 1;

  const pathname = router.pathname;

  const currentPageItems = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return items.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, items, pageSize]);

  const firstItemRef = useRef<HTMLAnchorElement | null>(null);

  return {
    pageSize,
    currentPage,
    currentPageItems,
    totalPages,
    totalResults,
    firstItemRef,
    nextPageUrlObject: isLastPage
      ? { pathname: router.asPath }
      : { pathname: pathname, query: Object.fromEntries(nextPageParams) },
    prevPageUrlObject: isFirstPage
      ? { pathname: router.asPath }
      : { pathname: pathname, query: Object.fromEntries(prevPageParams) },
  };
};

export default usePagination;
