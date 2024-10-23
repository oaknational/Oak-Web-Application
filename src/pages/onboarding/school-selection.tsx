import { NextPage } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import withFeatureFlag from "@/hocs/withFeatureFlag";
import SchoolSelectionView from "@/components/TeacherViews/Onboarding/SchoolSelection/SchoolSelection.view";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";

const SchoolSelectionComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <SchoolSelectionView />
    </OakThemeProvider>
  );
};

const SchoolSelectionPage = withFeatureFlag(
  withPageAuthRequired(SchoolSelectionComponent),
  "teacher-download-auth",
  "with-login",
);

export default SchoolSelectionPage;
