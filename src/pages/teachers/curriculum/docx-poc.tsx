import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import DocxPOC from "@/components/CurriculumComponents/DocxPOC/DocxPOC";

export default function Page() {
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: "Curriculum downloads - DOCX POC",
          description: "Curriculum downloads - DOCX POC",
        }),
      }}
      $background={"grey20"}
    >
      <OakThemeProvider theme={oakDefaultTheme}>
        <DocxPOC />
      </OakThemeProvider>
    </AppLayout>
  );
}
