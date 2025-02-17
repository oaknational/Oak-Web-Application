import { FieldErrors } from "react-hook-form";

import type {
  ErrorKeysType,
  ResourceFormProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";

type ErrorMessagesAndOrderType = {
  order: number;
  message: string;
};

export const getDownloadFormErrorMessage = (errorsArray: ErrorKeysType[]) => {
  const errorMessagesAndOrder: Record<
    ErrorKeysType,
    ErrorMessagesAndOrderType
  > = {
    school: {
      order: 2,
      message:
        "select school, type 'homeschool' or tick 'My school isn't listed'",
    },
    email: { order: 3, message: "enter a valid email address" },
    terms: { order: 4, message: "accept terms and conditions to continue" },
    resources: {
      order: 1,
      message: "select at least one resource to continue",
    },
    riskAssessment: {
      order: 5,
      message:
        "you need to understand that a risk assessment is required to continue",
    },
    schoolName: { order: 6, message: "" },
  };

  const sortedErrorsArray = errorsArray.sort(
    (a, b) => errorMessagesAndOrder[a]?.order - errorMessagesAndOrder[b]?.order,
  );

  const errorMessagesArray = sortedErrorsArray
    .map((errorKey: ErrorKeysType) =>
      errorMessagesAndOrder[errorKey]
        ? errorMessagesAndOrder[errorKey]?.message
        : undefined,
    )
    .filter(Boolean);

  return errorMessagesArray;
};

export const getFormErrorMessages = (
  errors: FieldErrors<ResourceFormProps>,
) => {
  const errorKeyArray = Object.keys(errors);
  const errorMessage = getDownloadFormErrorMessage(
    errorKeyArray as ErrorKeysType[],
  );
  return errorMessage;
};

export default getDownloadFormErrorMessage;
