import { capitalize } from "lodash";

import {
  ResourceTypeValueType,
  PhaseValueType,
  LearningTierValueType,
} from "@/browser-lib/avo/Avo";
import {
  getSchoolOption,
  getSchoolName,
  getSchoolUrn,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import {
  ResourceFormValues,
  ResourceFormProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import { convertUnitSlugToTitle } from "@/components/TeacherViews/Search/helpers";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

export const trackCurriculumDownload = async (
  data: ResourceFormValues,
  subjectTitle: string,
  onHubspotSubmit: (data: ResourceFormProps) => Promise<string | undefined>,
  track: ReturnType<typeof useAnalytics>["track"],
  curriculumSelectionSlugs: CurriculumSelectionSlugs,
) => {
  if (!data.terms) return;
  const schoolOption = getSchoolOption(data.school);

  await onHubspotSubmit({
    school: data.school,
    schoolName: data.schoolName,
    email: data.email,
    terms: data.terms,
    resources: ["docx"],
    onSubmit: async () => {},
  });

  track.curriculumResourcesDownloaded({
    platform: "owa",
    product: "curriculum resources",
    engagementIntent: "explore",
    componentType: "download_button",
    eventVersion: "2.0.0",
    analyticsUseCase: "Teacher",
    emailSupplied: data.email != null,
    resourceType: ["curriculum document"] as ResourceTypeValueType[],
    schoolOption,
    schoolName: getSchoolName(data.school, schoolOption),
    subjectTitle: subjectTitle,
    phase: curriculumSelectionSlugs.phaseSlug as PhaseValueType,
    schoolUrn: getSchoolUrn(data.school, schoolOption),
    keyStageSlug: null,
    keyStageTitle: null,
  });
};

export const handleSubjectTierSelectionAnalytics = ({
  tierSlug,
  childSubjectSlug,
  track,
  subjectSlug,
  subjectTitle,
}: {
  tierSlug: string | null | undefined;
  childSubjectSlug: string | null | undefined;
  track: ReturnType<typeof useAnalytics>["track"];
  subjectTitle: string;
  subjectSlug: string;
}) => {
  track.curriculumResourcesDownloadRefined({
    subjectTitle: subjectTitle,
    subjectSlug: subjectSlug,
    platform: "owa",
    product: "curriculum resources",
    engagementIntent: "refine",
    componentType: "download_tab",
    eventVersion: "2.0.0",
    analyticsUseCase: "Teacher",
    learningTier: capitalize(tierSlug || "") as LearningTierValueType,
    childSubjectName: convertUnitSlugToTitle(childSubjectSlug || ""),
    childSubjectSlug: childSubjectSlug || "",
  });
};
