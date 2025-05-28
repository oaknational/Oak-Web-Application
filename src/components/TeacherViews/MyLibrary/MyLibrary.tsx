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
} from "@oaknational/oak-components";

import MyLibraryHeader from "@/components/TeacherComponents/MyLibraryHeader/MyLibraryHeader";
import NoSavedContent from "@/components/TeacherComponents/NoSavedContent/NoSavedContent";
import { UnitData } from "@/node-lib/educator-api/queries/getUserListContent/getUserListContent.types";

export type CollectionData = Array<{
  subject: string;
  subheading: string;
  examboard: string | null;
  tier: string | null;
  keystage: string;
  units: UnitData;
  programmeSlug: string;
}>;

type MyLibraryProps = {
  collectionData: CollectionData | null;
  isLoading: boolean;
};

export default function MyLibrary(props: MyLibraryProps) {
  const { collectionData, isLoading } = props;

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
                {collection.units.map((unit) => (
                  <OakP>{unit.unitTitle}</OakP>
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
