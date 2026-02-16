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

import {
  getEYFSAriaLabel,
  SubmenuState,
  HamburgerMenuHook,
} from "./TeachersTopNavHamburger";

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
      <SubjectsSection {...navData.secondary} hamburgerMenu={hamburgerMenu} />
      <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
        <MainMenuLink
          hamburgerMenu={hamburgerMenu}
          href={resolveOakHref({
            page: "curriculum-landing-page",
          })}
          title="Curriculum"
        />
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
        />
      </OakFlex>
    </OakUL>
  );
}

function SubjectsSection(
  props: Readonly<TeachersBrowse & { hamburgerMenu: HamburgerMenuHook }>,
) {
  const { hamburgerMenu, ...browseData } = props;
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
        {browseData.children.map((keystage) => (
          <MainMenuButton
            key={keystage.slug + browseData.slug}
            title={keystage.title as SubmenuState}
            description={keystage.description}
            hamburgerMenu={hamburgerMenu}
          />
        ))}
      </OakFlex>
    </OakBox>
  );
}

function MainMenuButton({
  title,
  description,
  hamburgerMenu,
}: {
  readonly title: SubmenuState;
  readonly hamburgerMenu: HamburgerMenuHook;
  readonly description?: string;
}) {
  const { setSubmenuOpen } = hamburgerMenu;
  const isEYFS = title === "EYFS";
  const shouldShowDescription = !isEYFS && description;
  return (
    <OakBox $width={"100%"}>
      <OakLI $listStyle={"none"}>
        <OakLeftAlignedButton
          aria-haspopup={true}
          aria-label={getEYFSAriaLabel(title)}
          rightAlignIcon
          iconName="chevron-right"
          width={"100%"}
          id={title + "button"}
          onClick={() => {
            setSubmenuOpen(title);
          }}
        >
          {shouldShowDescription ? description : title}
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
      onClick={handleCloseHamburger}
    >
      {title}
    </OakLeftAlignedButton>
  );
}
