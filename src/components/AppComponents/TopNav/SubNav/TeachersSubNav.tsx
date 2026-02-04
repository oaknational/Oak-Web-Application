import Link from "next/link";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import { resolveOakHref } from "@/common-lib/urls";
import { TeachersSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import {
  OakBox,
  OakFlex,
  OakLI,
  OakSmallPrimaryInvertedButton,
  OakUL,
} from "@/styles/oakThemeApp";
import SearchBar from "@/components/AppComponents/SearchBar";

type TeachersSubNavProps = {
  onClick: (menu: keyof TeachersSubNavData) => void;
  isMenuSelected: (menu: keyof TeachersSubNavData) => boolean;
  focusManager: DropdownFocusManager;
};

export const subNavButtons = [
  { label: "Primary", slug: "primary" },
  { label: "Secondary", slug: "secondary" },
  { label: "Curriculum", slug: "curriculum-landing-page" },
  { label: "Guidance", slug: "guidance" },
  { label: "About us", slug: "aboutUs" },
];

// TD: [integrated journey] do we want to derive menu items from available data
// so the nav bar can be used on error pages / when data is missing or invalid

const TeachersSubNav = ({
  onClick,
  isMenuSelected,
  focusManager,
}: TeachersSubNavProps) => {
  const getButtonProps = (slug: string) => {
    if (slug === "curriculum-landing-page") {
      return {
        id: `${slug}-subnav-button`,
        element: Link,
        href: resolveOakHref({ page: "curriculum-landing-page" }),
      };
    }
    return {
      onKeyDown: (event: React.KeyboardEvent) =>
        focusManager.handleKeyDown(event, `${slug}-subnav-button`),
      id: `${slug}-subnav-button`,
      onClick: () => onClick(slug as keyof TeachersSubNavData),
      selected: isMenuSelected(slug as keyof TeachersSubNavData),
      "aria-expanded": isMenuSelected(slug as keyof TeachersSubNavData),
      "aria-controls": `topnav-teachers-${slug}`,
      "aria-haspopup": true,
    };
  };

  return (
    <OakFlex
      data-testid="teachers-subnav"
      $justifyContent="space-between"
      $flexGrow={1}
      $alignItems="center"
    >
      <OakBox>
        <OakUL
          $display={["none", "none", "flex"]}
          $gap={"spacing-12"}
          $alignItems={"center"}
          $reset
        >
          {subNavButtons.map((btn) => {
            const props = getButtonProps(btn.slug);
            return (
              <OakLI key={btn.slug}>
                {btn.slug === "curriculum" ? (
                  <OakSmallPrimaryInvertedButton
                    id={props.id}
                    element={props.element}
                    href={props.href!}
                  >
                    {btn.label}
                  </OakSmallPrimaryInvertedButton>
                ) : (
                  <OakSmallPrimaryInvertedButton
                    onKeyDown={props.onKeyDown}
                    id={props.id}
                    onClick={props.onClick}
                    selected={props.selected}
                    aria-expanded={props["aria-expanded"]}
                    aria-controls={props["aria-controls"]}
                    aria-haspopup={props["aria-haspopup"]}
                  >
                    {btn.label}
                  </OakSmallPrimaryInvertedButton>
                )}
              </OakLI>
            );
          })}
        </OakUL>
      </OakBox>
      <SearchBar />
    </OakFlex>
  );
};

export default TeachersSubNav;
