import { FC } from "react";

import { Heading, LI } from "../Typography";
import Flex from "../Flex/Flex";
import { FlexList } from "../Typography/UL";

import NewMenuLink from "./NewMenuLink";
import { BetaMenuSections } from "./types";

/**
 * New menu secionts to be used in the hamburger menu for the beta site
 */

export type NewMenuSectionsProps = {
  menuSections: BetaMenuSections;
};

const NewMenuSections: FC<NewMenuSectionsProps> = (props) => {
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
                <NewMenuLink link={link} />
              </LI>
            ))}
          </FlexList>
        </Flex>
      ))}
    </Flex>
  );
};

export default NewMenuSections;
