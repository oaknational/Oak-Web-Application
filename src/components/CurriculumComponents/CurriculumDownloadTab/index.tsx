import {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  OakHeading,
  OakDownloadsJourneyChildSubjectTierSelector,
  OakThemeProvider,
  oakDefaultTheme,
  Tier,
  Subject,
} from "@oaknational/oak-components";
import { mapKeys, camelCase, capitalize } from "lodash";

import CurriculumDownloadView, {
  CurriculumDownloadViewData,
} from "../CurriculumDownloadView";
import { School } from "../CurriculumDownloadView/helper";
import SuccessMessage from "../SuccessMessage";

import {
  saveDownloadsDataToLocalStorage,
  useDownloadsLocalStorage,
} from "./helper";

import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly/ScreenReaderOnly";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import Box from "@/components/SharedComponents/Box";
import { useFetch } from "@/hooks/useFetch";
import { CurriculumSelectionSlugs } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import {
  PhaseValueType,
  ResourceFileTypeValueType,
  TierNameValueType,
} from "@/browser-lib/avo/Avo";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import { unionOrNull } from "@/utils/narrowToUnion";

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
  const tiers = useMemo<Tier[]>(() => {
    return snake_tiers && snake_tiers.length > 0
      ? snake_tiers.map(
          (tier) =>
            mapKeys(tier, (value, key) => camelCase(key)) as unknown as Tier,
        )
      : [];
  }, [snake_tiers]);

  const childSubjects = useMemo<Subject[]>(() => {
    return child_subjects && child_subjects.length > 0
      ? child_subjects.map(
          (subject) =>
            mapKeys(subject, (value, key) =>
              camelCase(key),
            ) as unknown as Subject,
        )
      : [];
  }, [child_subjects]);

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
    setChildSubjectSelected(null);
    setTierSelected(null);
    // Set the subject tier selector as visible when tiers & child_subjects are present
    if (
      (snake_tiers && snake_tiers.length > 0) ||
      (child_subjects && child_subjects.length > 0)
    ) {
      setSubjectTierSelectionVisible(true);
    } else {
      setSubjectTierSelectionVisible(false);
    }
  }, [slugs, snake_tiers, child_subjects]);

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

  useEffect(() => {
    setIsDone(false);
  }, [slugs]);

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
      school: data.schoolId ?? "notListed",
      schoolName: data.schoolName,
      email: data.email,
      terms: data.termsAndConditions,
      resources: ["docx"],
      onSubmit: async () => {},
    });

    function extractUrn(school: string) {
      return /^\d{7}|^\d{6}|^\d{3}-\d{4}/.exec(school)?.at(0);
    }

    track.curriculumResourcesDownloadedCurriculumDocument({
      subjectTitle: curriculumInfo.subjectTitle,
      subjectSlug: slugs.subjectSlug,
      phase: slugs.phaseSlug as PhaseValueType,
      analyticsUseCase: analyticsUseCase,
      emailSupplied: email != null,
      schoolOption: schoolOption,
      schoolUrn:
        !schoolId || schoolId === "homeschool"
          ? ""
          : extractUrn(schoolId) ?? "",
      schoolName: dataSchoolName || "",
      resourceFileType: resourceFileType,
      tierName: unionOrNull<TierNameValueType>(
        capitalize(tierSelected ?? undefined),
        ["Foundation", "Higher"],
      ),
      childSubjectName: subject,
      childSubjectSlug: child_subjects?.find((s) => s.subject_slug === subject)
        ?.subject,
      examBoardSlug: slugs.ks4OptionSlug,
    });
  }

  const onSubmit = async (data: CurriculumDownloadViewData) => {
    setIsSubmitting(true);

    const query = createCurriculumDownloadsQuery(
      "published",
      mvRefreshTime,
      slugs.subjectSlug,
      slugs.phaseSlug,
      slugs.ks4OptionSlug,
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

  let onBackToKs4Options: undefined | (() => void);
  if (tiers.length > 0 || childSubjects.length > 0) {
    onBackToKs4Options = () => {
      setSubjectTierSelectionVisible(true);
    };
  }

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Box
        id="curriculum-downloads"
        aria-labelledby="curriculum-downloads-heading"
        $maxWidth={1280}
        $mh={"auto"}
        $ph={18}
        $pb={[48]}
        $width={"100%"}
        role="region"
      >
        <ScreenReaderOnly>
          <OakHeading id="curriculum-downloads-heading" tag="h2">
            Download
          </OakHeading>
        </ScreenReaderOnly>
        {subjectTierSelectionVisible === true && (
          <OakDownloadsJourneyChildSubjectTierSelector
            tiers={tiers}
            childSubjects={childSubjects}
            getTierSubjectValues={handleTierSubjectSelection}
          />
        )}
        {!isLoading && subjectTierSelectionVisible === false && (
          <CurriculumDownloadView
            onBackToKs4Options={onBackToKs4Options}
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

export default CurriculumDownloadTab;
