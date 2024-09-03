import { NextPage } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import withFeatureFlag from "@/hocs/withFeatureFlag";
import RoleSelectionView from "@/components/TeacherViews/Onboarding/RoleSelection/RoleSelection.view";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";

const RoleSelectionComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <RoleSelectionView />
    </OakThemeProvider>
  );
};

const RoleSelectionPage = withFeatureFlag(
  withPageAuthRequired(RoleSelectionComponent),
  "use-auth-owa",
);

export default RoleSelectionPage;
