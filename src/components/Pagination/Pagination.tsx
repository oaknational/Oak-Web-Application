import React, { FC } from "react";

import Flex from "../Flex";
import { P } from "../Typography";
import IconButtonAsLink from "../Button/IconButtonAsLink";

type PaginationProps = {
  totalPages: number;
  pageSize: number;
  nextPageUrl: string | undefined;
  prevPageUrl: string | undefined;
  currentPage: number;
};

const Pagination: FC<PaginationProps> = ({
  totalPages,
  currentPage,
  nextPageUrl = "",
  prevPageUrl = "",
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
          href={prevPageUrl}
          icon={"ChevronLeft"}
          background={"teachersHighlight"}
          nextLinkProps={{ scroll: false }}
          disabled={currentPage === 1}
        />
        <P $mh={24} $font={"body-2"}>
          page {currentPage} / {totalPages}
        </P>
        <IconButtonAsLink
          size="small"
          aria-label="next page"
          href={nextPageUrl}
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
