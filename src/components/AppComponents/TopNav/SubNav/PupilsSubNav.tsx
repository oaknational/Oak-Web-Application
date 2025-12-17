import { PupilsSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { OakFlex, OakPrimaryInvertedButton } from "@/styles/oakThemeApp";

const PupilsSubNav = ({
  onClick,
}: {
  onClick: (menu: keyof PupilsSubNavData) => void;
}) => {
  return (
    <OakFlex>
      <OakPrimaryInvertedButton onClick={() => onClick("primary")}>
        Primary
      </OakPrimaryInvertedButton>
      <OakPrimaryInvertedButton onClick={() => onClick("secondary")}>
        Secondary
      </OakPrimaryInvertedButton>
    </OakFlex>
  );
};

export default PupilsSubNav;
