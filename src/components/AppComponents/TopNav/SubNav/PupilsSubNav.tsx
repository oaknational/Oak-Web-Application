import {
  OakLI,
  OakSmallPrimaryInvertedButton,
  OakUL,
} from "@oaknational/oak-components";

import { DropdownFocusManager } from "../DropdownFocusManager/DropdownFocusManager";

import { PupilsSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

export const pupilsSubNavButtons = [
  { slug: "primary", label: "Primary" },
  { slug: "secondary", label: "Secondary" },
];

const PupilsSubNav = ({
  onClick,
  isMenuSelected,
  focusManager,
}: {
  onClick: (menu: keyof PupilsSubNavData) => void;
  isMenuSelected: (menu: keyof PupilsSubNavData) => boolean;
  focusManager: DropdownFocusManager<PupilsSubNavData>;
}) => {
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
                focusManager.createSubnavButtonId(
                  button.slug as keyof PupilsSubNavData,
                ),
              )
            }
            id={focusManager.createSubnavButtonId(
              button.slug as keyof PupilsSubNavData,
            )}
            onClick={() => onClick(button.slug as keyof PupilsSubNavData)}
            selected={isMenuSelected(button.slug as keyof PupilsSubNavData)}
            aria-expanded={isMenuSelected(
              button.slug as keyof PupilsSubNavData,
            )}
            aria-controls={`topnav-pupils-${button.slug}`}
            aria-haspopup
          >
            {button.label}
          </OakSmallPrimaryInvertedButton>
        </OakLI>
      ))}
    </OakUL>
  );
};

export default PupilsSubNav;
