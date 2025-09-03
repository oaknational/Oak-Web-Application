import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { Wall } from "@/components/AppComponents/Wall";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import MyLibrary from "@/components/TeacherViews/MyLibrary/MyLibrary";
import { useMyLibrary } from "@/node-lib/educator-api/helpers/saveUnits/useMyLibrary";

function MyLibraryPage() {
  const { collectionData, isLoading, onSaveToggle, isUnitSaved, isUnitSaving } =
    useMyLibrary();

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
      <MyLibrary
        collectionData={collectionData}
        isLoading={isLoading}
        onSaveToggle={onSaveToggle}
        isUnitSaved={isUnitSaved}
        isUnitSaving={isUnitSaving}
      />
    </AppLayout>
  );
}

export default withPageAuthRequired(
  withOnboardingRequired(MyLibraryPage, Wall),
  Wall,
);
