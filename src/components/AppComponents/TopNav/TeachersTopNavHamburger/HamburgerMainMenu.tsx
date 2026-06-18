import { useEffect } from "react";
import {
  OakBox,
  OakLI,
  OakIconName,
  OakFlex,
  OakHeading,
  OakSvg,
  OakUL,
  OakLeftAlignedButton,
  OakLIProps,
} from "@oaknational/oak-components";
import Link from "next/link";

import { HamburgerMenuHook } from "./TeachersTopNavHamburger";

import {
  isPhaseMenu,
  KeystageMenu,
  PhaseMenu,
  TeachersBrowse,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { resolveOakHref } from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";

export function MainMenuContent(
  props: Readonly<TeachersSubNavData & { hamburgerMenu: HamburgerMenuHook }>,
) {
  const { hamburgerMenu, ...navData } = props;
  const { submenuOpen, prevSubmenu } = hamburgerMenu;

  useEffect(() => {
    // We're navigating back from a submenu, focus the triggering element
    if (prevSubmenu) {
      const element = document.getElementById(prevSubmenu.value + "button");
      element?.focus();
    }
  }, [submenuOpen, prevSubmenu]);

  return (
    <OakUL $display={"flex"} $flexDirection={"column"} $ph={"spacing-40"}>
      <SubjectsSection {...navData.primary} hamburgerMenu={hamburgerMenu} />
      <SubjectsSection {...navData.secondary} hamburgerMenu={hamburgerMenu} />
      <MainMenuButton
        title={"About us"}
        onClick={() =>
          hamburgerMenu.handleNav({ menu: "OakMenu", value: "About us" })
        }
        $pb="spacing-16"
      />
      <MainMenuButton
        title={"Guidance"}
        onClick={() =>
          hamburgerMenu.handleNav({ menu: "OakMenu", value: "Guidance" })
        }
        $pb="spacing-16"
      />
      <MainMenuLink
        onClick={hamburgerMenu.handleCloseHamburger}
        href={resolveOakHref({
          page: "labs",
        })}
        external={true}
        title="AI Experiments"
        iconName="external"
        aria-label="AI Experiments (this will open in a new tab)"
      />
    </OakUL>
  );
}

function SubjectsSection(
  props: Readonly<TeachersBrowse & { hamburgerMenu: HamburgerMenuHook }>,
) {
  const { hamburgerMenu, ...browseData } = props;
  const { track } = useAnalytics();

  const getTitle = (item: PhaseMenu | KeystageMenu) => {
    if (isPhaseMenu(item)) {
      return browseData.slug === "primary"
        ? "Primary subjects"
        : "Secondary subjects";
    } else {
      return browseData.slug === "primary"
        ? "Primary key stages"
        : "Secondary key stages";
    }
  };

  const keystageChildren = browseData.children.filter(
    (child) => !isPhaseMenu(child),
  );
  const phaseChildren = browseData.children.filter((child) =>
    isPhaseMenu(child),
  );

  return (
    <OakLI $listStyle={"none"} $pb="spacing-40">
      <OakFlex
        $flexDirection={"column"}
        $width={"fit-content"}
        $mb={"spacing-12"}
        $pl="spacing-8"
      >
        <OakBox $position={"relative"}>
          <OakHeading tag="h2" $font={"heading-6"}>
            {browseData.title}
          </OakHeading>
          <OakSvg
            $position={"absolute"}
            $color={"bg-decorative1-main"}
            $display={"block"}
            name={"underline"}
            $height={"spacing-8"}
          />
        </OakBox>
      </OakFlex>
      <OakFlex
        as="ul"
        $flexDirection={"column"}
        $gap={"spacing-16"}
        $ph="spacing-0"
        $pt="spacing-12"
      >
        {phaseChildren.map((child) => (
          <MainMenuButton
            key={child.slug}
            title={getTitle(child)}
            onClick={() =>
              hamburgerMenu.handleNav({ menu: "Phases", value: child.title })
            }
            track={() => {
              track.browseRefined({
                platform: "owa",
                product: "teacher lesson resources",
                engagementIntent: "refine",
                componentType: "topnav-browse-button",
                eventVersion: "2.0.0",
                analyticsUseCase: "Teacher",
                filterType: "Phase filter",
                filterValue: browseData.slug,
                activeFilters: {},
                googleLoginHint: null,
                clientEnvironment: null,
              });
            }}
          />
        ))}
        {!!keystageChildren.length && (
          <MainMenuButton
            title={getTitle(keystageChildren[0]!)}
            onClick={() =>
              hamburgerMenu.handleNav({
                menu: "KeystageOptions",
                value: browseData.title,
              })
            }
            track={() => {
              track.browseRefined({
                platform: "owa",
                product: "teacher lesson resources",
                engagementIntent: "refine",
                componentType: "topnav-browse-button",
                eventVersion: "2.0.0",
                analyticsUseCase: "Teacher",
                filterType: "Phase filter",
                filterValue: browseData.slug,
                activeFilters: {},
                googleLoginHint: null,
                clientEnvironment: null,
              });
            }}
          />
        )}
      </OakFlex>
      <OakBox
        $mt="spacing-40"
        $mh="spacing-8"
        $bb={"border-solid-s"}
        $borderColor={"border-neutral-lighter"}
        aria-hidden={true}
      />
    </OakLI>
  );
}

export function MainMenuButton({
  title,
  onClick,
  track,
  $pb,
}: Readonly<{
  title: string;
  onClick?: () => void;
  track?: () => void;
  $pb?: OakLIProps["$pb"];
}>) {
  return (
    <OakLI $listStyle={"none"} $width={"100%"} $pb={$pb}>
      <OakLeftAlignedButton
        aria-haspopup={true}
        rightAlignIcon
        iconName="chevron-right"
        width={"100%"}
        id={title + "button"}
        onClick={() => {
          track?.();
          onClick?.();
        }}
      >
        {title}
      </OakLeftAlignedButton>
    </OakLI>
  );
}

function MainMenuLink({
  href,
  title,
  iconName,
  external,
  onClick,
}: {
  readonly href: string;
  readonly title: string;
  readonly external?: boolean;
  readonly iconName?: OakIconName;
  readonly onClick: () => void;
}) {
  return (
    <OakLeftAlignedButton
      width={"100%"}
      element={Link}
      isTrailingIcon
      iconName={iconName}
      href={href}
      target={external ? "_blank" : "_self"}
      aria-label={
        external ? `${title} (this will open in a new tab)` : undefined
      }
      onClick={onClick}
    >
      {title}
    </OakLeftAlignedButton>
  );
}
