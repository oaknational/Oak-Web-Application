import {
  OakLI,
  OakSmallPrimaryInvertedButton,
  OakUL,
} from "@oaknational/oak-components";

import { PupilsSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

const PupilsSubNav = ({
  onClick,
  isMenuSelected,
}: {
  onClick: (menu: keyof PupilsSubNavData) => void;
  isMenuSelected: (menu: keyof PupilsSubNavData) => boolean;
}) => {
  return (
    <OakUL
      data-testid="pupils-subnav"
      $display={["none", "none", "flex"]}
      $gap={"spacing-12"}
      $reset
    >
      <OakLI>
        <OakSmallPrimaryInvertedButton
          onClick={() => onClick("primary")}
          selected={isMenuSelected("primary")}
          aria-expanded={isMenuSelected("primary")}
          aria-controls={`topnav-pupils-primary`}
          aria-haspopup
        >
          Primary
        </OakSmallPrimaryInvertedButton>
      </OakLI>
      <OakLI>
        <OakSmallPrimaryInvertedButton
          onClick={() => onClick("secondary")}
          selected={isMenuSelected("secondary")}
          aria-expanded={isMenuSelected("secondary")}
          aria-controls={"topnav-pupils-secondary"}
          aria-haspopup
        >
          Secondary
        </OakSmallPrimaryInvertedButton>
      </OakLI>
    </OakUL>
  );
};

export default PupilsSubNav;
