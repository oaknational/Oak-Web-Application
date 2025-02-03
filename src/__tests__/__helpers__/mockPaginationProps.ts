import { vi } from "vitest";

import {
  PaginationProps,
  UsePaginationProps,
} from "@/components/SharedComponents/Pagination/usePagination";

export const mockPaginationProps: PaginationProps & UsePaginationProps = {
  totalPages: 25,
  currentPage: 1,
  firstItemRef: null,
  paginationTitle: " | Page 1 of 25",
  prevPageUrlObject: { pathname: "/prev" },
  nextPageUrlObject: { pathname: "/next" },
  prevHref: "/prev",
  nextHref: "/next",
  pageSize: 5,
  totalResults: 125,
  isFirstPage: true,
  isLastPage: false,
  paginationRoute: "/current-path",
  onPageChange: vi.fn(),
};
