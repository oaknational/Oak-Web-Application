import { FC, useState } from "react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import useSWR from "swr";

import CurriculumDownloadView, {
  CurriculumDownloadViewData,
} from "../CurriculumDownloadView";
import { School } from "../CurriculumDownloadView/helper";

import OakError, { ErrorInfo } from "@/errors/OakError";
import Box from "@/components/SharedComponents/Box";

function useFetch<T>(url: string, errorCode: ErrorInfo["code"]) {
  const { data, error } = useSWR<T, OakError>(url, (queryUrl: string) => {
    return fetch(queryUrl).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        const error = new OakError({
          code: errorCode,
          meta: {
            status: res.status,
            statusText: res.statusText,
            queryUrl,
            json: res.json,
          },
        });

        reportError(error);
        throw error;
      }
    });
  });
  return { data, error } as const;
}

const CurriculumDownloadTab: FC = () => {
  const schoolPickerInputValue = "the";
  const { data: testData } = useFetch<School[]>(
    `https://school-picker.thenational.academy/${schoolPickerInputValue}`,
    "school-picker/fetch-suggestions",
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<CurriculumDownloadViewData>(() => ({
    defaultSchool: "100000",
    school: undefined,
    email: "test@example.com",
    downloadType: "word",
    termsAndConditionsSchema: true,
    schoolIsntListed: false,
    // TODO: For better UX...
    loadingSchools: false,
    schools: [],
  }));

  const onSubmit = async (/* data: CurriculumDownloadViewData */) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
  };

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Box $maxWidth={1280} $mh={"auto"} $ph={18} $pb={[48]} $width={"100%"}>
        <CurriculumDownloadView
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onChange={setData}
          schools={testData ?? []}
          data={data}
        />
      </Box>
    </OakThemeProvider>
  );
};

export default CurriculumDownloadTab;
