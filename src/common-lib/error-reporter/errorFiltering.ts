const IGNORED_FILE_PATTERNS = [
  // Testing
  /OAK_TEST_ERROR_STACKTRACE_FILE/i,
  // Don't error external Hubspot script problems
  /\/\/[a-zA-Z0-9-]+\.hubspot\.com/i,
  /\/\/[a-zA-Z0-9-]+\.hsleadflows\.net/i,
];

const IGNORED_MESSAGE_PATTERNS = [
  // Testing
  /Test error/i,
  // Hubspot multiple initialisation error.
  // https://github.com/oaknational/Oak-Web-Application/issues/999
  /Multiple lead flow scripts are trying to run on the current page/i,
  /t.report is not a function/i,
  /null is not an object (evaluating 'e.portalId')/i,
  /Hubspot script failed to load/i,
  // Ignored because the error is due to a video deliberately expiring on the staging data while we temporarily build the pre-release experience against staging
  /undefined is not an object (evaluating 'e.find(e=>e.startsWith("#EXT-X-TARGETDURATION")).split')/i,
];

/**
 * Test if a user agent matches any in a list of regex patterns.
 */
const matchesUserAgent = (ua: string) => {
  const userAgentsToMatch = [/Detectify/i, /Percy/i];
  return userAgentsToMatch.some((regex) => regex.test(ua));
};

const matchesIgnoredErrorBugsnag = (error: {
  errorMessage: string;
  stacktrace: { file: string }[];
}) => {
  return (
    IGNORED_FILE_PATTERNS.some((regex) =>
      error.stacktrace.some((stacktrace) => regex.test(stacktrace.file)),
    ) ||
    IGNORED_MESSAGE_PATTERNS.some((regex) => regex.test(error.errorMessage))
  );
};

const matchesIgnoredErrorSentry = (exception: {
  value?: string;
  stacktrace?: { frames?: { filename?: string }[] };
}) => {
  return (
    IGNORED_FILE_PATTERNS.some((regex) =>
      exception.stacktrace?.frames?.some(
        (frame) => frame.filename && regex.test(frame.filename),
      ),
    ) ||
    IGNORED_MESSAGE_PATTERNS.some(
      (regex) => exception.value && regex.test(exception.value),
    )
  );
};

export {
  matchesUserAgent,
  matchesIgnoredErrorBugsnag,
  matchesIgnoredErrorSentry,
};
