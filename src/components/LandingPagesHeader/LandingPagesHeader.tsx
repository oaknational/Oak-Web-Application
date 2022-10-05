import { FC } from "react";
import Link from "next/link";

import Flex from "../Flex";
import FixedHeader from "../FixedHeader";
import Logo from "../Logo";
import Typography from "../Typography";
import Icon from "../Icon";

export const anchorMap = {
  formBlock: "form-block",
} as const;

export type AnchorMap = keyof typeof anchorMap | null;

export type LandingPagesHeaderProps = {
  label?: string;
  anchor?: AnchorMap;
};

const LandingPagesHeader: FC<LandingPagesHeaderProps> = ({ label, anchor }) => {
  const buttonAnchor = anchor ? anchorMap[anchor] : null;
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
        {buttonAnchor && label && (
          <Link href={buttonAnchor}>
            <a>
              <Flex
                $width={[200, "100%"]}
                $justifyContent={"flex-end"}
                $alignItems={"center"}
              >
                <Typography $textAlign="right" $font={"heading-7"}>
                  {label}
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
        )}
      </Flex>
    </FixedHeader>
  );
};

export default LandingPagesHeader;
