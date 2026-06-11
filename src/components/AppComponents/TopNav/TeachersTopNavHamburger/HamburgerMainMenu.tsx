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

import { SubmenuState, HamburgerMenuHook } from "./TeachersTopNavHamburger";

import {
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
      const element = document.getElementById(prevSubmenu + "button");
      element?.focus();
    }
  }, [submenuOpen, prevSubmenu]);

  return (
    <OakUL $display={"flex"} $flexDirection={"column"} $ph={"spacing-40"}>
      <SubjectsSection {...navData.primary} hamburgerMenu={hamburgerMenu} />
      <SubjectsSection {...navData.secondary} hamburgerMenu={hamburgerMenu} />
      <MainMenuButton
        title={"About us"}
        hamburgerMenu={hamburgerMenu}
        $pb="spacing-16"
      />
      <MainMenuButton
        title={"Guidance"}
        hamburgerMenu={hamburgerMenu}
        $pb="spacing-16"
      />
      <MainMenuLink
        hamburgerMenu={hamburgerMenu}
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
  const phaseSubjects = browseData.children.filter(
    (child) => child.type === "phase",
  );
  const keystages = browseData.children.filter(
    (child) => child.type === "keystage",
  );
  const subjectsTitle =
    browseData.slug === "primary" ? "Primary subjects" : "Secondary subjects";
  const keyStagesTitle =
    browseData.slug === "primary"
      ? "Primary key stages"
      : "Secondary key stages";

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
        {phaseSubjects.length > 0 && (
          <MainMenuButton
            title={subjectsTitle}
            hamburgerMenu={hamburgerMenu}
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
        {keystages.length > 0 && (
          <MainMenuButton
            title={keyStagesTitle}
            hamburgerMenu={hamburgerMenu}
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

function MainMenuButton({
  title,
  hamburgerMenu,
  track,
  $pb,
}: Readonly<{
  title: SubmenuState;
  hamburgerMenu: HamburgerMenuHook;
  track?: () => void;
  $pb?: OakLIProps["$pb"];
}>) {
  const { setSubmenuOpen } = hamburgerMenu;

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
          setSubmenuOpen(title);
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
  hamburgerMenu,
}: {
  readonly href: string;
  readonly title: string;
  readonly hamburgerMenu: HamburgerMenuHook;
  readonly external?: boolean;
  readonly iconName?: OakIconName;
}) {
  const { handleCloseHamburger } = hamburgerMenu;
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
      onClick={handleCloseHamburger}
    >
      {title}
    </OakLeftAlignedButton>
  );
}
