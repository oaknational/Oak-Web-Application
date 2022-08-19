import { FC, Fragment } from "react";

import Box from "../Box";
import ButtonAsLink from "../Button/ButtonAsLink";
import Flex, { FlexProps } from "../Flex";
import Icon from "../Icon";

type ButtonLinkNavProps = {
  buttons: { label: string; href: string; selected: boolean }[];
} & FlexProps;

const ButtonLinkNav: FC<ButtonLinkNavProps> = ({ buttons, ...props }) => {
  return (
    <Flex
      $alignItems={["flex-start"]}
      $flexDirection={["column", "row"]}
      {...props}
    >
      {buttons.map((button) => (
        <Fragment key={button.label}>
          {/* Add responsive button icon and variant */}
          <Box $display={["none", "block"]}>
            <ButtonAsLink
              variant={button.selected ? "minimal" : "brush"}
              label={button.label}
              href={button.href}
              $mr={[0, 36]}
              disabled={button.selected}
            ></ButtonAsLink>
          </Box>
          <Flex $flexDirection={"row"} $display={["flex", "none"]}>
            <ButtonAsLink
              variant={"minimal"}
              label={button.label}
              href={button.href}
              $mr={[0, 36]}
              disabled={button.selected}
            />
            {button.selected && (
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
  );
};

export default ButtonLinkNav;
