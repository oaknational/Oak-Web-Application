import { FC, useEffect, useRef, useState } from "react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

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
import ResourcePageDetailsCompleted from "@/components/TeacherComponents/ResourcePageDetailsCompleted";

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

const CurriculumDownloadTab: FC = () => {
  const localStorageData = useDownloadsLocalStorage();
  const [isComplete, setIsComplete] = useState(localStorageData.isComplete);
  const [isDone, setIsDone] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<CurriculumDownloadViewData>(() => ({
    schoolId: localStorageData.schoolId,
    schoolName: localStorageData.schoolName,
    email: localStorageData.email,
    downloadType: "word",
    termsAndConditions: localStorageData.termsAndConditions,
    schoolNotListed: localStorageData.schoolNotListed,
    // TODO: For better UX...
    loadingSchools: false,
    schools: [],
  }));

  const schoolPickerInputValue = data.schoolName;
  const { data: schoolList } = useFetch<School[]>(
    `https://school-picker.thenational.academy/${schoolPickerInputValue}`,
    "school-picker/fetch-suggestions",
  );

  const onSubmit = async (data: CurriculumDownloadViewData) => {
    setIsSubmitting(true);
    console.log("onSubmit", { data });

    saveDownloadsDataToLocalStorage({
      schoolId: data.schoolId!,
      schoolName: data.schoolName!,
      email: data.email!,
      termsAndConditions: data.termsAndConditions!,
      schoolNotListed: data.schoolNotListed!,
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsDone(true);
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
        {!isComplete && (
          <CurriculumDownloadView
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onChange={setData}
            schools={schoolList ?? []}
            data={data}
          />
        )}
        {isComplete && (
          <ResourcePageDetailsCompleted
            school={
              data.schoolNotListed ? "My school isn’t listed" : data.schoolName
            }
            email={data.email}
            onEditClick={() => setIsComplete(false)}
          />
        )}
      </Box>
    </OakThemeProvider>
  );
};

export default CurriculumDownloadTab;
