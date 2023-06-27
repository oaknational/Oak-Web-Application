import { FC } from "react";

import Flex from "../Flex";
import FixedHeader from "../FixedHeader";
import Logo from "../Logo";
import Typography from "../Typography";
import Icon from "../Icon";
import { CTA } from "../../common-lib/cms-types";
import { getLinkHref } from "../../utils/portableText/resolveInternalHref";
import OakLink from "../OakLink";

export type LandingPagesHeaderProps = {
  headerCta?: CTA | null;
};
/**
 * Header for CMS landing pages
 * Optional headerCta prop
 *
 */
const LandingPagesHeader: FC<LandingPagesHeaderProps> = (props) => {
  return (
    <FixedHeader $background={"white"}>
      <Flex
        $alignItems={"center"}
        $width={"100%"}
        $justifyContent={"space-between"}
      >
        <OakLink page={"home"} viewType={null}>
          <Logo height={48} width={104} />
        </OakLink>
        {props.headerCta?.linkType && (
          <OakLink page={null} href={getLinkHref(props.headerCta)}>
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
                $background={"teachersHighlight"}
                $color={"white"}
                variant={"brush"}
                size={28}
              />
            </Flex>
          </OakLink>
        )}
      </Flex>
    </FixedHeader>
  );
};

export default LandingPagesHeader;
