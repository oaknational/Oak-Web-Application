import { FC } from "react";
import styled from "styled-components";
import { OakUL, OakIcon, OakSecondaryLink } from "@oaknational/oak-components";

import { BreadcrumbJsonLd } from "@/browser-lib/seo/getJsonLd";
import ellipsis from "@/styles/ellipsis";

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
  href: string;
};

export type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
};

const Breadcrumbs: FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <>
      {" "}
      <BreadcrumbJsonLd itemListElements={breadcrumbs} />
      <BreadcrumbsNav aria-label="Breadcrumb">
        <BreadcrumbUL $reset $minWidth={0}>
          {breadcrumbs.map((breadcrumb, i) => {
            const { label, disabled, href } = breadcrumb;
            return (
              <BreadcrumbsLi key={`${i}-${label}`}>
                {i !== 0 && (
                  <OakIcon
                    iconName="chevron-right"
                    $colorFilter={"icon-subdued"}
                    $mr={"spacing-12"}
                    $width={"spacing-20"}
                    $height={"spacing-20"}
                  />
                )}
                <BreadcrumbConstrainer>
                  {disabled ? (
                    <>{label}</>
                  ) : (
                    <OakSecondaryLink href={href}>{label}</OakSecondaryLink>
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
