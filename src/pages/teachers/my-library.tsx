import {
  OakAnchorTarget,
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
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
  const { savedProgrammeUnits } = useContentLists();

  const collectionData = Object.entries(savedProgrammeUnits)
    .map(([programmeSlug, programmeData]) => {
      const { keystage, subject, examboard, tier, units } = programmeData;
      const subheading = `${examboard ? examboard + " " : ""}${tier ? tier + " " : ""}${keystage}`;
      const href = `#${programmeSlug}`;
      return {
        subject,
        subheading,
        href,
        examboard,
        tier,
        keystage,
        units,
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
        {collectionData.length === 0 ? (
          <NoSavedContent />
        ) : (
          <OakGrid $ph={["inner-padding-none", "inner-padding-xl4"]}>
            <OakGridArea $colSpan={[12, 2]}>
              <OakSideMenuNav
                menuItems={collectionData.map((item) => ({
                  heading: item.subject,
                  subheading: item.subheading,
                  href: item.href,
                }))}
                heading="Collections"
              />
            </OakGridArea>
            {/* TODO: placeholder logic for unit containers */}
            <OakGridArea $colSpan={[12, 10]}>
              {collectionData.map((collection) => (
                <OakBox>
                  <OakAnchorTarget id={collection.href} />
                  <OakHeading tag="h2">
                    {collection.subject} {collection.subheading}
                  </OakHeading>
                  {collection.units.map((unit) => (
                    <OakP>{unit.unitTitle}</OakP>
                  ))}
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
