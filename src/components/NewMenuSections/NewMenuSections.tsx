import { FC } from "react";

import { Heading, UL } from "../Typography";
import Flex from "../Flex/Flex";

import NewMenuLink, { BetaMenuLink } from "./NewMenuLink";

/**
 * New menu links to be used in the hamburger menu for the beta site
 */
// TODO: move to types file
type BetaMenuSection = {
  header: string;
  links: Array<BetaMenuLink>;
};

export type BetaMenuSections = Array<BetaMenuSection>;

export type NewMenuLinksProps = {
  menuSections: BetaMenuSections;
};

const NewMenuLinks: FC<NewMenuLinksProps> = (props) => {
  const { menuSections } = props;
  return (
    <Flex $flexDirection="column" $gap={32}>
      {menuSections.map((section) => (
        <Flex $flexDirection="column" $gap={12} data-testid="menu-section">
          <Heading tag="h4" $font="heading-4">
            {section.header}
          </Heading>
          <UL $reset={true} role="list">
            <Flex $flexDirection="column" $gap={4}>
              {section.links.map((link) => (
                <NewMenuLink link={link} />
              ))}
            </Flex>
          </UL>
        </Flex>
      ))}
    </Flex>
  );
};

export default NewMenuLinks;
