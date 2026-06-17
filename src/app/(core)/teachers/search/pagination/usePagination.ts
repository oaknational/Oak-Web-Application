import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RefObject, useMemo, useRef } from "react";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  prevPageUrlObject?: { pathname: string; query?: Record<string, string> };
  nextPageUrlObject?: { pathname: string; query?: Record<string, string> };
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

const toHref = (pathname: string, params: URLSearchParams) => {
  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
};

const usePagination = <T>(
  props: UsePaginationProps & Items<T>,
): { currentPageItems: T[] } & UsePaginationProps & PaginationProps => {
  const { pageSize, totalResults, items } = props;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();

  const pageRaw = searchParams?.get("page") ?? "";
  const parsedPage = Number.parseInt(pageRaw, 10);
  const currentPage = Number.isNaN(parsedPage)
    ? 1
    : Math.max(1, Math.min(parsedPage, totalPages));

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const currentPageItems = useMemo(() => {
    const first = (currentPage - 1) * pageSize;
    const last = first + pageSize;
    return items.slice(first, last);
  }, [currentPage, items, pageSize]);

  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const paginationTitle =
    totalPages > 1 ? ` | Page ${currentPage} of ${totalPages}` : "";

  const baseParams = new URLSearchParams(searchParams?.toString() ?? "");

  const prevParams = new URLSearchParams(baseParams);
  if (currentPage - 1 <= 1) {
    prevParams.delete("page");
  } else {
    prevParams.set("page", String(currentPage - 1));
  }

  const nextParams = new URLSearchParams(baseParams);
  nextParams.set("page", String(currentPage + 1));

  const prevHref = isFirstPage
    ? toHref(pathname, baseParams)
    : toHref(pathname, prevParams);
  const nextHref = isLastPage
    ? toHref(pathname, baseParams)
    : toHref(pathname, nextParams);

  const prevPageUrlObject = isFirstPage
    ? { pathname, query: Object.fromEntries(baseParams) }
    : { pathname, query: Object.fromEntries(prevParams) };

  const nextPageUrlObject = isLastPage
    ? { pathname, query: Object.fromEntries(baseParams) }
    : { pathname, query: Object.fromEntries(nextParams) };

  const onPageChange = (page: number) => {
    const bounded = Math.max(1, Math.min(page, totalPages));
    const params = new URLSearchParams(baseParams);

    if (bounded <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(bounded));
    }

    router.push(toHref(pathname, params));

    // Keep your current UX
    window.scrollTo({ top: 0, behavior: "smooth" });
    firstItemRef.current?.focus();
  };

  return {
    paginationTitle,
    pageSize,
    currentPage,
    currentPageItems,
    totalPages,
    totalResults,
    firstItemRef,
    nextPageUrlObject,
    prevPageUrlObject,
    prevHref,
    nextHref,
    isFirstPage,
    isLastPage,
    paginationRoute: pathname,
    onPageChange,
  };
};

export default usePagination;
