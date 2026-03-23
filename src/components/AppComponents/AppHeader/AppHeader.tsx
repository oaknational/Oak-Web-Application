import { FC, useRef } from "react";
import {
  OakBox,
  OakFlex,
  OakLink,
  OakSecondaryLink,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";
import styled from "styled-components";

import TeacherAccountButton from "@/components/TeacherComponents/TeacherAccountButton/TeacherAccountButton";
import { resolveOakHref } from "@/common-lib/urls";
import Logo from "@/components/AppComponents/Logo";
import { HeaderProps } from "@/components/AppComponents/Layout/Layout";
import { AppHeaderMenu } from "@/components/AppComponents/AppHeaderMenu";
import { useMenuContext } from "@/context/Menu";
import AppHeaderBurgerMenuSections from "@/components/AppComponents/AppHeaderBurgerMenuSections";
import IconButton from "@/components/SharedComponents/Button/IconButton";
import { StyledHeader } from "@/components/AppComponents/StyledHeader";
import { AppHeaderUnderline } from "@/components/AppComponents/AppHeaderUnderline";
import { burgerMenuSections } from "@/browser-lib/fixtures/burgerMenuSections";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useSelectedArea from "@/hooks/useSelectedArea";
import { SaveCount } from "@/components/TeacherComponents/SaveCount/SaveCount";

export const siteAreas = {
  teachers: "TEACHERS",
  pupils: "PUPILS",
} as const;

export type SelectedArea = (typeof siteAreas)[keyof typeof siteAreas];

const StyledOakLink = styled(OakLink)`
  display: block;
`;

/**
 * Header for logging in and using search -
 * header for the app, not a landing page
 *
 */
const AppHeader: FC<HeaderProps> = () => {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { openMenu, open } = useMenuContext();
  const { track } = useAnalytics();
  const selectedArea = useSelectedArea();
  const router = useRouter();

  return (
    <header>
      <StyledHeader
        $background="bg-primary"
        $justifyContent={["space-between"]}
        $alignItems={["center"]}
        $zIndex="fixed-header"
        $position={"relative"}
        data-testid="app-header"
      >
        <OakFlex
          $flexGrow={1}
          $alignItems={"center"}
          $gap={["spacing-0", "spacing-16"]}
        >
          <OakFlex
            $justifyContent={"center"}
            $alignItems={"center"}
            $display={["none", "block"]}
          >
            <StyledOakLink href={resolveOakHref({ page: "home" })}>
              <Logo variant="with text" height={48} width={104} color="black" />
            </StyledOakLink>
          </OakFlex>
          <OakFlex
            $alignItems={"center"}
            $gap={["spacing-0", "spacing-24"]}
            $font="heading-7"
            $width="100%"
            $justifyContent={["space-between", "end"]}
          >
            <OakBox $display={["block", "none"]}>
              <StyledOakLink href={resolveOakHref({ page: "home" })}>
                <Logo
                  height={24}
                  width={24}
                  variant="without text"
                  color="black"
                />
              </StyledOakLink>
            </OakBox>
            {selectedArea == siteAreas.teachers && <SaveCount />}
            <TeacherAccountButton
              selectedArea={selectedArea}
              onboardingRedirectUrl={resolveOakHref({
                page: "onboarding",
                query: { returnTo: router.asPath },
              })}
              buttonVariant="secondary"
            />
            <OakSecondaryLink
              href={resolveOakHref({ page: "teachers-home-page" })}
              aria-current={selectedArea !== siteAreas.pupils}
            >
              Teachers
              {/* If reverting to app header uncomment the following and add ActiveLinkUnderline */}
              {/* {selectedArea == siteAreas.teachers && (
                <ActiveLinkUnderline
                  name="horizontal-rule"
                  $width="100%"
                  $height={"spacing-8"}
                />
              )} */}
            </OakSecondaryLink>
            <OakFlex $alignItems="center" $gap="spacing-4">
              <OakSecondaryLink
                href={resolveOakHref({ page: "pupil-year-index" })}
                onClick={() =>
                  track.classroomSelected({ navigatedFrom: "header" })
                }
                aria-label="Pupils browse years"
                aria-current={selectedArea == siteAreas.pupils}
              >
                Pupils
                {/* If reverting to app header uncomment the following and add ActiveLinkUnderline */}
                {/* {selectedArea == siteAreas.pupils && (
                  <ActiveLinkUnderline
                    name="horizontal-rule"
                    $width="100%"
                    $height={"spacing-8"}
                  />
                )} */}
              </OakSecondaryLink>
            </OakFlex>
            <IconButton
              aria-label="Menu"
              icon={"hamburger"}
              variant={"minimal"}
              size={"large"}
              ref={menuButtonRef}
              onClick={openMenu}
              aria-expanded={open}
            />
          </OakFlex>
        </OakFlex>
        <AppHeaderUnderline />
      </StyledHeader>
      <AppHeaderMenu menuButtonRef={menuButtonRef}>
        <AppHeaderBurgerMenuSections burgerMenuSections={burgerMenuSections} />
      </AppHeaderMenu>
    </header>
  );
};

export default AppHeader;
