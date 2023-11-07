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
      order: 2,
      message:
        "select school, type 'homeschool' or tick 'My school isn't listed'",
    },
    email: { order: 3, message: "enter a valid email address" },
    terms: { order: 4, message: "accept terms and conditions to download" },
    downloads: {
      order: 1,
      message: "select at least one resource to download",
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
