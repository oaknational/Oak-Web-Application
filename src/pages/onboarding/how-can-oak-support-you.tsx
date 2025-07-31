import { NextPage } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import HowCanOakSupport from "@/components/TeacherViews/Onboarding/HowCanOakSupport/HowCanOakSupport.view";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import { Wall } from "@/components/AppComponents/Wall";

const RoleSelectionComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <HowCanOakSupport />
    </OakThemeProvider>
  );
};

export default withPageAuthRequired(RoleSelectionComponent, Wall);
