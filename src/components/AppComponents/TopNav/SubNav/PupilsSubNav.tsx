import { OakFlex, OakPrimaryInvertedButton } from "@/styles/oakThemeApp";

const PupilsSubNav = ({ onClick }: { onClick: (menu: string) => void }) => {
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
