import type { ErrorKeysType } from "../downloads.types";

type ErrorMessagesAndOrderType = {
  order: number;
  message: string;
};

const getDownloadFormErrorMessage = (errorsArray: ErrorKeysType[]) => {
  let formErrorMessage = "Please";

  const errorMessagesAndOrder: Record<
    ErrorKeysType,
    ErrorMessagesAndOrderType
  > = {
    schoolRadio: {
      order: 1,
      message: "select a school or one of the alternative options",
    },
    email: { order: 2, message: "enter a valid email address" },
    terms: { order: 3, message: "accept terms and conditions" },
    downloads: { order: 4, message: "pick at least one resource" },
  };

  const sortedErrorsArray = errorsArray.sort(
    (a, b) => errorMessagesAndOrder[a]?.order - errorMessagesAndOrder[b]?.order
  );

  const errorMessagesArray = sortedErrorsArray
    .map((errorKey: ErrorKeysType) =>
      errorMessagesAndOrder[errorKey]
        ? errorMessagesAndOrder[errorKey]?.message
        : undefined
    )
    .filter(Boolean);

  const errorCount = errorMessagesArray?.length;

  if (errorCount === 1) {
    formErrorMessage = `${formErrorMessage} ${errorMessagesArray[0]}`;
  } else if (errorCount === 2) {
    formErrorMessage = `${formErrorMessage} ${errorMessagesArray[0]} and ${errorMessagesArray[1]}`;
  } else if (errorCount > 2) {
    const allErrors = errorMessagesArray.map((errorMessage, i) => {
      if (i < errorCount - 2) {
        return `${errorMessage}, `;
      } else if (i === errorCount - 2) {
        return `${errorMessage} and `;
      } else {
        return errorMessage;
      }
    });

    formErrorMessage = `${formErrorMessage} ${allErrors.join("")}`;
  }

  return formErrorMessage;
};

export default getDownloadFormErrorMessage;
