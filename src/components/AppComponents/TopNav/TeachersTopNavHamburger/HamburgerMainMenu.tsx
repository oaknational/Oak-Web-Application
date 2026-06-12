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

import { getEYFSAriaLabel, HamburgerMenuHook } from "./TeachersTopNavHamburger";

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
      const element = document.getElementById(prevSubmenu.value + "button");
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
        <MainMenuButton
          title={"About us"}
          onClick={() =>
            hamburgerMenu.handleNav({ menu: "OakMenu", value: "About us" })
          }
        />
        <MainMenuButton
          title={"Guidance"}
          onClick={() =>
            hamburgerMenu.handleNav({ menu: "OakMenu", value: "Guidance" })
          }
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
      </OakFlex>
    </OakUL>
  );
}

function SubjectsSection(
  props: Readonly<TeachersBrowse & { hamburgerMenu: HamburgerMenuHook }>,
) {
  const { hamburgerMenu, ...browseData } = props;
  const { track } = useAnalytics();
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
            title={keystage.title}
            description={keystage.description}
            onClick={() =>
              hamburgerMenu.handleNav({
                menu: "Keystages",
                value: keystage.title,
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
                filterType: "Key stage filter",
                filterValue: keystage.slug,
                activeFilters: {},
                googleLoginHint: null,
                clientEnvironment: null,
              });
            }}
          />
        ))}
      </OakFlex>
    </OakBox>
  );
}

function MainMenuButton({
  title,
  description,
  track,
  onClick,
}: Readonly<{
  title: string;
  description?: string;
  track?: () => void;
  onClick: () => void;
}>) {
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
            track?.();
            onClick?.();
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
