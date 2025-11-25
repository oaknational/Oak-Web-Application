import { PiiMatch } from "@/node-lib/pupil-api/types";

/**
 * Creates a PiiMatch object.
 * @param partial - Partial PiiMatch data to override defaults.
 * @returns A PiiMatch object.
 */
export const PiiMatchFixture = (partial?: Partial<PiiMatch>): PiiMatch => {
  return {
    string: "Default PII String",
    infoType: "PERSON_NAME",
    startIndex: 1,
    endIndex: 10,
    ...partial,
  };
};

/**
 * Generates an array of PiiMatch objects for common test scenarios.
 * @returns An array of PiiMatch objects.
 */
export const SamplePiiMatches = (): PiiMatch[] => [
  PiiMatchFixture({
    string: "John Doe",
    infoType: "PERSON_NAME",
    startIndex: 16, // "15" + 1
    endIndex: 24, // "23" + 1
  }),
  PiiMatchFixture({
    string: "john.doe@example.com",
    infoType: "EMAIL_ADDRESS",
    startIndex: 28, // "27" + 1
    endIndex: 48, // "47" + 1
  }),
  PiiMatchFixture({
    string: "123 Main St.",
    infoType: "STREET_ADDRESS",
    startIndex: 52, // "51" + 1
    endIndex: 64, // "63" + 1
  }),
];
