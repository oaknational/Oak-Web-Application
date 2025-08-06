import { NextPage } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import RoleSelectionView from "@/components/TeacherViews/Onboarding/RoleSelection/RoleSelection.view";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import { Wall } from "@/components/AppComponents/Wall";

const RoleSelectionComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <RoleSelectionView />
    </OakThemeProvider>
  );
};

export default withPageAuthRequired(RoleSelectionComponent, Wall);
