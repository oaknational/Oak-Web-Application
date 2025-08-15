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
  OakBox,
} from "@oaknational/oak-components";
import { mapKeys, camelCase, capitalize } from "lodash";

import CurriculumDownloadView, {
  CurriculumDownloadViewData,
} from "../CurriculumDownloadView";
import { DOWNLOAD_TYPE_LABELS, School } from "../CurriculumDownloadView/helper";
import CurricSuccessMessage from "../CurricSuccessMessage";

import {
  saveDownloadsDataToLocalStorage,
  useDownloadsLocalStorage,
} from "./helper";

import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly/ScreenReaderOnly";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { useFetch } from "@/hooks/useFetch";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import {
  AnalyticsUseCaseValueType,
  LearningTierValueType,
  PhaseValueType,
  ResourceTypeValueType,
} from "@/browser-lib/avo/Avo";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import { extractUrnAndSchool } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { convertUnitSlugToTitle } from "@/components/TeacherViews/Search/helpers";
import { downloadFileFromUrl } from "@/components/SharedComponents/helpers/downloadFileFromUrl";
import { createCurriculumDownloadsUrl } from "@/utils/curriculum/urls";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { doUnitsHaveNc, flatUnitsFromYearData } from "@/utils/curriculum/units";
import { ENABLE_NC_XLSX_DOCUMENT } from "@/utils/curriculum/constants";

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

export const trackCurriculumDownload = async (
  data: CurriculumDownloadViewData,
  subjectTitle: string,
  onHubspotSubmit: (data: ResourceFormProps) => Promise<string | undefined>,
  track: ReturnType<typeof useAnalytics>["track"],
  analyticsUseCase: AnalyticsUseCaseValueType,
  slugs: CurriculumSelectionSlugs,
) => {
  const { schoolId, schoolName: dataSchoolName, email, schoolNotListed } = data;

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

  track.curriculumResourcesDownloaded({
    platform: "owa",
    product: "curriculum resources",
    engagementIntent: "explore",
    componentType: "download_button",
    eventVersion: "2.0.0",
    analyticsUseCase: analyticsUseCase,
    emailSupplied: email != null,
    resourceType: ["curriculum document"] as ResourceTypeValueType[],
    schoolOption: schoolOption,
    schoolName: dataSchoolName || "",
    subjectTitle: subjectTitle,
    phase: slugs.phaseSlug as PhaseValueType,
    schoolUrn:
      !schoolId || schoolId === "homeschool"
        ? ""
        : (extractUrnAndSchool(schoolId).urn ?? ""),
    keyStageSlug: null,
    keyStageTitle: null,
  });
};

export type CurriculumDownloadTabProps = {
  mvRefreshTime: number;
  curriculumInfo: CurriculumOverviewMVData;
  slugs: CurriculumSelectionSlugs;
  tiers: { tier: string; tier_slug: string }[];
  child_subjects?: { subject: string; subject_slug: string }[];
  formattedData: CurriculumUnitsFormattedData;
};
const CurriculumDownloadTab: FC<CurriculumDownloadTabProps> = ({
  mvRefreshTime,
  slugs,
  tiers: snake_tiers,
  child_subjects,
  curriculumInfo,
  formattedData,
}) => {
  const { track } = useAnalytics();
  const { onHubspotSubmit } = useHubspotSubmit();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const availableDownloadTypes = useMemo(() => {
    return DOWNLOAD_TYPE_LABELS.map(({ id }) => id).filter((id) => {
      if (id === "national-curriculum") {
        return (
          ENABLE_NC_XLSX_DOCUMENT &&
          doUnitsHaveNc(flatUnitsFromYearData(formattedData.yearData))
        );
      }
      return true;
    });
  }, [formattedData]);

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
    downloadTypes: ["curriculum-plans"],
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
        downloadTypes: ["curriculum-plans"],
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

  const handleSubjectTierSelectionAnalytics = (
    tierSelected: string | null | undefined,
    childSubjectSlug: string | null | undefined,
  ) => {
    track.curriculumResourcesDownloadRefined({
      subjectTitle: curriculumInfo.subjectTitle,
      subjectSlug: slugs.subjectSlug,
      platform: "owa",
      product: "curriculum resources",
      engagementIntent: "refine",
      componentType: "download_tab",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      learningTier: capitalize(tierSelected || "") as LearningTierValueType,
      childSubjectName: convertUnitSlugToTitle(childSubjectSlug || ""),
      childSubjectSlug: childSubjectSlug || "",
    });
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
    handleSubjectTierSelectionAnalytics(tierSlug, childSubjectSlug);
  };

  const onSubmit = async (data: CurriculumDownloadViewData) => {
    setIsSubmitting(true);

    const downloadPath = createCurriculumDownloadsUrl(
      data.downloadTypes,
      "published",
      mvRefreshTime,
      slugs.subjectSlug,
      slugs.phaseSlug,
      slugs.ks4OptionSlug,
      tierSelected,
      childSubjectSelected,
    );

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
      await trackCurriculumDownload(
        data,
        curriculumInfo.subjectTitle,
        onHubspotSubmit,
        track,
        analyticsUseCase,
        slugs,
      );
      setIsSubmitting(false);
      setIsDone(true);
    }
  };

  if (isDone) {
    return (
      <ScrollIntoViewWhenVisisble>
        <CurricSuccessMessage
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
      <OakBox
        id="curriculum-downloads"
        aria-labelledby="curriculum-downloads-heading"
        $maxWidth={"all-spacing-24"}
        $mh={"auto"}
        $ph={"inner-padding-m"}
        $pt={["inner-padding-xl4", "inner-padding-none"]}
        $pb={["inner-padding-xl4"]}
        $mt={["space-between-none", "space-between-l", "space-between-l"]}
        $borderColor="red"
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
            availableDownloadTypes={availableDownloadTypes}
          />
        )}
      </OakBox>
    </OakThemeProvider>
  );
};

export default CurriculumDownloadTab;
