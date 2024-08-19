import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  OakDownloadsJourneyChildSubjectTierSelector,
  OakThemeProvider,
  oakDefaultTheme,
  Tier,
  Subject,
} from "@oaknational/oak-components";
import { mapKeys, camelCase } from "lodash";

import CurriculumDownloadView, {
  CurriculumDownloadViewData,
} from "../CurriculumDownloadView";
import { School } from "../CurriculumDownloadView/helper";
import SuccessMessage from "../SuccessMessage";

import {
  saveDownloadsDataToLocalStorage,
  useDownloadsLocalStorage,
} from "./helper";

import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import Box from "@/components/SharedComponents/Box";
import { useFetch } from "@/hooks/useFetch";
import { wrapPreRelease } from "@/hooks/usePrereleaseFlag";
import { CurriculumSelectionSlugs } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import {
  PhaseValueType,
  ResourceFileTypeValueType,
} from "@/browser-lib/avo/Avo";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";

function ScrollIntoViewWhenVisisble({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, [ref]);
  return <div ref={ref}>{children}</div>;
}

export function createCurriculumDownloadsQuery(
  state: "new" | "published",
  mvRefreshTime: number,
  subjectSlug: string,
  phaseSlug: string,
  examboardSlug: string | null,
  tierSlug: string | null,
  childSubjectSlug: string | null,
) {
  const query = new URLSearchParams({
    mvRefreshTime: String(mvRefreshTime),
    subjectSlug: subjectSlug,
    phaseSlug: phaseSlug,
    state: state,
  });
  examboardSlug && query.set("examboardSlug", examboardSlug);
  tierSlug && tierSlug !== null && query.set("tierSlug", tierSlug);
  childSubjectSlug &&
    childSubjectSlug !== null &&
    query.set("childSubjectSlug", childSubjectSlug);

  return query;
}

export type CurriculumDownloadTabProps = {
  mvRefreshTime: number;
  curriculumInfo: CurriculumOverviewMVData;
  slugs: CurriculumSelectionSlugs;
  tiers: { tier: string; tier_slug: string }[];
  child_subjects?: { subject: string; subject_slug: string }[];
};
const CurriculumDownloadTab: FC<CurriculumDownloadTabProps> = ({
  mvRefreshTime,
  slugs,
  tiers: snake_tiers,
  child_subjects,
  curriculumInfo,
}) => {
  const { track } = useAnalytics();
  const { onHubspotSubmit } = useHubspotSubmit();
  const { analyticsUseCase } = useAnalyticsPageProps();

  // Convert the data into OWA component format (using camelCase instead of snake_case for keys.)
  const [tierSelected, setTierSelected] = useState<string | null>(null);
  const [childSubjectSelected, setChildSubjectSelected] = useState<
    string | null
  >(null);
  const [tiers] = useState<Tier[]>(
    snake_tiers && snake_tiers.length > 0
      ? snake_tiers.map(
          (tier) =>
            mapKeys(tier, (value, key) => camelCase(key)) as unknown as Tier,
        )
      : [],
  );
  const [childSubjects] = useState<Subject[]>(
    child_subjects && child_subjects.length > 0
      ? child_subjects.map(
          (subject) =>
            mapKeys(subject, (value, key) =>
              camelCase(key),
            ) as unknown as Subject,
        )
      : [],
  );

  const { isLoading, data: localStorageData } = useDownloadsLocalStorage();
  const [isDone, setIsDone] = useState(false);
  const [subjectTierSelectionVisible, setSubjectTierSelectionVisible] =
    useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<CurriculumDownloadViewData>(() => ({
    schoolId: undefined,
    schoolName: undefined,
    email: undefined,
    downloadType: "word",
    termsAndConditions: false,
    schoolNotListed: false,
    schools: [],
  }));

  useLayoutEffect(() => {
    // Set the subject tier selector as visible when tiers & child_subjects are present
    if (
      (snake_tiers && snake_tiers.length > 0) ||
      (child_subjects && child_subjects.length > 0)
    ) {
      setSubjectTierSelectionVisible(true);
    }
  }, [snake_tiers, child_subjects]);

  useLayoutEffect(() => {
    if (localStorageData) {
      setData({
        schoolId: localStorageData.schoolId,
        schoolName: localStorageData.schoolName,
        email: localStorageData.email,
        downloadType: "word",
        termsAndConditions: localStorageData.termsAndConditions,
        schoolNotListed: localStorageData.schoolNotListed,
        schools: [],
      });
    }
  }, [localStorageData]);

  const schoolPickerInputValue = data.schoolName;
  const { data: schoolList } = useFetch<School[]>(
    `https://school-picker.thenational.academy/${schoolPickerInputValue}`,
    "school-picker/fetch-suggestions",
  );

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;

    // Note: Optionally use 'x-filename' so we get the same filename on server and client
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  const downloadFileFromUrl = async (downloadPath: string) => {
    const resp = await fetch(downloadPath);

    if (resp.status !== 200) {
      throw new Error(`Error: ${resp.status} ${resp.statusText}`);
    }

    const blob = await resp.blob();
    const filename = resp.headers.get("x-filename") ?? "download.docx";
    downloadBlob(blob, filename);
  };

  const handleTierSubjectSelection = (
    tierSlug: string,
    childSubjectSlug?: string | null,
  ) => {
    setSubjectTierSelectionVisible(false);
    if (tierSlug && tierSlug.length > 0) {
      setTierSelected(tierSlug);
    }
    if (childSubjectSlug && childSubjectSlug.length > 0) {
      setChildSubjectSelected(childSubjectSlug);
    }
  };

  async function trackCurriculumDownload(
    data: CurriculumDownloadViewData,
    subject: string,
    resourceFileType: ResourceFileTypeValueType,
  ) {
    const {
      schoolId,
      schoolName: dataSchoolName,
      email,
      schoolNotListed,
    } = data;

    if (!data.termsAndConditions) return;

    const schoolName =
      dataSchoolName === "Homeschool" ? "Homeschool" : "Selected school";
    const schoolOption = schoolNotListed === true ? "Not listed" : schoolName;

    await onHubspotSubmit({
      school: data.schoolId ?? "0",
      schoolName: data.schoolName,
      email: data.email,
      terms: data.termsAndConditions,
      resources: ["docx"],
      onSubmit: async () => {},
    });

    // @ts-expect-error: ignored due to variant types
    track.curriculumResourcesDownloadedCurriculumDocument({
      subjectTitle: curriculumInfo.subjectTitle,
      subjectSlug: slugs.subjectSlug,
      phase: slugs.phaseSlug as PhaseValueType,
      analyticsUseCase: analyticsUseCase,
      emailSupplied: email != null,
      schoolOption: schoolOption,
      schoolUrn: schoolId ? parseInt(schoolId) : 0,
      schoolName: dataSchoolName || "",
      resourceFileType: resourceFileType,
      tierName: tierSelected,
      childSubjectName: subject,
      childSubjectSlug: child_subjects?.find((s) => s.subject_slug === subject)
        ?.subject,
      examBoardSlug: slugs.examboardSlug,
    });
  }

  const onSubmit = async (data: CurriculumDownloadViewData) => {
    setIsSubmitting(true);

    const query = createCurriculumDownloadsQuery(
      "published",
      mvRefreshTime,
      slugs.subjectSlug,
      slugs.phaseSlug,
      slugs.examboardSlug,
      tierSelected,
      childSubjectSelected,
    );
    const downloadPath = `/api/curriculum-downloads/?${query}`;

    const schoolData = {
      schoolId: data.schoolId!,
      schoolName: data.schoolName!,
      email: data.email!,
      termsAndConditions: data.termsAndConditions!,
      schoolNotListed: data.schoolNotListed!,
    };
    saveDownloadsDataToLocalStorage(schoolData);

    try {
      await downloadFileFromUrl(downloadPath);
      // TODO: Log to hubspot here...
    } finally {
      trackCurriculumDownload(data, slugs.subjectSlug, "docx");
      setIsSubmitting(false);
      setIsDone(true);
    }
  };

  if (isDone) {
    return (
      <ScrollIntoViewWhenVisisble>
        <SuccessMessage
          title="Thanks for downloading"
          message="We hope you find the resources useful. Click the question mark in the bottom-right corner to share your feedback."
          buttonProps={{
            label: "Back to downloads",
            onClick: () => {
              setIsDone(false);
            },
          }}
        />
      </ScrollIntoViewWhenVisisble>
    );
  }

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Box $maxWidth={1280} $mh={"auto"} $ph={18} $pb={[48]} $width={"100%"}>
        {subjectTierSelectionVisible === true && (
          <OakDownloadsJourneyChildSubjectTierSelector
            tiers={tiers}
            childSubjects={childSubjects}
            getTierSubjectValues={handleTierSubjectSelection}
          />
        )}
        {!isLoading && subjectTierSelectionVisible === false && (
          <CurriculumDownloadView
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onChange={setData}
            schools={schoolList ?? []}
            data={data}
          />
        )}
      </Box>
    </OakThemeProvider>
  );
};

export default wrapPreRelease(CurriculumDownloadTab, "curriculum.downloads");
