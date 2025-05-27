import {
  OakAnchorTarget,
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakLink,
  OakMaxWidth,
  OakP,
  OakSideMenuNav,
} from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { Wall } from "@/components/AppComponents/Wall";
import AppLayout from "@/components/SharedComponents/AppLayout";
import withFeatureFlag from "@/hocs/withFeatureFlag";
import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import MyLibraryHeader from "@/components/TeacherComponents/MyLibraryHeader/MyLibraryHeader";
import NoSavedContent from "@/components/TeacherComponents/NoSavedContent/NoSavedContent";
import { useContentLists } from "@/node-lib/educator-api/helpers/saveUnits/useSaveContentLists";

function MyLibraryPage() {
  const { savedProgrammeUnits, isLoading } = useContentLists();

  const collectionData = Object.entries(savedProgrammeUnits)
    .map(([programmeSlug, programmeData]) => {
      const { keystage, subject, examboard, tier, units } = programmeData;
      const subheading = `${examboard ? examboard + " " : ""}${tier ? tier + " " : ""}${keystage}`;
      return {
        subject,
        subheading,
        examboard,
        tier,
        keystage,
        units,
        programmeSlug,
      };
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      return (
        a.subject.localeCompare(b.subject) ||
        a.subheading.localeCompare(b.subheading)
      );
    });

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
        $gap={["space-between-none", "space-between-l"]}
        $pb="inner-padding-xl"
        $pt={["inner-padding-none", "inner-padding-xl"]}
      >
        <MyLibraryHeader />
        {isLoading ? null : collectionData.length === 0 ? (
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
                  <OakLink href="#collections-menu">
                    {" "}
                    Back to collections
                  </OakLink>
                </OakBox>
              ))}
            </OakGridArea>
          </OakGrid>
        )}
      </OakMaxWidth>
    </AppLayout>
  );
}

export default withFeatureFlag(
  withPageAuthRequired(withOnboardingRequired(MyLibraryPage, Wall), Wall),
  "teacher-save-units",
);
