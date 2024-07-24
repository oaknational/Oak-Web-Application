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

import Box from "@/components/SharedComponents/Box";
import { useFetch } from "@/hooks/useFetch";
import { wrapPreRelease } from "@/hooks/usePrereleaseFlag";
import { CurriculumSelectionSlugs } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";

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

export type CurriculumDownloadTabProps = {
  mvRefreshTime: number;
  slugs: CurriculumSelectionSlugs;
  tiers: { tier: string; tier_slug: string }[];
  child_subjects?: { subject: string; subject_slug: string }[];
};
const CurriculumDownloadTab: FC<CurriculumDownloadTabProps> = ({
  mvRefreshTime,
  slugs,
  tiers: snake_tiers,
  child_subjects,
}) => {
  // Convert the data into OWA component format (using camelCase instead of snake_case for keys.)

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

    // Set the subject tier selector as visible when tiers & child_subjects are present
    if (
      (snake_tiers && snake_tiers.length > 0) ||
      (child_subjects && child_subjects.length > 0)
    ) {
      setSubjectTierSelectionVisible(true);
    }
  }, [localStorageData, snake_tiers, child_subjects]);

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
    // null action
    console.log(tierSlug, childSubjectSlug);
  };

  const onSubmit = async (data: CurriculumDownloadViewData) => {
    setIsSubmitting(true);

    const slug = [
      slugs.subjectSlug,
      slugs.phaseSlug,
      "published",
      slugs.examboardSlug,
    ].join("/");
    const downloadPath = `/api/curriculum-downloads/${mvRefreshTime}/${slug}`;

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
