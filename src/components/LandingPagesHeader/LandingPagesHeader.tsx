import { FC } from "react";
import Link from "next/link";

import Flex from "../Flex";
import FixedHeader from "../FixedHeader";
import Logo from "../Logo";
import Typography from "../Typography";
import Icon from "../Icon";

export type LandingPagesHeaderProps = {
  headerTitle?: string;
  headerCta?: string;
};

const LandingPagesHeader: FC<LandingPagesHeaderProps> = (props) => {
  return (
    <FixedHeader $background={"white"}>
      <Flex
        $alignItems={"center"}
        $width={"100%"}
        $justifyContent={"space-between"}
      >
        <Link href={"/"}>
          <a>
            <Logo title={"Oak National Academy"} height={48} width={104} />
          </a>
        </Link>
        <Link href={props.headerCta || "/"}>
          <a>
            <Flex
              $width={[200, "100%"]}
              $justifyContent={"flex-end"}
              $alignItems={"center"}
            >
              <Typography
                $textAlign="right"
                $fontFamily={"heading"}
                $fontSize={16}
              >
                {props.headerTitle || "Oak National Academy"}
              </Typography>
              <Icon
                $ml={12}
                aria-label={"arrow-right"}
                name={"ArrowRight"}
                $background={"teachersHighlight"}
                $color={"white"}
                variant={"brush"}
                size={28}
              />
            </Flex>
          </a>
        </Link>
      </Flex>
    </FixedHeader>
  );
};

export default LandingPagesHeader;
