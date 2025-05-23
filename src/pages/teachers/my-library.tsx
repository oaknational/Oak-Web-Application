import { OakMaxWidth } from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { Wall } from "@/components/AppComponents/Wall";
import AppLayout from "@/components/SharedComponents/AppLayout";
import withFeatureFlag from "@/hocs/withFeatureFlag";
import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import MyLibraryHeader from "@/components/TeacherComponents/MyLibraryHeader/MyLibraryHeader";
import NoSavedContent from "@/components/TeacherComponents/NoSavedContent/NoSavedContent";
import { useProgrammeUnits } from "@/node-lib/educator-api/helpers/saveUnits/useSaveProgrammeUnits";

function MyLibraryPage() {
  const { isLoading } = useProgrammeUnits();

  const noUnitsSaved = !isLoading;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: "My library",
          description: "Save units to your own personal library",
        }),
        noIndex: true,
        noFollow: true,
      }}
    >
      <OakMaxWidth
        $gap={["space-between-m", "space-between-l"]}
        $pb="inner-padding-xl"
        $pt={["inner-padding-none", "inner-padding-xl"]}
      >
        <MyLibraryHeader />
        {noUnitsSaved && <NoSavedContent />}
      </OakMaxWidth>
    </AppLayout>
  );
}

export default withFeatureFlag(
  withPageAuthRequired(withOnboardingRequired(MyLibraryPage, Wall), Wall),
  "teacher-save-units",
);
