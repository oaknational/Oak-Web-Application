import { PupilsSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { OakFlex, OakSmallPrimaryInvertedButton } from "@/styles/oakThemeApp";

const PupilsSubNav = ({
  onClick,
}: {
  onClick: (menu: keyof PupilsSubNavData) => void;
}) => {
  return (
    <OakFlex
      data-testid="pupils-subnav"
      $display={["none", "none", "flex"]}
      $gap={"spacing-12"}
    >
      <OakSmallPrimaryInvertedButton onClick={() => onClick("primary")}>
        Primary
      </OakSmallPrimaryInvertedButton>
      <OakSmallPrimaryInvertedButton onClick={() => onClick("secondary")}>
        Secondary
      </OakSmallPrimaryInvertedButton>
    </OakFlex>
  );
};

export default PupilsSubNav;
