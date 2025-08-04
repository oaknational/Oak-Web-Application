import { encode } from "querystring";

import Router, { useRouter } from "next/router";
import { RefObject, useMemo, useRef } from "react";
import { resolveHref } from "next/dist/client/resolve-href";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  prevPageUrlObject?: Parameters<typeof resolveHref>[1];
  nextPageUrlObject?: Parameters<typeof resolveHref>[1];
  firstItemRef?: RefObject<HTMLAnchorElement> | null;
  paginationTitle?: string;
  prevHref: string;
  nextHref: string;
  isFirstPage: boolean;
  isLastPage: boolean;
  paginationRoute: string;
  onPageChange: (page: number) => void;
};

type Items<T> = { items: T[] };

export type UsePaginationProps = {
  totalResults: number;
  pageSize: number;
};

const usePagination = <T>(
  props: UsePaginationProps & Items<T>,
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
  const { ...currentQuery } = router.query;

  const currentPageItems = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return items.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, items, pageSize]);

  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const paginationTitle =
    totalPages > 1 ? ` | Page ${currentPage} of ${totalPages}` : "";
  const nextPageUrlObject = isLastPage
    ? { pathname: router.asPath }
    : { pathname: pathname, query: Object.fromEntries(nextPageParams) };
  const prevPageUrlObject = isFirstPage
    ? { pathname: router.asPath }
    : { pathname: pathname, query: Object.fromEntries(prevPageParams) };
  const [, prevHref = ""] = resolveHref(Router, prevPageUrlObject || "", true);
  const [, nextHref = ""] = resolveHref(Router, nextPageUrlObject || "", true);

  const paginationRoute = router.asPath?.split("?")[0] ?? router.asPath;
  const onPageChange = (page: number) => {
    router
      .push(
        {
          pathname: router.pathname,
          query: { ...currentQuery, page },
        },
        undefined,
        { shallow: true, scroll: false },
      )
      .then(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        firstItemRef.current?.focus();
      });
  };

  return {
    paginationTitle,
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
    prevHref,
    nextHref,
    isFirstPage,
    isLastPage,
    paginationRoute,
    onPageChange,
  };
};

export default usePagination;
