import {
  OakGrid,
  OakGridArea,
  OakMaxWidth,
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

  const sideMenuItems = savedProgrammeUnits
    ? Object.entries(savedProgrammeUnits)
        .map(([programmeSlug, programmeUnits]) => {
          const firstUnit = programmeUnits[0];
          if (!firstUnit) return null;
          const { keystage, subject, examboard, tier } = firstUnit;
          return {
            heading: subject,
            subheading: `${examboard ? examboard + " " : ""}${tier ? tier + " " : ""}${keystage}`,
            href: `#${programmeSlug}`,
          };
        })
        .sort((a, b) => {
          if (!a || !b) return 0;
          return (
            a.heading.localeCompare(b.heading) ||
            a.subheading.localeCompare(b.subheading)
          );
        })
    : undefined;

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
        {!sideMenuItems ? (
          <NoSavedContent />
        ) : (
          <OakGrid $ph={["inner-padding-none", "inner-padding-xl4"]}>
            <OakGridArea $colSpan={[12, 2]}>
              <OakSideMenuNav
                menuItems={sideMenuItems.filter((item) => !!item)}
                heading="Collections"
              />
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
