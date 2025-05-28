import {
  OakMaxWidth,
  OakGrid,
  OakGridArea,
  OakSideMenuNav,
} from "@oaknational/oak-components";

import MyLibraryHeader from "@/components/TeacherComponents/MyLibraryHeader/MyLibraryHeader";
import NoSavedContent from "@/components/TeacherComponents/NoSavedContent/NoSavedContent";
import { MyLibraryUnit } from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent.types";
import { TrackingProgrammeData } from "@/node-lib/educator-api/helpers/saveUnits/utils";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import { resolveOakHref } from "@/common-lib/urls";
import MyLibrarySubjectCard from "@/components/TeacherComponents/MyLibrarySubjectCard/MyLibrarySubjectCard";

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
}>;

type MyLibraryProps = {
  collectionData: CollectionData | null;
  isLoading: boolean;
  onSaveToggle: (
    unitSlug: string,
    programmeSlug: string,
    trackingData: TrackingProgrammeData,
  ) => void;
  isUnitSaved: (unitSlug: string) => boolean;
};

export default function MyLibrary(props: MyLibraryProps) {
  const { collectionData, isLoading, onSaveToggle, isUnitSaved } = props;

  return (
    <OakMaxWidth
      $gap={["space-between-none", "space-between-l"]}
      $pb="inner-padding-xl"
      $pt={["inner-padding-none", "inner-padding-xl"]}
      $flexDirection="column"
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
                href: `#${item.programmeSlug}`,
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
              <MyLibrarySubjectCard
                key={collection.programmeSlug}
                programmeTitle={collection.programmeTitle}
                programmeSlug={collection.programmeSlug}
                programmeHref={resolveOakHref({
                  page: "unit-index",
                  programmeSlug: collection.programmeSlug,
                  search: {
                    category: collection.searchQuery,
                  },
                })}
                subjectSlug={collection.subjectSlug}
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
                  isSaved: isUnitSaved(unit.unitSlug),
                }))}
              />
            ))}
          </OakGridArea>
        </OakGrid>
      )}
    </OakMaxWidth>
  );
}
