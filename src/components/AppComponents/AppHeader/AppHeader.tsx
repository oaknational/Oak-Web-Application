import { FC, useRef } from "react";
import {
  OakBox,
  oakColorTokens,
  OakFlex,
  OakSmallSecondaryButton,
} from "@oaknational/oak-components";
import { UserButton, useUser, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/router";

import { resolveOakHref } from "../../../common-lib/urls";

import Logo from "@/components/AppComponents/Logo";
import { HeaderProps } from "@/components/AppComponents/Layout/Layout";
import OwaLink from "@/components/SharedComponents/OwaLink";
import { AppHeaderMenu } from "@/components/AppComponents/AppHeaderMenu";
import { useMenuContext } from "@/context/Menu";
import AppHeaderBurgerMenuSections from "@/components/AppComponents/AppHeaderBurgerMenuSections";
import { ActiveLinkUnderline } from "@/components/SharedComponents/OwaLink/OwaLink";
import IconButton from "@/components/SharedComponents/Button/IconButton";
import { StyledHeader } from "@/components/AppComponents/StyledHeader";
import { AppHeaderUnderline } from "@/components/AppComponents/AppHeaderUnderline";
import { burgerMenuSections } from "@/browser-lib/fixtures/burgerMenuSections";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useSelectedArea from "@/hooks/useSelectedArea";
import { getBreakpoint } from "@/styles/utils/responsive";

export const siteAreas = {
  teachers: "TEACHERS",
  pupils: "PUPILS",
} as const;

export type SelectedArea = (typeof siteAreas)[keyof typeof siteAreas];

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
  const { isSignedIn } = useUser();
  const router = useRouter();

  const returnToParams = new URLSearchParams({
    returnTo: router.asPath,
  }).toString();
  const onboardingRedirectUrl = `${resolveOakHref({ page: "onboarding" })}?${returnToParams}`;

  return (
    <header>
      <StyledHeader
        $background="white"
        $justifyContent={["space-between"]}
        $alignItems={["center"]}
        $zIndex="fixedHeader"
        $position={"relative"}
        data-testid="app-header"
      >
        <OakFlex
          $justifyContent={"space-between"}
          $flexGrow={1}
          $alignItems={"center"}
        >
          <OakFlex $justifyContent={"center"} $alignItems={"center"}>
            <OwaLink page={"home"}>
              <OakBox $display={["block", "none"]}>
                <Logo height={48} width={31} variant="without text" />
              </OakBox>
              <OakBox $display={["none", "block"]}>
                <Logo variant="with text" height={48} width={104} />
              </OakBox>
            </OwaLink>
          </OakFlex>
          <OakFlex
            $alignItems={"center"}
            $gap="all-spacing-6"
            $font="heading-7"
          >
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      [`@media (max-width: ${getBreakpoint("small")}px)`]: {
                        width: "100%",
                        maxWidth: "100%",
                      },
                    },
                    userButtonTrigger: {
                      "&:focus": {
                        boxShadow: `0px 0px 0px 2px ${oakColorTokens.lemon}, 0px 0px 0px 5px ${oakColorTokens.grey60} !important`,
                      },
                    },
                    userButtonPopoverCard: {
                      [`@media (max-width: ${getBreakpoint("small")}px)`]: {
                        width: "100%",
                        maxWidth: "100%",
                        marginLeft: "0",
                      },
                    },
                  },
                }}
                data-testid="clerk-user-button"
              />
            ) : (
              selectedArea == siteAreas.teachers && (
                <SignUpButton forceRedirectUrl={onboardingRedirectUrl}>
                  <OakSmallSecondaryButton data-testid="sign-up-button">
                    Sign up
                  </OakSmallSecondaryButton>
                </SignUpButton>
              )
            )}
            <OwaLink
              page={"teachers-home-page"}
              $focusStyles={["underline"]}
              $isSelected={true}
            >
              Teachers
              {selectedArea == siteAreas.teachers && (
                <ActiveLinkUnderline
                  name="horizontal-rule"
                  $width="100%"
                  $height={"all-spacing-2"}
                />
              )}
            </OwaLink>
            <OakFlex $alignItems="center" $gap="all-spacing-1">
              <OwaLink
                page="pupil-year-index"
                $focusStyles={["underline"]}
                htmlAnchorProps={{
                  onClick: () =>
                    track.classroomSelected({ navigatedFrom: "header" }),
                  "aria-label": "Pupils browse years",
                }}
              >
                Pupils
                {selectedArea == siteAreas.pupils && (
                  <ActiveLinkUnderline
                    name="horizontal-rule"
                    $width="100%"
                    $height={"all-spacing-2"}
                  />
                )}
              </OwaLink>
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
