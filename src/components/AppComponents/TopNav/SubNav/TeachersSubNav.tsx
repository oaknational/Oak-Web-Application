import { resolveOakHref } from "@/common-lib/urls";
import { TeachersSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { OakFlex, OakSmallPrimaryInvertedButton } from "@/styles/oakThemeApp";

type TeachersSubNavProps = {
  onClick: (menu: keyof TeachersSubNavData) => void;
};

const TeachersSubNav = ({ onClick }: TeachersSubNavProps) => {
  return (
    <OakFlex data-testid="teachers-subnav">
      <OakFlex $display={["none", "none", "flex"]} $gap={"spacing-12"}>
        <OakSmallPrimaryInvertedButton onClick={() => onClick("primary")}>
          Primary
        </OakSmallPrimaryInvertedButton>
        <OakSmallPrimaryInvertedButton onClick={() => onClick("secondary")}>
          Secondary
        </OakSmallPrimaryInvertedButton>
        <OakSmallPrimaryInvertedButton
          element="a"
          href={resolveOakHref({ page: "curriculum-landing-page" })}
        >
          Curriculum
        </OakSmallPrimaryInvertedButton>
        <OakSmallPrimaryInvertedButton onClick={() => onClick("guidance")}>
          Guidance
        </OakSmallPrimaryInvertedButton>
        <OakSmallPrimaryInvertedButton onClick={() => onClick("aboutUs")}>
          About us
        </OakSmallPrimaryInvertedButton>
      </OakFlex>
    </OakFlex>
  );
};

export default TeachersSubNav;
