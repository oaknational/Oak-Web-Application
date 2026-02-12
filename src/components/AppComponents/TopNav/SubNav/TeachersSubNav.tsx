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

type TeachersSubNavProps = TeachersSubNavData & {
  onClick: (menu: keyof TeachersSubNavData) => void;
  isMenuSelected: (menu: keyof TeachersSubNavData) => boolean;
  focusManager: DropdownFocusManager<TeachersSubNavData>;
};

// TD: [integrated journey] do we want to derive menu items from available data
// so the nav bar can be used on error pages / when data is missing or invalid

const TeachersSubNav = ({
  onClick,
  isMenuSelected,
  focusManager,
  ...teachers
}: TeachersSubNavProps) => {
  const pathname = usePathname();
  const subNavButtons = Object.values(teachers);
  const getLinkProps = (slug: string, external?: boolean) => {
    const buttonId = focusManager.createId("teachers", slug);
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
    const buttonId = focusManager.createId("teachers", slug);
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
      focusManager.createId("teachers", btn.slug),
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
            const external = "external" in btn ? btn.external : undefined;
            return (
              <OakLI key={btn.slug}>
                {btn.children ? (
                  <OakSmallPrimaryInvertedButton
                    {...getButtonProps(btn.slug)}
                    data-testid={focusManager.createId("teachers", btn.slug)}
                  >
                    {btn.title}
                  </OakSmallPrimaryInvertedButton>
                ) : (
                  <OakSmallPrimaryInvertedButton
                    {...getLinkProps(btn.slug, external)}
                  >
                    {btn.title}
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
