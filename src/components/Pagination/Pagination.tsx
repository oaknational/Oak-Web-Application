import Router, { useRouter } from "next/router";
import { resolveHref } from "next/dist/shared/lib/router/utils/resolve-href";
import React, { FC, RefObject, useEffect } from "react";

import Flex from "../Flex";
import { Span } from "../Typography";
import IconButtonAsLink from "../Button/IconButtonAsLink";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  prevPageUrlObject?: Parameters<typeof resolveHref>[1];
  nextPageUrlObject?: Parameters<typeof resolveHref>[1];
  firstItemRef?: RefObject<HTMLAnchorElement> | null;
  paginationTitle?: string;
};

const Pagination: FC<PaginationProps> = ({
  totalPages,
  currentPage,
  prevPageUrlObject = "",
  nextPageUrlObject = "",
  firstItemRef,
}) => {
  const router = useRouter();
  useEffect(() => {
    if (router.query.page && firstItemRef?.current) {
      firstItemRef.current.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [firstItemRef, router.query.page]);

  if (currentPage === 0 || totalPages < 2) {
    return null;
  }

  const [, prevHref = ""] = resolveHref(Router, prevPageUrlObject, true);
  const [, nextHref = ""] = resolveHref(Router, nextPageUrlObject, true);

  return (
    <nav data-testid={"pagination"} aria-label="pagination">
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
