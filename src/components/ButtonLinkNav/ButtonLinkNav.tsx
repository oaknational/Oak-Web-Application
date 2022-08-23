import { FC, Fragment } from "react";

import Box from "../Box";
import ButtonAsLink from "../Button/ButtonAsLink";
import Flex, { FlexProps } from "../Flex";
import Icon from "../Icon";

type ButtonLinkNavProps = {
  buttons: { label: string; href: string }[];
  selected: string;
} & FlexProps;

const ButtonLinkNav: FC<ButtonLinkNavProps> = ({
  buttons,
  selected,
  ...props
}) => {
  return (
    <nav>
      <Flex
        $flexWrap={"wrap"}
        $alignItems={["flex-start"]}
        $flexDirection={["column", "row"]}
        {...props}
      >
        {buttons.map((button) => (
          <Fragment key={button.label}>
            {/* Add responsive button icon and variant */}
            <Box $display={["none", "block"]}>
              <ButtonAsLink
                variant={selected === button.label ? "minimal" : "brush"}
                label={button.label}
                href={button.href}
                $mr={[0, 36]}
                disabled={selected === button.label}
              ></ButtonAsLink>
            </Box>
            <Flex $flexDirection={"row"} $display={["flex", "none"]}>
              <ButtonAsLink
                variant={"minimal"}
                label={button.label}
                href={button.href}
                $mr={[0, 36]}
                disabled={selected === button.label}
              />
              {selected === button.label && (
                <Flex $alignItems={"center"}>
                  <Icon
                    $ml={4}
                    $color={"white"}
                    variant="brush"
                    name={"ChevronLeft"}
                  ></Icon>
                </Flex>
              )}
            </Flex>
          </Fragment>
        ))}
      </Flex>
    </nav>
  );
};

export default ButtonLinkNav;
