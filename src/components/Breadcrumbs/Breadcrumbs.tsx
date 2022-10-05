import { FC } from "react";
import Link from "next/link";
import styled from "styled-components";

import { BreadcrumbJsonLd } from "../../browser-lib/seo/getJsonLd";
import Icon from "../Icon";
import Typography from "../Typography";

const BreadcrumbsNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
`;

const BreadcrumbsOl = styled.ol`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const BreadcrumbsLi = styled.li`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  max-width: 100%;
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
    <>
      <BreadcrumbJsonLd itemListElements={breadcrumbs} />
      <BreadcrumbsNav aria-label="Breadcrumb">
        <BreadcrumbsOl>
          {breadcrumbs.map((breadcrumb, i) => {
            const { href, label, disabled } = breadcrumb;
            return (
              <BreadcrumbsLi key={`${i}-${href}`}>
                {i !== 0 && (
                  <Icon
                    name="ChevronRight"
                    size={20}
                    $color={"teachersHighlight"}
                  />
                )}
                <Typography $font={"body-3"}>
                  {disabled ? (
                    <span>{label}</span>
                  ) : (
                    <Link href={href}>{label}</Link>
                  )}
                </Typography>
              </BreadcrumbsLi>
            );
          })}
        </BreadcrumbsOl>
      </BreadcrumbsNav>
    </>
  );
};

export default Breadcrumbs;
