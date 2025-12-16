import { OakFlex, OakPrimaryInvertedButton } from "@/styles/oakThemeApp";

const TeachersSubNav = ({ onClick }: { onClick: (menu: string) => void }) => {
  return (
    <OakFlex $gap={"spacing-12"}>
      <OakPrimaryInvertedButton onClick={() => onClick("primary")}>
        Primary
      </OakPrimaryInvertedButton>
      <OakPrimaryInvertedButton onClick={() => onClick("secondary")}>
        Secondary
      </OakPrimaryInvertedButton>
      <OakPrimaryInvertedButton onClick={() => onClick("guidance")}>
        Guidance
      </OakPrimaryInvertedButton>
      <OakPrimaryInvertedButton onClick={() => onClick("aboutUs")}>
        About us
      </OakPrimaryInvertedButton>
    </OakFlex>
  );
};

export default TeachersSubNav;
