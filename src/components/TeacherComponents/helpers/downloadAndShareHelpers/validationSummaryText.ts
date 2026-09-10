export const VALIDATION_SUMMARY_PREFIX = "To complete, correct the following:";

export const getValidationSummaryAnnouncement = (
  validationErrorMessages: Array<string | undefined>,
) => {
  const messages = validationErrorMessages.filter(
    (message): message is string => Boolean(message),
  );

  if (messages.length === 0) {
    return VALIDATION_SUMMARY_PREFIX;
  }

  return `${VALIDATION_SUMMARY_PREFIX} ${messages.join(". ")}`;
};
