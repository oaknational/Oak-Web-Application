import React, { FC } from "react";

import Flex from "../Flex";
import { Span } from "../Typography";
import IconButtonAsLink from "../Button/IconButtonAsLink";
import { ResolveOakHrefProps } from "../../common-lib/urls";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  nextPageLinkProps?: ResolveOakHrefProps;
  prevPageLinkProps?: ResolveOakHrefProps;
};

const Pagination: FC<PaginationProps> = ({
  totalPages,
  currentPage,
  nextPageLinkProps = { page: null, href: "" },
  prevPageLinkProps = { page: null, href: "" },
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
          icon={"ChevronLeft"}
          background={"teachersHighlight"}
          scroll={false}
          disabled={currentPage === 1}
          {...prevPageLinkProps}
        />
        <Span $mh={24} $font={"body-2"}>
          page {currentPage} / {totalPages}
        </Span>
        <IconButtonAsLink
          size="small"
          aria-label="next page"
          icon={"ChevronRight"}
          background={"teachersHighlight"}
          scroll={false}
          disabled={currentPage >= totalPages}
          {...nextPageLinkProps}
        />
      </Flex>
    </nav>
  );
};

export default Pagination;
