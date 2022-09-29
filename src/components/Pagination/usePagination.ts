import { useRouter } from "next/router";

import isBrowser from "../../utils/isBrowser";

type UsePageNumberProps = {
  totalResults: number;
  pageSize: number;
};
const usePagination = (props: UsePageNumberProps) => {
  const { pageSize, totalResults } = props;
  const router = useRouter();
  const { page: pageRaw } = router.query;
  const pageString = (Array.isArray(pageRaw) ? pageRaw[0] : pageRaw) || "";
  const pageNumber = parseInt(pageString);

  const currentPage = isNaN(pageNumber) ? 1 : pageNumber;

  const totalPages = Math.ceil(totalResults / pageSize);

  const nextPageParams = new URLSearchParams(
    isBrowser ? window.location.search : ""
  );
  nextPageParams.delete("page");
  nextPageParams.append("page", (currentPage + 1).toString());

  const prevPageParams = new URLSearchParams(
    isBrowser ? window.location.search : ""
  );
  prevPageParams.delete("page");
  prevPageParams.append("page", (currentPage - 1).toString());

  const isLastPage = currentPage === totalPages;
  const isFirstPage = currentPage === 1;

  return {
    pageSize,
    currentPage,
    totalPages,
    nextPageUrl: isLastPage ? undefined : `?${nextPageParams.toString()}`,
    prevPageUrl: isFirstPage ? undefined : `?${prevPageParams.toString()}`,
  };
};

export default usePagination;
