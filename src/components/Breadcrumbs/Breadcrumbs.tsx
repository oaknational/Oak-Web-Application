import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import { BreadcrumbJsonLd } from "../../browser-lib/seo/getJsonLd";
import Icon from "../Icon";
import UL from "../Typography/UL";
import ellipsis from "../../styles/ellipsis";
import Box from "../Box";

const BreadcrumbsNav = styled.nav`
  display: flex;
  min-width: 0;
`;

const BreadcrumbUL = styled(UL)`
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
  href: string;
  label: string;
  disabled?: boolean;
};
export type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
};
const Breadcrumbs: FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <Box $mv={[24, 48]}>
      {" "}
      <BreadcrumbJsonLd itemListElements={breadcrumbs} />
      <BreadcrumbsNav aria-label="Breadcrumb">
        <BreadcrumbUL $reset $minWidth={0}>
          {breadcrumbs.map((breadcrumb, i) => {
            const { href, label, disabled } = breadcrumb;
            return (
              <BreadcrumbsLi key={`${i}-${href}`}>
                {i !== 0 && (
                  <Icon
                    name="chevron-right"
                    size={20}
                    $color={"oakGrey4"}
                    $mr={12}
                  />
                )}
                <BreadcrumbConstrainer>
                  {disabled ? <>{label}</> : <Link href={href}>{label}</Link>}
                </BreadcrumbConstrainer>
              </BreadcrumbsLi>
            );
          })}
        </BreadcrumbUL>
      </BreadcrumbsNav>
    </Box>
  );
};

export default Breadcrumbs;
