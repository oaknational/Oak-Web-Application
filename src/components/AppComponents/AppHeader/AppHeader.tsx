import { FC, useRef } from "react";
import {
  OakBox,
  OakFlex,
  OakLink,
  OakSecondaryLink,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import styled from "styled-components";

import TeacherAccountButton from "@/components/TeacherComponents/TeacherAccountButton/TeacherAccountButton";
import { resolveOakHref } from "@/common-lib/urls";
import Logo from "@/components/AppComponents/Logo";
import { HeaderProps } from "@/components/AppComponents/Layout/Layout";
import { AppHeaderMenu } from "@/components/AppComponents/AppHeaderMenu";
import { useMenuContext } from "@/context/Menu";
import AppHeaderBurgerMenuSections from "@/components/AppComponents/AppHeaderBurgerMenuSections";
import { ActiveLinkUnderline } from "@/components/SharedComponents/OwaLink/OwaLink";
import IconButton from "@/components/SharedComponents/Button/IconButton";
import { StyledHeader } from "@/components/AppComponents/StyledHeader";
import { AppHeaderUnderline } from "@/components/AppComponents/AppHeaderUnderline";
import { burgerMenuSections } from "@/browser-lib/fixtures/burgerMenuSections";

import useSelectedArea from "@/hooks/useSelectedArea";
import { SaveCount } from "@/components/TeacherComponents/SaveCount/SaveCount";
import { usePathname } from "next/navigation";

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
  // const { track } = useAnalytics(); // TODO:[spike]  analytics
  const selectedArea = useSelectedArea();
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  return (
    <header>
      <StyledHeader
        $background="white"
        $justifyContent={["space-between"]}
        $alignItems={["center"]}
        $zIndex="fixed-header"
        $position={"relative"}
        data-testid="app-header"
      >
        <OakFlex
          $flexGrow={1}
          $alignItems={"center"}
          $gap={["all-spacing-0", "space-between-s"]}
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
            $gap={["all-spacing-0", "all-spacing-6"]}
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
              isSignedIn={isSignedIn ? true : false}
              onboardingRedirectUrl={resolveOakHref({
                page: "onboarding",
                query: { returnTo: pathname ?? "" },
              })}
            />
            {/* <OwaLink
              page={"teachers-home-page"}
              $focusStyles={["underline"]}
              $isSelected={true}
              aria-current={selectedArea !== siteAreas.pupils}
            > */}
            {/* TODO: [spike] check link behaviour */}
            <OakSecondaryLink
              href={resolveOakHref({ page: "teachers-home-page" })}
            >
              Teachers
              {selectedArea == siteAreas.teachers && (
                <ActiveLinkUnderline
                  name="horizontal-rule"
                  $width="100%"
                  $height={"all-spacing-2"}
                />
              )}
            </OakSecondaryLink>
            {/* </OwaLink> */}
            <OakFlex $alignItems="center" $gap="all-spacing-1">
              {/* <OwaLink
                page="pupil-year-index"
                $focusStyles={["underline"]}
                htmlAnchorProps={{
                  // onClick: () =>
                  //   track.classroomSelected({ navigatedFrom: "header" }),
                  "aria-label": "Pupils browse years",
                }}
                aria-current={selectedArea == siteAreas.pupils}
              > */}
              <OakSecondaryLink
                href={resolveOakHref({ page: "pupil-year-index" })}
              >
                Pupils
                {selectedArea == siteAreas.pupils && (
                  <ActiveLinkUnderline
                    name="horizontal-rule"
                    $width="100%"
                    $height={"all-spacing-2"}
                  />
                )}
              </OakSecondaryLink>
              {/* </OwaLink> */}
            </OakFlex>
            {/* <IconButton
              aria-label="Menu"
              icon={"hamburger"}
              variant={"minimal"}
              size={"large"}
              ref={menuButtonRef}
              onClick={openMenu}
              aria-expanded={open}
            /> */}
            {/* TODO: [spike] check this works */}
            <OakTertiaryButton iconName="hamburger" onClick={openMenu} />
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
