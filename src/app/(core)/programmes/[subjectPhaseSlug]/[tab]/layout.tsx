import { notFound, redirect, RedirectType } from "next/navigation";

import { SubjectHeroImageName } from "./Components/getSubjectHeroImageUrl";
import { getCachedProgrammeData } from "./getProgrammeData";
import { ProgrammeHeader } from "./Components/ProgrammeHeader";

import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  isValidSubjectPhaseSlug,
  getKs4RedirectSlug,
} from "@/utils/curriculum/slugs";
import { useFeatureFlag } from "@/utils/featureFlags";
import { OakBox } from "@/styles/oakThemeApp";


// TD: [integrated journey] get revalidate from env somehow
// revalidate in layout controls revalidation of child pages in route
export const revalidate = 7200;

const TAB_OPTIONS = ["Unit sequence", "Explainer", "Download"];
type TabOption = (typeof TAB_OPTIONS)[number];
export const tabsMap: Record<string, TabOption> = {
  units: "Unit sequence",
  overview: "Explainer",
  download: "Download",
};

export default async function ProgrammePageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ subjectPhaseSlug: string; tab: string }>;
}>) {
  // `useFeatureFlag` is not a hook
  const isEnabled = await useFeatureFlag(
    "teachers-integrated-journey",
    "boolean",
  );
  if (!isEnabled) {
    return notFound();
  }

  try {
    const { subjectPhaseSlug, tab } = await params;

    const tabName = tabsMap[tab];
    if (!tabName) {
      return notFound();
    }

    const cachedData = await getCachedProgrammeData(subjectPhaseSlug);

    if (!cachedData) {
      return notFound();
    }

    const {
      curriculumPhaseOptions,
      subjectPhaseKeystageSlugs,
      programmeUnitsData,
    } = cachedData;

    const validSubjectPhases = await curriculumApi2023.curriculumPhaseOptions();
    const isValid = isValidSubjectPhaseSlug(
      validSubjectPhases,
      subjectPhaseKeystageSlugs,
    );

    if (!isValid) {
      const redirectParams = getKs4RedirectSlug(
        validSubjectPhases,
        subjectPhaseKeystageSlugs,
      );
      if (redirectParams) {
        const { subjectSlug, phaseSlug, ks4OptionSlug } = redirectParams;

        return redirect(
          `/programmes/${subjectSlug}-${phaseSlug}-${ks4OptionSlug}`,
          RedirectType.replace,
        );
      } else {
        throw new OakError({
          code: "curriculum-api/not-found",
        });
      }
    }

    // Find examboard title from subject phases
    const ks4Option = validSubjectPhases
      .flatMap((subject) => subject.ks4_options)
      .find(
        (ks4opt) => ks4opt?.slug === subjectPhaseKeystageSlugs.ks4OptionSlug,
      );

    const subjectForLayout = curriculumPhaseOptions.subjects.find(
      (s) => s.slug === subjectPhaseKeystageSlugs.subjectSlug,
    );

    if (!subjectForLayout) {
      throw new Error(
        "Selected subject not found in curriculumPhaseOptions for programme page",
      );
    }

    return (
      <>
        <ProgrammeHeader
          subject={subjectForLayout.slug as SubjectHeroImageName}
          subjectTitle={programmeUnitsData.subjectTitle} //TODO: title including year, ks, category etc
          phaseTitle={programmeUnitsData.phaseTitle}
          examboardTitle={ks4Option?.title}
          summary={""}
          bullets={[""]}
          footerSlot={
            // <OakTabs
            //   sizeVariant={["compact", "default"]}
            //   colorVariant="black"
            //   activeTab={tabName}
            //   onTabClick={(tab) => {
            //     //todo: navigate
            //   }}
            //   tabs={TAB_OPTIONS}
            // />
            <OakBox>Placeholde tabs</OakBox>
          }
        />
        {children}
      </>
    );
  } catch (error) {
    // todo
    console.log("diego error", error);
  }
}
