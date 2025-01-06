import { FC } from "react";
import { OakTypography, OakFlex, OakIcon } from "@oaknational/oak-components";

import LayoutFixedHeader from "@/components/AppComponents/LayoutFixedHeader";
import Logo from "@/components/AppComponents/Logo";
import { CTA } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import OwaLink from "@/components/SharedComponents/OwaLink";

export type LayoutLandingPagesHeaderProps = {
  headerCta?: CTA | null;
};
/**
 * Header for CMS landing pages
 * Optional headerCta prop
 *
 */
const LayoutLandingPagesHeader: FC<LayoutLandingPagesHeaderProps> = (props) => {
  return (
    <LayoutFixedHeader $background={"white"}>
      <OakFlex
        $alignItems={"center"}
        $width={"100%"}
        $justifyContent={"space-between"}
      >
        <OwaLink page={"home"}>
          <Logo variant="with text" height={48} width={104} />
        </OwaLink>
        {props.headerCta?.linkType && (
          <OwaLink page={null} href={getLinkHref(props.headerCta)}>
            <OakFlex
              $width={["all-spacing-19", "100%"]}
              $justifyContent={"flex-end"}
              $alignItems={"center"}
            >
              <OakTypography $textAlign="right" $font={"heading-7"}>
                {props.headerCta.label}
              </OakTypography>
              {/* @todo where to find this  */}
              <OakIcon
                iconName="arrow-right"
                $ml={"space-between-xs"}
                $background={"blue"}
                aria-label={"arrow-right"}
                $colorFilter={"white"}
                $width={"all-spacing-6"}
              />
            </OakFlex>
          </OwaLink>
        )}
      </OakFlex>
    </LayoutFixedHeader>
  );
};

export default LayoutLandingPagesHeader;
