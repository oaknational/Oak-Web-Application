import {
  OakMaxWidth,
  OakGrid,
  OakGridArea,
  OakSideMenuNav,
  OakBox,
  OakAnchorTarget,
  OakHeading,
  OakP,
  OakLink,
  OakPrimaryButton,
  OakFlex,
} from "@oaknational/oak-components";

import MyLibraryHeader from "@/components/TeacherComponents/MyLibraryHeader/MyLibraryHeader";
import NoSavedContent from "@/components/TeacherComponents/NoSavedContent/NoSavedContent";
import { UnitData } from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent.types";
import { TrackingProgrammeData } from "@/node-lib/educator-api/helpers/saveUnits/utils";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

export type CollectionData = Array<{
  subject: string;
  subjectSlug: string;
  subheading: string;
  examboard: string | null;
  tier: string | null;
  keystage: string;
  keystageSlug: string;
  units: UnitData;
  programmeSlug: string;
}>;

type MyLibraryProps = {
  collectionData: CollectionData | null;
  isLoading: boolean;
  onSaveToggle: (
    unitSlug: string,
    programmeSlug: string,
    trackingData: TrackingProgrammeData,
  ) => void;
};

export default function MyLibrary(props: MyLibraryProps) {
  const { collectionData, isLoading, onSaveToggle } = props;

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
          {/* TODO: placeholder logic for unit containers */}
          <OakGridArea
            $colSpan={[12, 9]}
            $colStart={[1, 4]}
            $gap="space-between-l"
          >
            {collectionData.map((collection) => (
              <OakBox $position="relative" key={collection.programmeSlug}>
                <OakAnchorTarget id={collection.programmeSlug} />

                <OakHeading tag="h2">
                  {collection.subject} {collection.subheading}
                </OakHeading>
                {collection.units
                  .sort(
                    (a, b) =>
                      a.yearOrder - b.yearOrder || a.unitOrder - b.unitOrder,
                  )
                  .map((unit) => (
                    <OakFlex $alignItems="center">
                      <OakP key={unit.unitSlug}>{unit.unitTitle}</OakP>
                      <OakPrimaryButton
                        onClick={() =>
                          onSaveToggle(
                            unit.unitSlug,
                            collection.programmeSlug,
                            {
                              keyStageTitle:
                                collection.keystage as KeyStageTitleValueType,
                              subjectTitle: collection.subject,
                              savedFrom: "my-library-save-button",
                              keyStageSlug: collection.keystageSlug,
                              subjectSlug: collection.subjectSlug,
                            },
                          )
                        }
                      >
                        Save / Unsave
                      </OakPrimaryButton>
                    </OakFlex>
                  ))}
                <OakLink href="#collections-menu"> Back to collections</OakLink>
              </OakBox>
            ))}
          </OakGridArea>
        </OakGrid>
      )}
    </OakMaxWidth>
  );
}
