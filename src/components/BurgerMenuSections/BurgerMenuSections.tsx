import { FC } from "react";

import { Heading, LI } from "../Typography";
import Flex from "../Flex/Flex";
import { FlexList } from "../Typography/UL";

import BurgerMenuLink from "./BurgerMenuLink";
import { BurgerMenuSections } from "./types";

/**
 * New menu sections to be used in the hamburger menu for the beta site
 */

export type BurgerMenuSectionsProps = {
  menuSections: BurgerMenuSections;
};

const BurgerMenuSections: FC<BurgerMenuSectionsProps> = (props) => {
  const { menuSections } = props;
  return (
    <Flex $flexDirection="column" $gap={32}>
      {menuSections.map((section) => (
        <Flex $flexDirection="column" $gap={12} data-testid="menu-section">
          <Heading tag="h4" $font="heading-4">
            {section.header}
          </Heading>
          <FlexList
            $reset={true}
            role="list"
            $display="flex"
            $flexDirection="column"
            $gap={4}
          >
            {section.links.map((link, i) => (
              <LI listStyle="none" key={`${link.text}-${i}`}>
                <BurgerMenuLink link={link} />
              </LI>
            ))}
          </FlexList>
        </Flex>
      ))}
    </Flex>
  );
};

export default BurgerMenuSections;
