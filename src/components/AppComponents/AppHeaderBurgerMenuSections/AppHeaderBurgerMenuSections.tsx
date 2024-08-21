import { FC } from "react";
import {
  OakHeading,
  OakLI,
  OakFlex,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import AppHeaderBurgerMenuLink, {
  BurgerMenuLink,
} from "@/components/AppComponents/AppHeaderBurgerMenuLink";
import { useFeatureFlaggedClerk } from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

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
  const clerk = useFeatureFlaggedClerk();

  return (
    <OakFlex $flexDirection="column" $gap="all-spacing-7">
      <clerk.SignedIn>
        <clerk.SignOutButton>
          <OakSecondaryButton>Sign out</OakSecondaryButton>
        </clerk.SignOutButton>
      </clerk.SignedIn>
      {burgerMenuSections.map((section, i) => (
        <OakFlex
          $flexDirection="column"
          $gap="all-spacing-3"
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
            $gap="all-spacing-1"
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
