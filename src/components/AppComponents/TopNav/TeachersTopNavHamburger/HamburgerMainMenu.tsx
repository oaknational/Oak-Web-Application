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
} from "@oaknational/oak-components";
import Link from "next/link";

import { SubmenuState, HamburgerMenuHook } from "./TeachersTopNavHamburger";

import {
  TeachersBrowse,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { resolveOakHref } from "@/common-lib/urls";

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
    <OakUL
      $display={"flex"}
      $flexDirection={"column"}
      $pa={"spacing-40"}
      $gap={"spacing-40"}
    >
      <SubjectsSection {...navData.primary} hamburgerMenu={hamburgerMenu} />
      <MenuDivider />
      <SubjectsSection {...navData.secondary} hamburgerMenu={hamburgerMenu} />
      <MenuDivider />
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <MainMenuButton title={"About us"} hamburgerMenu={hamburgerMenu} />
        <MainMenuButton title={"Guidance"} hamburgerMenu={hamburgerMenu} />
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
      </OakFlex>
    </OakUL>
  );
}

function MenuDivider() {
  return (
    <OakBox
      $width={"100%"}
      $bt={"border-solid-s"}
      $borderColor={"border-neutral-lighter"}
      as="hr"
    />
  );
}

function SubjectsSection(
  props: Readonly<TeachersBrowse & { hamburgerMenu: HamburgerMenuHook }>,
) {
  const { hamburgerMenu, ...browseData } = props;
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
    <OakBox>
      <OakFlex
        $flexDirection={"column"}
        $width={"fit-content"}
        $mb={"spacing-12"}
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
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        {phaseSubjects.length > 0 && (
          <MainMenuButton title={subjectsTitle} hamburgerMenu={hamburgerMenu} />
        )}
        {keystages.length > 0 && (
          <MainMenuButton
            title={keyStagesTitle}
            hamburgerMenu={hamburgerMenu}
          />
        )}
      </OakFlex>
    </OakBox>
  );
}

function MainMenuButton({
  title,
  hamburgerMenu,
  track,
}: Readonly<{
  title: SubmenuState;
  hamburgerMenu: HamburgerMenuHook;
  track?: () => void;
}>) {
  const { setSubmenuOpen } = hamburgerMenu;

  return (
    <OakBox $width={"100%"}>
      <OakLI $listStyle={"none"}>
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
    </OakBox>
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
