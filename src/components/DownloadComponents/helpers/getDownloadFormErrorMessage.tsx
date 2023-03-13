const getDownloadFormErrorMessage = (errorsArray: string[]) => {
  let formErrorMessage = "Please";

  const errorMessages: Record<string, string> = {
    schoolRadio: "select a school or one of the alternative options",
    email: "enter a valid email address",
    terms: "accept terms and conditions",
    downloads: "pick at least one resource",
  };

  const errorMessagesArray = errorsArray
    .map((errorKey: string) =>
      errorMessages[errorKey] ? errorMessages[errorKey] : undefined
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
