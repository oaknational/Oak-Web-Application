import React, { FC } from "react";

import Flex from "../Flex";
import IconButton from "../Button/IconButton";
import { P } from "../Typography";

type PaginationProps = {
  onPageChange: (pageNumber: number) => void | PaginationProps;
  totalCount: number;
  pageSize: number;
  currentPage: number;
};

const Pagination: FC<PaginationProps> = ({
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const totalPageCount = Math.ceil(totalCount / pageSize);

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  if (currentPage === 0 || totalPageCount < 2) {
    return null;
  }

  return (
    <nav aria-label="pagination">
      <Flex $alignItems={"center"} $justifyContent={"center"}>
        <IconButton
          size="small"
          aria-label="previous page"
          onClick={onPrevious}
          icon={"ChevronLeft"}
          background={"teachersHighlight"}
          disabled={currentPage === 1}
        />
        <P $mh={24} $font={"body-2"}>
          page {currentPage} / {totalPageCount}
        </P>
        <IconButton
          size="small"
          aria-label="next page"
          onClick={onNext}
          icon={"ChevronRight"}
          background={"teachersHighlight"}
          disabled={currentPage >= totalPageCount}
        />
      </Flex>
    </nav>
  );
};

export default Pagination;
