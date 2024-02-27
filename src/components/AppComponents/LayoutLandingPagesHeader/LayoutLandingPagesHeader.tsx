import { FC } from "react";
import { OakTypography, OakFlex } from "@oaknational/oak-components";

import LayoutFixedHeader from "@/components/AppComponents/LayoutFixedHeader";
import Logo from "@/components/AppComponents/Logo";
import { CTA } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import OwaLink from "@/components/SharedComponents/OwaLink";
import Icon from "@/components/SharedComponents/Icon";

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
              <Icon
                $ml={12}
                aria-label={"arrow-right"}
                name={"arrow-right"}
                $background={"blue"}
                $color={"white"}
                variant={"brush"}
                size={28}
              />
            </OakFlex>
          </OwaLink>
        )}
      </OakFlex>
    </LayoutFixedHeader>
  );
};

export default LayoutLandingPagesHeader;
