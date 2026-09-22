import {
  OakMaxWidth,
  OakGrid,
  OakGridArea,
  OakSideMenuNav,
} from "@oaknational/oak-components";

import MyLibraryHeader from "@/components/TeacherComponents/MyLibraryHeader/MyLibraryHeader";
import NoSavedContent from "@/components/TeacherComponents/NoSavedContent/NoSavedContent";
import { MyLibraryUnit } from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent.types";
import {
  ExamBoardValueType,
  KeyStageTitleValueType,
  PathwayValueType,
  TierNameValueType,
} from "@/browser-lib/avo/Avo";
import { resolveOakHref } from "@/common-lib/urls";
import MyLibraryProgrammeCard from "@/components/TeacherComponents/MyLibraryProgrammeCard/MyLibraryProgrammeCard";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export type CollectionData = Array<{
  subject: string;
  subjectSlug: string;
  subjectPhaseSlug: string;
  subheading: string;
  keystage: string;
  keystageSlug: string;
  units: Array<MyLibraryUnit>;
  programmeSlug: string;
  programmeTitle: string;
  subjectCategoryQuery?: string;
  uniqueProgrammeKey: string;
}>;

type MyLibraryProps = {
  collectionData: CollectionData | null;
  isLoading: boolean;
};

export default function MyLibrary(props: Readonly<MyLibraryProps>) {
  const { collectionData, isLoading } = props;
  const collections = collectionData ?? [];

  const hasLoadedCollections = !isLoading && collectionData !== null;
  const showNoSavedContent = hasLoadedCollections && collections.length === 0;
  const showCollections = hasLoadedCollections && collections.length > 0;
  return (
    <OakMaxWidth
      $gap={["spacing-0", "spacing-48"]}
      $pb="spacing-24"
      $pt={["spacing-0", "spacing-24"]}
      $flexDirection="column"
      $maxWidth={["unset", "spacing-1280"]}
    >
      <MyLibraryHeader />
      {showNoSavedContent ? <NoSavedContent /> : null}

      {showCollections ? (
        <OakGrid
          $ph={["spacing-0", "spacing-48"]}
          $position="relative"
          $rg={"spacing-24"}
        >
          <OakGridArea
            $colSpan={[12, 2]}
            $position={["static", "sticky"]}
            $top={"spacing-0"}
            $alignSelf={"start"}
            $maxHeight={["unset", "100vh"]}
            $pv={["spacing-0", "spacing-20"]}
            $overflow={["unset", "auto"]}
          >
            <OakSideMenuNav
              menuItems={collections.map((item) => ({
                heading: item.subject,
                subheading: item.subheading,
                href: `#${item.uniqueProgrammeKey}`,
              }))}
              heading="Collections"
              anchorTargetId="collections-menu"
            />
          </OakGridArea>

          <OakGridArea
            $colSpan={[12, 9]}
            $colStart={[1, 4]}
            $gap={["spacing-24", "spacing-48"]}
            $ph={["spacing-16", "spacing-0"]}
          >
            <TeacherBrowseAnalyticsStoreProvider
              programmeState={null}
              accessLevel="my_library"
            >
              {collections.map((collection) => (
                <MyLibraryProgrammeCard
                  key={collection.uniqueProgrammeKey}
                  programmeTitle={collection.programmeTitle}
                  anchorId={collection.uniqueProgrammeKey}
                  programmeHref={resolveOakHref({
                    page: "teacher-programme",
                    subjectPhaseSlug: collection.subjectPhaseSlug,
                    tab: "units",
                    query: {
                      keystages: collection.keystageSlug,
                      subject_categories: collection.subjectCategoryQuery,
                    },
                  })}
                  iconName={getValidSubjectIconName(collection.subjectSlug)}
                  savedUnits={collection.units.map((unit) => ({
                    ...unit,
                    examBoard: unit.examboard as ExamBoardValueType,
                    pathway: unit.pathway as PathwayValueType,
                    keyStageTitle:
                      collection.keystage as KeyStageTitleValueType,
                    keyStageSlug: collection.keystageSlug,
                    subjectTitle: collection.subject,
                    subjectSlug: collection.subjectSlug,
                    tierName: unit.tier as TierNameValueType,
                    programmeSlug: collection.programmeSlug,
                  }))}
                />
              ))}
            </TeacherBrowseAnalyticsStoreProvider>
          </OakGridArea>
        </OakGrid>
      ) : null}
    </OakMaxWidth>
  );
}
