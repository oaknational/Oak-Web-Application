import Link from "next/link";
import { usePathname } from "next/navigation";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import {
  OakLinkPropsRequiringPageOnly,
  resolveOakHref,
} from "@/common-lib/urls";
import { TeachersSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import {
  OakBox,
  OakFlex,
  OakLI,
  OakSmallPrimaryInvertedButton,
  OakUL,
} from "@/styles/oakThemeApp";
import SearchBar from "@/components/AppComponents/SearchBar";
import { SaveCount } from "@/components/TeacherComponents/SaveCount/SaveCount";
import TeacherAccountButton from "@/components/TeacherComponents/TeacherAccountButton/TeacherAccountButton";

type TeachersSubNavProps = {
  onClick: (menu: keyof TeachersSubNavData) => void;
  isMenuSelected: (menu: keyof TeachersSubNavData) => boolean;
  focusManager: DropdownFocusManager<TeachersSubNavData>;
};

type SubNavLink = {
  slug: OakLinkPropsRequiringPageOnly["page"];
  label: string;
  element: "link";
  external?: boolean;
};

type SubNavButton = {
  slug: string;
  label: string;
  element: "button";
};

type SubNavButtons = Array<SubNavButton | SubNavLink>;

// The order of these buttons is determined here and used in the keyboard navigation logic in DropdownFocusManager
export const subNavButtons: SubNavButtons = [
  { label: "Primary", slug: "primary", element: "button" as const },
  { label: "Secondary", slug: "secondary", element: "button" as const },
  {
    label: "Curriculum",
    slug: "curriculum-landing-page" as const,
    element: "link" as const,
  },
  { label: "Guidance", slug: "guidance", element: "button" as const },
  { label: "About us", slug: "aboutUs", element: "button" as const },
  {
    label: "Ai experiements",
    slug: "labs" as const,
    element: "link" as const,
    external: true,
  },
];

// TD: [integrated journey] do we want to derive menu items from available data
// so the nav bar can be used on error pages / when data is missing or invalid

const TeachersSubNav = ({
  onClick,
  isMenuSelected,
  focusManager,
}: TeachersSubNavProps) => {
  const pathname = usePathname();

  const getLinkProps = (
    slug: OakLinkPropsRequiringPageOnly["page"],
    external?: boolean,
  ) => {
    const buttonId = focusManager.createSubnavButtonId(slug);
    return {
      target: external ? "_blank" : undefined,
      iconName: external ? ("external" as const) : undefined,
      isTrailingIcon: true,
      id: buttonId,
      element: Link,
      onKeyDown: (event: React.KeyboardEvent) =>
        focusManager.handleKeyDown(event, buttonId),
      href: resolveOakHref({ page: slug } as OakLinkPropsRequiringPageOnly),
    };
  };

  const getButtonProps = (slug: string) => {
    const buttonId = focusManager.createSubnavButtonId(slug);
    return {
      onKeyDown: (event: React.KeyboardEvent) =>
        focusManager.handleKeyDown(event, buttonId),
      id: buttonId,
      onClick: () => onClick(slug as keyof TeachersSubNavData),
      selected: isMenuSelected(slug as keyof TeachersSubNavData),
      "aria-expanded": isMenuSelected(slug as keyof TeachersSubNavData),
      "aria-controls": `topnav-teachers-${slug}`,
      "aria-haspopup": true,
    };
  };

  const handleArrowKeys = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const activeElementId = document.activeElement?.id;
    if (!activeElementId) return;
    const focusableElements = subNavButtons.map((btn) =>
      focusManager.createSubnavButtonId(btn.slug),
    );

    const currentIndex = focusableElements.indexOf(activeElementId);

    switch (event.key) {
      case "ArrowRight": {
        event.preventDefault();
        if (focusableElements.length === 0) return;
        const nextDownIndex =
          currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
        focusableElements[nextDownIndex] &&
          document.getElementById(focusableElements[nextDownIndex])?.focus();
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        if (focusableElements.length === 0) return;
        const nextUpIndex =
          currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[nextUpIndex] &&
          document.getElementById(focusableElements[nextUpIndex])?.focus();
        break;
      }
    }
  };
  const alwaysDisplayInTestingEnv = (displayValues: string | string[]) =>
    process.env.NODE_ENV === "test" ? "flex" : displayValues;
  return (
    <OakFlex
      id="teachers-subnav"
      data-testid="teachers-subnav"
      $justifyContent="space-between"
      $flexGrow={1}
      $alignItems="center"
    >
      <OakBox>
        <OakUL
          $display={alwaysDisplayInTestingEnv(["none", "none", "flex"])}
          $gap={"spacing-12"}
          $alignItems={"center"}
          $reset
          onKeyDown={handleArrowKeys}
        >
          {subNavButtons.map((btn) => {
            return (
              <OakLI key={btn.slug}>
                {btn.element === "link" ? (
                  <OakSmallPrimaryInvertedButton
                    {...getLinkProps(btn.slug, btn.external)}
                  >
                    {btn.label}
                  </OakSmallPrimaryInvertedButton>
                ) : (
                  <OakSmallPrimaryInvertedButton
                    {...getButtonProps(btn.slug)}
                    data-testid={focusManager.createSubnavButtonId(btn.slug)}
                  >
                    {btn.label}
                  </OakSmallPrimaryInvertedButton>
                )}
              </OakLI>
            );
          })}
        </OakUL>
      </OakBox>
      <OakFlex
        $alignItems={"center"}
        $gap={["spacing-24", "spacing-16", "spacing-16"]}
      >
        <SearchBar />
        <SaveCount />
        <TeacherAccountButton
          selectedArea="TEACHERS"
          onboardingRedirectUrl={resolveOakHref({
            page: "onboarding",
            query: { returnTo: pathname ?? "/" },
          })}
          buttonVariant="primary"
        />
      </OakFlex>
    </OakFlex>
  );
};

export default TeachersSubNav;
