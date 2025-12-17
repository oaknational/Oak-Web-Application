import { resolveOakHref } from "@/common-lib/urls";
import { TeachersSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { OakFlex, OakPrimaryInvertedButton } from "@/styles/oakThemeApp";

type TeachersSubNavProps = {
  onClick: (menu: keyof TeachersSubNavData) => void;
};

const TeachersSubNav = ({ onClick }: TeachersSubNavProps) => {
  return (
    <OakFlex data-testid="teachers-subnav">
      <OakFlex $display={["none", "none", "flex"]} $gap={"spacing-12"}>
        <OakPrimaryInvertedButton onClick={() => onClick("primary")}>
          Primary
        </OakPrimaryInvertedButton>
        <OakPrimaryInvertedButton onClick={() => onClick("secondary")}>
          Secondary
        </OakPrimaryInvertedButton>
        <OakPrimaryInvertedButton
          element="a"
          href={resolveOakHref({ page: "curriculum-landing-page" })}
        >
          Curriculum
        </OakPrimaryInvertedButton>
        <OakPrimaryInvertedButton onClick={() => onClick("guidance")}>
          Guidance
        </OakPrimaryInvertedButton>
        <OakPrimaryInvertedButton onClick={() => onClick("aboutUs")}>
          About us
        </OakPrimaryInvertedButton>
      </OakFlex>
    </OakFlex>
  );
};

export default TeachersSubNav;
