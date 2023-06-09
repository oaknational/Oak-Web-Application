import Router from "next/router";
import { resolveHref } from "next/dist/shared/lib/router/utils/resolve-href";
import React, { FC } from "react";

import Flex from "../Flex";
import { Span } from "../Typography";
import IconButtonAsLink from "../Button/IconButtonAsLink";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  prevPageUrlObject?: Parameters<typeof resolveHref>[1];
  nextPageUrlObject?: Parameters<typeof resolveHref>[1];
  paginationTitle?: string;
};

const Pagination: FC<PaginationProps> = ({
  totalPages,
  currentPage,
  prevPageUrlObject = "",
  nextPageUrlObject = "",
}) => {
  if (currentPage === 0 || totalPages < 2) {
    return null;
  }

  const [, prevHref = ""] = resolveHref(Router, prevPageUrlObject, true);
  const [, nextHref = ""] = resolveHref(Router, nextPageUrlObject, true);

  return (
    <nav aria-label="pagination">
      <Flex $alignItems={"center"} $justifyContent={"center"}>
        <IconButtonAsLink
          size="small"
          aria-label="previous page"
          page={null}
          href={prevHref}
          icon={"chevron-left"}
          background={"teachersHighlight"}
          scroll={false}
          disabled={currentPage === 1}
        />
        <Span $mh={24} $font={"body-2"}>
          page {currentPage} / {totalPages}
        </Span>
        <IconButtonAsLink
          size="small"
          aria-label="next page"
          page={null}
          href={nextHref}
          icon={"chevron-right"}
          background={"teachersHighlight"}
          scroll={false}
          disabled={currentPage >= totalPages}
        />
      </Flex>
    </nav>
  );
};

export default Pagination;
