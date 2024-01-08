import { FC } from "react";

import BurgerMenuLinkButton from "./BurgerMenuLink";
import { BurgerMenuSection } from "./types";

import { FlexList } from "@/components/SharedComponents/Typography/UL";
import { Heading, LI } from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";

/**
 * New menu sections to be used in the hamburger menu for the beta site
 */

export type BurgerMenuSectionsProps = {
  menuSections: Array<BurgerMenuSection>;
};

const BurgerMenuSections: FC<BurgerMenuSectionsProps> = (props) => {
  const { menuSections } = props;
  return (
    <Flex $flexDirection="column" $gap={32}>
      {menuSections.map((section, i) => (
        <Flex
          $flexDirection="column"
          $gap={12}
          data-testid="menu-section"
          key={`menu-item-${i}`}
        >
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
                <BurgerMenuLinkButton link={link} />
              </LI>
            ))}
          </FlexList>
        </Flex>
      ))}
    </Flex>
  );
};

export default BurgerMenuSections;
