import { protos } from "@google-cloud/dlp";

/**
 * Creates a mock IInspectContentResponse.
 * @param findings - An array of findings to include in the response. Defaults to an empty array.
 * @returns A mock IInspectContentResponse object.
 */
export const MockDlpInspectContentResponse = (
  findings: protos.google.privacy.dlp.v2.IFinding[] = [],
): protos.google.privacy.dlp.v2.IInspectContentResponse => {
  return {
    result: {
      findings,
    },
  };
};

/**
 * Creates a mock IDeidentifyContentResponse.
 * @param redactedText - The redacted text to include in the response.
 * @returns A mock IDeidentifyContentResponse object.
 */
export const MockDlpDeidentifyContentResponse = (
  redactedText: string | null | undefined,
): protos.google.privacy.dlp.v2.IDeidentifyContentResponse => {
  return {
    item: { value: redactedText },
  };
};

// --- Example Findings for InspectContent ---

/**
 * Generates a sample finding for a person's name.
 * @param quote - The text identified as PII.
 * @param start - The start codepoint index.
 * @param end - The end codepoint index.
 * @returns A mock IFinding object.
 */
export const PersonNameFinding = (
  quote = "John Doe",
  start = "15",
  end = "23",
): protos.google.privacy.dlp.v2.IFinding => ({
  quote,
  infoType: { name: "PERSON_NAME" },
  location: { codepointRange: { start, end } },
  likelihood: protos.google.privacy.dlp.v2.Likelihood.LIKELY,
});

/**
 * Generates a sample finding for an email address.
 * @param quote - The text identified as PII.
 * @param start - The start codepoint index.
 * @param end - The end codepoint index.
 * @returns A mock IFinding object.
 */
export const EmailAddressFinding = (
  quote = "john.doe@example.com",
  start = "27",
  end = "47",
): protos.google.privacy.dlp.v2.IFinding => ({
  quote,
  infoType: { name: "EMAIL_ADDRESS" },
  location: { codepointRange: { start, end } },
  likelihood: protos.google.privacy.dlp.v2.Likelihood.LIKELY,
});

/**
 * Generates a sample finding for a street address.
 * @param quote - The text identified as PII.
 * @param start - The start codepoint index.
 * @param end - The end codepoint index.
 * @returns A mock IFinding object.
 */
export const StreetAddressFinding = (
  quote = "123 Main St.",
  start = "51",
  end = "63",
): protos.google.privacy.dlp.v2.IFinding => ({
  quote,
  infoType: { name: "STREET_ADDRESS" },
  location: { codepointRange: { start, end } },
  likelihood: protos.google.privacy.dlp.v2.Likelihood.LIKELY,
});
