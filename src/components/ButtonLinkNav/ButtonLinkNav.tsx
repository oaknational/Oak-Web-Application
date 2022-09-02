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
              />
            </Box>
            <Flex $flexDirection={"row"} $display={["flex", "none"]}>
              {selected === button.label && (
                <Flex $alignItems={"center"}>
                  <Icon
                    $ml={4}
                    $color={"black"}
                    variant={"minimal"}
                    name={"ArrowRight"}
                  />
                </Flex>
              )}
              <ButtonAsLink
                variant={"minimal"}
                label={button.label}
                href={button.href}
                $mr={[0, 36]}
                disabled={selected === button.label}
              />
            </Flex>
          </Fragment>
        ))}
      </Flex>
    </nav>
  );
};

export default ButtonLinkNav;
