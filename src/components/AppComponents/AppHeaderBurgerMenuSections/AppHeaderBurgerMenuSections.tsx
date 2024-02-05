import { FC } from "react";
import { OakHeading, OakLI } from "@oaknational/oak-components";

import AppHeaderBurgerMenuLink, {
  BurgerMenuLink,
} from "@/components/AppComponents/AppHeaderBurgerMenuLink";
import { FlexList } from "@/components/SharedComponents/Typography/UL";
import Flex from "@/components/SharedComponents/Flex";

/**
 * New menu sections to be used in the hamburger menu for the beta site
 */

export type AppHeaderBurgerMenuSection = {
  header: string;
  links: Array<BurgerMenuLink>;
};

export type AppHeaderBurgerMenuSectionsProps = {
  menuSections: Array<AppHeaderBurgerMenuSection>;
};

const AppHeaderBurgerMenuSections: FC<AppHeaderBurgerMenuSectionsProps> = (
  props,
) => {
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
          <OakHeading tag="h4" $font="heading-4">
            {section.header}
          </OakHeading>
          <FlexList
            $reset={true}
            role="list"
            $display="flex"
            $flexDirection="column"
            $gap={4}
          >
            {section.links.map((link, i) => (
              <OakLI $listStyle="none" key={`${link.text}-${i}`}>
                <AppHeaderBurgerMenuLink link={link} />
              </OakLI>
            ))}
          </FlexList>
        </Flex>
      ))}
    </Flex>
  );
};

export default AppHeaderBurgerMenuSections;
