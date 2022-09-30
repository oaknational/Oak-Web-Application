import { encode } from "querystring";

import { useRouter } from "next/router";

import { PaginationProps } from "./Pagination";

type UsePaginationProps = {
  totalResults: number;
  pageSize: number;
};
type UsePaginationReturnType = UsePaginationProps & PaginationProps;
const usePagination = (props: UsePaginationProps): UsePaginationReturnType => {
  const { pageSize, totalResults } = props;
  const router = useRouter();
  const { page: pageRaw } = router.query;
  const pageString = (Array.isArray(pageRaw) ? pageRaw[0] : pageRaw) || "";
  const pageNumber = parseInt(pageString);

  const currentPage = isNaN(pageNumber) ? 1 : pageNumber;

  const totalPages = Math.ceil(totalResults / pageSize);

  const nextPageParams = new URLSearchParams(encode(router.query));
  nextPageParams.set("page", (currentPage + 1).toString());

  const prevPageParams = new URLSearchParams(encode(router.query));
  prevPageParams.set("page", (currentPage - 1).toString());

  const isLastPage = currentPage === totalPages;
  const isFirstPage = currentPage === 1;

  const pathname = router.pathname;

  return {
    pageSize,
    currentPage,
    totalPages,
    totalResults,
    nextPageHref: isLastPage
      ? { pathname: router.asPath }
      : { pathname: pathname, query: Object.fromEntries(nextPageParams) },
    prevPageHref: isFirstPage
      ? { pathname: router.asPath }
      : { pathname: pathname, query: Object.fromEntries(prevPageParams) },
  };
};

export default usePagination;
