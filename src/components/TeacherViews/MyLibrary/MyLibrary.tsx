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
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import { resolveOakHref } from "@/common-lib/urls";
import MyLibraryProgrammeCard from "@/components/TeacherComponents/MyLibraryProgrammeCard/MyLibraryProgrammeCard";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

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
    trackingData: TrackingProgrammeData,
  ) => void;
  isUnitSaved: (unitProgrammeSlug: string) => boolean;
  isUnitSaving: (unitProgrammeSlug: string) => boolean;
};

export default function MyLibrary(props: MyLibraryProps) {
  const { collectionData, isLoading, onSaveToggle, isUnitSaved, isUnitSaving } =
    props;

  return (
    <OakMaxWidth
      $gap={["space-between-none", "space-between-l"]}
      $pb="inner-padding-xl"
      $pt={["inner-padding-none", "inner-padding-xl"]}
      $flexDirection="column"
      $maxWidth={["unset", "all-spacing-24"]}
    >
      <MyLibraryHeader />
      {isLoading || !collectionData ? null : collectionData.length === 0 ? (
        <NoSavedContent />
      ) : (
        <OakGrid
          $ph={["inner-padding-none", "inner-padding-xl4"]}
          $position="relative"
          $rg={"space-between-m"}
        >
          <OakGridArea
            $colSpan={[12, 2]}
            $position={["static", "sticky"]}
            $top={"all-spacing-0"}
            $alignSelf={"start"}
            $maxHeight={["unset", "100vh"]}
            $pv={["inner-padding-none", "inner-padding-l"]}
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
            $gap={["space-between-m", "space-between-l"]}
            $ph={["inner-padding-m", "inner-padding-none"]}
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
                iconName={getValidSubjectIconName(collection.subjectSlug)}
                savedUnits={collection.units.map((unit) => ({
                  ...unit,
                  programmeSlug: collection.programmeSlug,
                  onSave: () =>
                    onSaveToggle(unit.unitSlug, collection.programmeSlug, {
                      keyStageTitle:
                        collection.keystage as KeyStageTitleValueType,
                      subjectTitle: collection.subject,
                      savedFrom: "my-library-save-button",
                      keyStageSlug: collection.keystageSlug,
                      subjectSlug: collection.subjectSlug,
                    }),
                  isSaved: isUnitSaved(
                    getUnitProgrammeSlug(
                      unit.unitSlug,
                      collection.programmeSlug,
                    ),
                  ),
                  isSaving: isUnitSaving(
                    getUnitProgrammeSlug(
                      unit.unitSlug,
                      collection.programmeSlug,
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
