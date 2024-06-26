import Router, { useRouter } from "next/router";
import { resolveHref } from "next/dist/client/resolve-href";
import React, { FC, RefObject, useEffect } from "react";
import { OakSpan, OakFlex } from "@oaknational/oak-components";

import IconButtonAsLink from "@/components/SharedComponents/Button/IconButtonAsLink";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  prevPageUrlObject?: Parameters<typeof resolveHref>[1];
  nextPageUrlObject?: Parameters<typeof resolveHref>[1];
  firstItemRef?: RefObject<HTMLAnchorElement> | null;
  paginationTitle?: string;
};

const Pagination: FC<PaginationProps & { pageName: string }> = ({
  totalPages,
  currentPage,
  prevPageUrlObject = "",
  nextPageUrlObject = "",
  firstItemRef,
  pageName,
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

  const previousPageLabel =
    currentPage === 1
      ? "No previous pages"
      : `${pageName} page ${currentPage - 1}`;
  const nextPageLabel =
    currentPage === totalPages
      ? "No further pages"
      : `${pageName} page ${currentPage + 1}`;

  return (
    <nav data-testid={"pagination"} aria-label="pagination">
      <OakFlex $alignItems={"center"} $justifyContent={"center"}>
        <IconButtonAsLink
          size="small"
          aria-label={previousPageLabel}
          page={null}
          href={prevHref}
          icon={"chevron-left"}
          background={"blue"}
          scroll={false}
          disabled={currentPage === 1}
        />
        <OakSpan $mh={"space-between-m"} $font={"body-2"}>
          page {currentPage} / {totalPages}
        </OakSpan>
        <IconButtonAsLink
          size="small"
          aria-label={nextPageLabel}
          page={null}
          href={nextHref}
          icon={"chevron-right"}
          background={"blue"}
          scroll={false}
          disabled={currentPage >= totalPages}
        />
      </OakFlex>
    </nav>
  );
};

export default Pagination;
