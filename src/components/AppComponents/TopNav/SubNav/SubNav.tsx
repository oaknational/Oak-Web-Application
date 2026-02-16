import Link from "next/link";
import { usePathname } from "next/navigation";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import { resolveOakHref } from "@/common-lib/urls";
import {
  TeachersSubNavData,
  PupilsSubNavData,
  isDropdownMenuItem,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
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

type SubNavData = TeachersSubNavData | PupilsSubNavData;

export type SubNavProps<T extends SubNavData> = T & {
  onClick: (menu: keyof T) => void;
  isMenuSelected: (menu: keyof T) => boolean;
  focusManager: DropdownFocusManager<T>;
  area: "teachers" | "pupils";
};

const SubNav = <T extends SubNavData>({
  onClick,
  isMenuSelected,
  focusManager,
  area,
  ...data
}: SubNavProps<T>) => {
  const pathname = usePathname();
  const subNavButtons = Object.values(data);

  const getLinkProps = (slug: string, href: string, external?: boolean) => {
    const buttonId = focusManager.createId(area, slug);
    return {
      target: external ? "_blank" : undefined,
      iconName: external ? ("external" as const) : undefined,
      isTrailingIcon: true,
      id: buttonId,
      element: Link,
      onKeyDown: (event: React.KeyboardEvent) =>
        focusManager.handleKeyDown(event, buttonId),
      href,
    };
  };

  const getButtonProps = (slug: string) => {
    const buttonId = focusManager.createId(area, slug);
    return {
      onKeyDown: (event: React.KeyboardEvent) =>
        focusManager.handleKeyDown(event, buttonId),
      id: buttonId,
      onClick: () => onClick(slug as keyof T),
      selected: isMenuSelected(slug as keyof T),
      "aria-expanded": isMenuSelected(slug as keyof T),
      "aria-controls": `topnav-${area}-${slug}`,
      "aria-haspopup": true,
    };
  };

  const handleArrowKeys = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const activeElementId = document.activeElement?.id;

    if (!activeElementId) return;
    const focusableElements = subNavButtons.map((btn) =>
      focusManager.createId(area, btn.slug),
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
      id={`${area}-subnav`}
      data-testid={`${area}-subnav`}
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
                {isDropdownMenuItem(btn) ? (
                  <OakSmallPrimaryInvertedButton
                    {...getButtonProps(btn.slug)}
                    data-testid={focusManager.createId(area, btn.slug)}
                  >
                    {btn.title}
                  </OakSmallPrimaryInvertedButton>
                ) : (
                  <OakSmallPrimaryInvertedButton
                    {...getLinkProps(btn.slug, btn.href, external)}
                  >
                    {btn.title}
                  </OakSmallPrimaryInvertedButton>
                )}
              </OakLI>
            );
          })}
        </OakUL>
      </OakBox>
      {area === "teachers" && (
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
      )}
    </OakFlex>
  );
};

export default SubNav;
