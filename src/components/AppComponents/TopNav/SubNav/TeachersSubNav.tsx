import Link from "next/link";

import { DropDownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

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
  focusManager: DropDownFocusManager;
};

// TD: [integrated journey] do we want to derive menu items from available data
// so the nav bar can be used on error pages / when data is missing or invalid

const TeachersSubNav = ({
  onClick,
  isMenuSelected,
  focusManager,
}: TeachersSubNavProps) => {
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
          <OakLI>
            <OakSmallPrimaryInvertedButton
              onKeyDown={(event) =>
                focusManager.handleKeyDown(event, "primary-subnav-button")
              }
              id={"primary-subnav-button"}
              onClick={() => onClick("primary")}
              selected={isMenuSelected("primary")}
              aria-expanded={isMenuSelected("primary")}
              aria-controls={`topnav-teachers-primary`}
              aria-haspopup
            >
              Primary
            </OakSmallPrimaryInvertedButton>
          </OakLI>
          <OakLI>
            <OakSmallPrimaryInvertedButton
              onKeyDown={(event) =>
                focusManager.handleKeyDown(event, "secondary-subnav-button")
              }
              id={"secondary-subnav-button"}
              onClick={() => onClick("secondary")}
              selected={isMenuSelected("secondary")}
              aria-expanded={isMenuSelected("secondary")}
              aria-controls={`topnav-teachers-secondary`}
              aria-haspopup
            >
              Secondary
            </OakSmallPrimaryInvertedButton>
          </OakLI>
          <OakLI>
            <OakSmallPrimaryInvertedButton
              element={Link}
              href={resolveOakHref({ page: "curriculum-landing-page" })}
            >
              Curriculum
            </OakSmallPrimaryInvertedButton>
          </OakLI>
          <OakLI>
            <OakSmallPrimaryInvertedButton
              onKeyDown={(event) =>
                focusManager.handleKeyDown(event, "guidance-subnav-button")
              }
              id={"guidance-subnav-button"}
              onClick={() => onClick("guidance")}
              selected={isMenuSelected("guidance")}
              aria-expanded={isMenuSelected("guidance")}
              aria-controls={`topnav-teachers-guidance`}
              aria-haspopup
            >
              Guidance
            </OakSmallPrimaryInvertedButton>
          </OakLI>
          <OakLI>
            <OakSmallPrimaryInvertedButton
              onKeyDown={(event) =>
                focusManager.handleKeyDown(event, "aboutUs-subnav-button")
              }
              id={"aboutUs-subnav-button"}
              onClick={() => onClick("aboutUs")}
              selected={isMenuSelected("aboutUs")}
              aria-expanded={isMenuSelected("aboutUs")}
              aria-controls={`topnav-teachers-aboutUs`}
              aria-haspopup
            >
              About us
            </OakSmallPrimaryInvertedButton>
          </OakLI>
        </OakUL>
      </OakBox>

      <SearchBar />
    </OakFlex>
  );
};

export default TeachersSubNav;
