import type { ErrorKeysType } from "../downloads.types";

type ErrorMessagesAndOrderType = {
  order: number;
  message: string;
};

const getDownloadFormErrorMessage = (errorsArray: ErrorKeysType[]) => {
  const errorMessagesAndOrder: Record<
    ErrorKeysType,
    ErrorMessagesAndOrderType
  > = {
    school: {
      order: 1,
      message:
        "Select school, type 'homeschool' or tick 'My school isn't listed'",
    },
    email: { order: 2, message: "Enter a valid email address" },
    terms: { order: 3, message: "Accept terms and conditions to download" },
    downloads: {
      order: 4,
      message: "Select at least one resource to download",
    },
    schoolName: { order: 5, message: "" },
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

export default getDownloadFormErrorMessage;
