import { FC } from "react";
import {
  OakFlex,
  OakLink,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import LayoutFixedHeader from "@/components/AppComponents/LayoutFixedHeader";
import Logo from "@/components/AppComponents/Logo";
import { CTA } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import { resolveOakHref } from "@/common-lib/urls";

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
    <LayoutFixedHeader $background={"bg-primary"}>
      <OakFlex
        $alignItems={"center"}
        $width={"100%"}
        $justifyContent={"space-between"}
      >
        <OakLink href={resolveOakHref({ page: "home" })}>
          <Logo variant="with text" height={48} width={104} />
        </OakLink>
        {props.headerCta?.linkType && (
          <OakTertiaryButton
            element={"a"}
            href={getLinkHref(props.headerCta)}
            iconName={"arrow-right"}
            isTrailingIcon
          >
            {props.headerCta.label}
          </OakTertiaryButton>
        )}
      </OakFlex>
    </LayoutFixedHeader>
  );
};

export default LayoutLandingPagesHeader;
