import { UrlObject } from "url";

import React, { FC } from "react";

import Flex from "../Flex";
import { Span } from "../Typography";
import IconButtonAsLink from "../Button/IconButtonAsLink";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  nextPageHref?: UrlObject | string;
  prevPageHref?: UrlObject | string;
};

const Pagination: FC<PaginationProps> = ({
  totalPages,
  currentPage,
  nextPageHref = "",
  prevPageHref = "",
}) => {
  if (currentPage === 0 || totalPages < 2) {
    return null;
  }

  return (
    <nav aria-label="pagination">
      <Flex $alignItems={"center"} $justifyContent={"center"}>
        <IconButtonAsLink
          size="small"
          aria-label="previous page"
          href={prevPageHref}
          icon={"ChevronLeft"}
          background={"teachersHighlight"}
          nextLinkProps={{ scroll: false }}
          disabled={currentPage === 1}
        />
        <Span $mh={24} $font={"body-2"}>
          page {currentPage} / {totalPages}
        </Span>
        <IconButtonAsLink
          size="small"
          aria-label="next page"
          href={nextPageHref}
          icon={"ChevronRight"}
          background={"teachersHighlight"}
          nextLinkProps={{ scroll: false }}
          disabled={currentPage >= totalPages}
        />
      </Flex>
    </nav>
  );
};

export default Pagination;
