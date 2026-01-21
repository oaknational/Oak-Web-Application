import { resolveOakHref } from "@/common-lib/urls";
import { TeachersSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import {
  OakBox,
  OakFlex,
  OakSmallPrimaryInvertedButton,
} from "@/styles/oakThemeApp";
import SearchBar from "@/components/AppComponents/SearchBar";

type TeachersSubNavProps = {
  onClick: (menu: keyof TeachersSubNavData) => void;
  isMenuSelected: (menu: keyof TeachersSubNavData) => boolean;
};

// TD: [integrated journey] do we want to derive menu items from available data
// so the nav bar can be used on error pages / when data is missing or invalid

const TeachersSubNav = ({ onClick, isMenuSelected }: TeachersSubNavProps) => {
  return (
    <OakFlex
      data-testid="teachers-subnav"
      $justifyContent="space-between"
      $flexGrow={1}
      $alignItems="center"
    >
      <OakBox>
        <OakFlex
          $display={["none", "none", "flex"]}
          $gap={"spacing-12"}
          $alignItems={"center"}
        >
          <OakSmallPrimaryInvertedButton
            onClick={() => onClick("primary")}
            selected={isMenuSelected("primary")}
            aria-expanded={isMenuSelected("primary")}
            aria-controls={`topnav-teachers-primary`}
            aria-haspopup
          >
            Primary
          </OakSmallPrimaryInvertedButton>
          <OakSmallPrimaryInvertedButton
            onClick={() => onClick("secondary")}
            selected={isMenuSelected("secondary")}
            aria-expanded={isMenuSelected("secondary")}
            aria-controls={`topnav-teachers-secondary`}
            aria-haspopup
          >
            Secondary
          </OakSmallPrimaryInvertedButton>
          <OakSmallPrimaryInvertedButton
            element="a"
            href={resolveOakHref({ page: "curriculum-landing-page" })}
          >
            Curriculum
          </OakSmallPrimaryInvertedButton>
          <OakSmallPrimaryInvertedButton
            onClick={() => onClick("guidance")}
            selected={isMenuSelected("guidance")}
            aria-expanded={isMenuSelected("guidance")}
            aria-controls={`topnav-teachers-guidance`}
            aria-haspopup
          >
            Guidance
          </OakSmallPrimaryInvertedButton>
          <OakSmallPrimaryInvertedButton
            onClick={() => onClick("aboutUs")}
            selected={isMenuSelected("aboutUs")}
            aria-expanded={isMenuSelected("aboutUs")}
            aria-controls={`topnav-teachers-aboutUs`}
            aria-haspopup
          >
            About us
          </OakSmallPrimaryInvertedButton>
        </OakFlex>
      </OakBox>

      <SearchBar />
    </OakFlex>
  );
};

export default TeachersSubNav;
