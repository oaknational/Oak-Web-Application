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
  getUnitProgrammeSlug,
  TrackingProgrammeData,
} from "@/node-lib/educator-api/helpers/saveUnits/utils";
import {
  ExamBoardValueType,
  KeyStageTitleValueType,
  PathwayValueType,
  TierNameValueType,
} from "@/browser-lib/avo/Avo";
import { resolveOakHref } from "@/common-lib/urls";
import MyLibraryProgrammeCard from "@/components/TeacherComponents/MyLibraryProgrammeCard/MyLibraryProgrammeCard";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import useAnalytics from "@/context/Analytics/useAnalytics";

export type CollectionData = Array<{
  subject: string;
  subjectSlug: string;
  subheading: string;
  keystage: string;
  keystageSlug: string;
  units: Array<MyLibraryUnit>;
  programmeSlug: string;
  programmeTitle: string;
  searchQuery: string | null;
  uniqueProgrammeKey: string;
}>;

type MyLibraryProps = {
  collectionData: CollectionData | null;
  isLoading: boolean;
  onSaveToggle: (
    unitSlug: string,
    programmeSlug: string,
    uniqueProgrammeKey: string,
    trackingData: TrackingProgrammeData,
  ) => void;
  isUnitSaved: (unitProgrammeSlug: string) => boolean;
  isUnitSaving: (unitProgrammeSlug: string) => boolean;
};

export default function MyLibrary(props: Readonly<MyLibraryProps>) {
  const { collectionData, isLoading, onSaveToggle, isUnitSaved, isUnitSaving } =
    props;
  const { track } = useAnalytics();
  return (
    <OakMaxWidth
      $gap={["spacing-0", "spacing-48"]}
      $pb="spacing-24"
      $pt={["spacing-0", "spacing-24"]}
      $flexDirection="column"
      $maxWidth={["unset", "spacing-1280"]}
    >
      <MyLibraryHeader />
      {isLoading || !collectionData ? null : collectionData.length === 0 ? (
        <NoSavedContent />
      ) : (
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
              menuItems={collectionData.map((item) => ({
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
            {collectionData.map((collection) => (
              <MyLibraryProgrammeCard
                key={collection.uniqueProgrammeKey}
                programmeTitle={collection.programmeTitle}
                anchorId={collection.uniqueProgrammeKey}
                programmeHref={resolveOakHref({
                  page: "unit-index",
                  programmeSlug: collection.programmeSlug,
                  search: {
                    category: collection.searchQuery,
                  },
                })}
                trackBrowseRefined={() =>
                  track.browseRefined({
                    platform: "owa",
                    product: "teacher lesson resources",
                    engagementIntent: "refine",
                    componentType: "programme_card",
                    eventVersion: "2.0.0",
                    analyticsUseCase: "Teacher",
                    filterType: "Subject filter",
                    filterValue: collection.subject,
                    activeFilters: [],
                  })
                }
                iconName={getValidSubjectIconName(collection.subjectSlug)}
                savedUnits={collection.units.map((unit) => ({
                  ...unit,
                  programmeSlug: collection.programmeSlug,
                  trackUnitAccessed: () =>
                    track.unitAccessed({
                      platform: "owa",
                      product: "teacher lesson resources",
                      engagementIntent: "refine",
                      componentType: "unit_card",
                      eventVersion: "2.0.0",
                      analyticsUseCase: "Teacher",
                      unitName: unit.unitTitle,
                      unitSlug: unit.unitSlug,
                      subjectTitle: collection.subject,
                      subjectSlug: collection.subjectSlug,
                      keyStageTitle:
                        collection.keystage as KeyStageTitleValueType,
                      keyStageSlug: collection.keystageSlug,
                      yearGroupName: unit.year,
                      yearGroupSlug: unit.yearSlug,
                      tierName: unit.tier as TierNameValueType,
                      examBoard: unit.examboard as ExamBoardValueType,
                      pathway: unit.pathway as PathwayValueType,
                    }),
                  trackLessonAccessed: (lessonSlug: string) =>
                    track.lessonAccessed({
                      platform: "owa",
                      product: "teacher lesson resources",
                      engagementIntent: "refine",
                      componentType: "lesson_card",
                      eventVersion: "2.0.0",
                      analyticsUseCase: "Teacher",
                      unitName: unit.unitTitle,
                      unitSlug: unit.unitSlug,
                      lessonName: lessonSlug,
                      keyStageTitle:
                        collection.keystage as KeyStageTitleValueType,
                      keyStageSlug: collection.keystageSlug,
                      yearGroupName: unit.year,
                      yearGroupSlug: unit.yearSlug,
                      tierName: unit.tier as TierNameValueType,
                      examBoard: unit.examboard as ExamBoardValueType,
                      pathway: unit.pathway as PathwayValueType,
                      lessonSlug,
                      lessonReleaseCohort: "2023-2026",
                      lessonReleaseDate: "", // we don't have access to lesson content data here
                    }),
                  onSave: () =>
                    onSaveToggle(
                      unit.unitSlug,
                      collection.programmeSlug,
                      collection.uniqueProgrammeKey,
                      {
                        keyStageTitle:
                          collection.keystage as KeyStageTitleValueType,
                        subjectTitle: collection.subject,
                        savedFrom: "my-library-save-button",
                        keyStageSlug: collection.keystageSlug,
                        subjectSlug: collection.subjectSlug,
                      },
                    ),
                  isSaved: isUnitSaved(
                    getUnitProgrammeSlug(
                      unit.unitSlug,
                      collection.uniqueProgrammeKey,
                    ),
                  ),
                  isSaving: isUnitSaving(
                    getUnitProgrammeSlug(
                      unit.unitSlug,
                      collection.uniqueProgrammeKey,
                    ),
                  ),
                }))}
              />
            ))}
          </OakGridArea>
        </OakGrid>
      )}
    </OakMaxWidth>
  );
}
