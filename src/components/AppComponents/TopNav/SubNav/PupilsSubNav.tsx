import {
  OakLI,
  OakSmallPrimaryInvertedButton,
  OakUL,
} from "@oaknational/oak-components";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import { PupilsSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

interface PupilsSubNavProps extends PupilsSubNavData {
  onClick: (menu: keyof PupilsSubNavData) => void;
  isMenuSelected: (menu: keyof PupilsSubNavData) => boolean;
  focusManager: DropdownFocusManager<PupilsSubNavData>;
}

const PupilsSubNav = ({
  onClick,
  isMenuSelected,
  focusManager,
  ...pupils
}: PupilsSubNavProps) => {
  const pupilsSubNavButtons = Object.values(pupils);
  return (
    <OakUL
      data-testid="pupils-subnav"
      $display={["none", "none", "flex"]}
      $gap={"spacing-12"}
      $reset
    >
      {pupilsSubNavButtons.map((button) => (
        <OakLI key={button.slug}>
          <OakSmallPrimaryInvertedButton
            onKeyDown={(e) =>
              focusManager.handleKeyDown(
                e,
                focusManager.createId("pupils", button.slug),
              )
            }
            id={focusManager.createId("pupils", button.slug)}
            onClick={() => onClick(button.slug)}
            selected={isMenuSelected(button.slug)}
            aria-expanded={isMenuSelected(button.slug)}
            aria-controls={`topnav-pupils-${button.slug}`}
            aria-haspopup
          >
            {button.title}
          </OakSmallPrimaryInvertedButton>
        </OakLI>
      ))}
    </OakUL>
  );
};

export default PupilsSubNav;
