import { NextPage } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import SchoolSelectionView from "@/components/TeacherViews/Onboarding/SchoolSelection/SchoolSelection.view";

const SchoolSelectionComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <SchoolSelectionView />
    </OakThemeProvider>
  );
};

export default SchoolSelectionComponent;
