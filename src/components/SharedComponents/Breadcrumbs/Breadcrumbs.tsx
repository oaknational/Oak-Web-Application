import { FC } from "react";
import styled from "styled-components";
import { OakUL, OakIcon } from "@oaknational/oak-components";

import { BreadcrumbJsonLd } from "@/browser-lib/seo/getJsonLd";
import OwaLink from "@/components/SharedComponents/OwaLink";
import { MaybeOakHref, ResolveOakHrefProps } from "@/common-lib/urls";
import ellipsis from "@/styles/ellipsis";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";

const BreadcrumbsNav = styled.nav`
  display: flex;
  min-width: 0;
`;

const BreadcrumbUL = styled(OakUL)`
  display: flex;
  flex-wrap: wrap;
`;

const BreadcrumbsLi = styled.li`
  display: flex;
  align-items: center;
  min-width: 0;
  flex-shrink: 0;
  max-width: 100%;

  &:last-of-type {
    flex-shrink: 2;
  }
`;

const BreadcrumbConstrainer = styled.div`
  margin-right: 12px;
  ${ellipsis}
`;

export type Breadcrumb = {
  label: string;
  disabled?: boolean;
  oakLinkProps:
    | {
        /**
         * To encourage the use of 'page' prop (which will get resolved to an href)
         * you must pass page={null} when passing 'href' directly
         */
        page: null;
        href: MaybeOakHref;
      }
    | ResolveOakHrefProps;
};

export type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
  skipToId?: string;
};

const Breadcrumbs: FC<BreadcrumbsProps> = ({ breadcrumbs, skipToId }) => {
  return (
    <>
      {" "}
      <BreadcrumbJsonLd itemListElements={breadcrumbs} />
      {skipToId && <SkipLink href={`#${skipToId}`}>Skip to content</SkipLink>}
      <BreadcrumbsNav aria-label="Breadcrumb">
        <BreadcrumbUL $reset $minWidth={0}>
          {breadcrumbs.map((breadcrumb, i) => {
            const { label, disabled, oakLinkProps } = breadcrumb;
            return (
              <BreadcrumbsLi key={`${i}-${label}`}>
                {i !== 0 && (
                  <OakIcon
                    iconName="chevron-right"
                    $colorFilter={"grey60"}
                    $mr={"space-between-xs"}
                    $width={"all-spacing-5"}
                    $height={"all-spacing-5"}
                  />
                )}
                <BreadcrumbConstrainer>
                  {disabled ? (
                    <>{label}</>
                  ) : (
                    <OwaLink {...oakLinkProps}>{label}</OwaLink>
                  )}
                </BreadcrumbConstrainer>
              </BreadcrumbsLi>
            );
          })}
        </BreadcrumbUL>
      </BreadcrumbsNav>
    </>
  );
};

export default Breadcrumbs;
