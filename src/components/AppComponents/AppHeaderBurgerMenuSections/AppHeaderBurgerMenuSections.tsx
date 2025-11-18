import { FC } from "react";
import { OakHeading, OakLI, OakFlex } from "@oaknational/oak-components";

import AppHeaderBurgerMenuLink, {
  BurgerMenuLink,
} from "@/components/AppComponents/AppHeaderBurgerMenuLink";

/**
 * New menu sections to be used in the hamburger menu for the beta site
 */

export type AppHeaderBurgerMenuSection = {
  header: string;
  links: Array<BurgerMenuLink>;
};

export type AppHeaderBurgerburgerMenuSectionsProps = {
  burgerMenuSections: Array<AppHeaderBurgerMenuSection>;
};

const AppHeaderBurgerburgerMenuSections: FC<
  AppHeaderBurgerburgerMenuSectionsProps
> = (props) => {
  const { burgerMenuSections } = props;

  return (
    <OakFlex $flexDirection="column" $gap="spacing-32">
      {burgerMenuSections.map((section, i) => (
        <OakFlex
          $flexDirection="column"
          $gap="spacing-12"
          data-testid="menu-section"
          key={`menu-item-${i}`}
        >
          <OakHeading tag="h4" $font="heading-4">
            {section.header}
          </OakHeading>
          <OakFlex
            as="ul"
            role="list"
            $display="flex"
            $flexDirection="column"
            $gap="spacing-4"
          >
            {section.links.map((link, i) => (
              <OakLI $listStyle="none" key={`${link.text}-${i}`}>
                <AppHeaderBurgerMenuLink link={link} />
              </OakLI>
            ))}
          </OakFlex>
        </OakFlex>
      ))}
    </OakFlex>
  );
};

export default AppHeaderBurgerburgerMenuSections;
