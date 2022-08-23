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
    if (currentPage < totalPageCount) {
      onPageChange(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  if (currentPage === 0 || totalPageCount < 2) {
    return null;
  }

  return (
    <Flex $alignItems={"center"} $mt={[48, "auto"]} $justifyContent={"right"}>
      <IconButton
        aria-label="previous"
        onClick={onPrevious}
        icon={"ChevronLeft"}
        background={"teachersHighlight"}
      />
      <P $mh={24} $fontSize={16} $lineHeight={"24px"}>
        page {currentPage}/{totalPageCount}
      </P>
      <IconButton
        aria-label="next"
        onClick={onNext}
        icon={"ChevronRight"}
        background={"teachersHighlight"}
      />
    </Flex>
  );
};

export default Pagination;
