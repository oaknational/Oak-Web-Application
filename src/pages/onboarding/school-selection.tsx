import { NextPage } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import SchoolSelectionView from "@/components/TeacherViews/Onboarding/SchoolSelection/SchoolSelection.view";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import { Wall } from "@/components/AppComponents/Wall";

const SchoolSelectionComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <SchoolSelectionView />
    </OakThemeProvider>
  );
};

export default withPageAuthRequired(SchoolSelectionComponent, Wall);
