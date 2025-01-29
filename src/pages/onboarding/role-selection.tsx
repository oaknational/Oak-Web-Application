import { NextPage } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import RoleSelectionView from "@/components/TeacherViews/Onboarding/RoleSelection/RoleSelection.view";

const RoleSelectionComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <RoleSelectionView />
    </OakThemeProvider>
  );
};

export default RoleSelectionComponent;
