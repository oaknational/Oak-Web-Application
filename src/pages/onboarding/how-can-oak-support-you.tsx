import { NextPage } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import HowCanOakSupport from "@/components/TeacherViews/Onboarding/HowCanOakSupport/HowCanOakSupport.view";

const RoleSelectionComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <HowCanOakSupport />
    </OakThemeProvider>
  );
};

export default RoleSelectionComponent;
