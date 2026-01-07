import { PupilsSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { OakFlex, OakSmallPrimaryInvertedButton } from "@/styles/oakThemeApp";

const PupilsSubNav = ({
  onClick,
  isMenuSelected,
}: {
  onClick: (menu: keyof PupilsSubNavData) => void;
  isMenuSelected: (menu: keyof PupilsSubNavData) => boolean;
}) => {
  return (
    <OakFlex
      data-testid="pupils-subnav"
      $display={["none", "none", "flex"]}
      $gap={"spacing-12"}
    >
      <OakSmallPrimaryInvertedButton
        onClick={() => onClick("primary")}
        selected={isMenuSelected("primary")}
      >
        Primary
      </OakSmallPrimaryInvertedButton>
      <OakSmallPrimaryInvertedButton
        onClick={() => onClick("secondary")}
        selected={isMenuSelected("secondary")}
      >
        Secondary
      </OakSmallPrimaryInvertedButton>
    </OakFlex>
  );
};

export default PupilsSubNav;
