import { FC } from "react";

import LayoutFixedHeader from "@/components/AppComponents/LayoutFixedHeader";
import Logo from "@/components/AppComponents/Logo";
import { CTA } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import OwaLink from "@/components/SharedComponents/OwaLink";
import Icon from "@/components/SharedComponents/Icon";
import Typography from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";

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
      <Flex
        $alignItems={"center"}
        $width={"100%"}
        $justifyContent={"space-between"}
      >
        <OwaLink page={"home"}>
          <Logo variant="with text" height={48} width={104} />
        </OwaLink>
        {props.headerCta?.linkType && (
          <OwaLink page={null} href={getLinkHref(props.headerCta)}>
            <Flex
              $width={[200, "100%"]}
              $justifyContent={"flex-end"}
              $alignItems={"center"}
            >
              <Typography $textAlign="right" $font={"heading-7"}>
                {props.headerCta.label}
              </Typography>
              <Icon
                $ml={12}
                aria-label={"arrow-right"}
                name={"arrow-right"}
                $background={"blue"}
                $color={"white"}
                variant={"brush"}
                size={28}
              />
            </Flex>
          </OwaLink>
        )}
      </Flex>
    </LayoutFixedHeader>
  );
};

export default LayoutLandingPagesHeader;
