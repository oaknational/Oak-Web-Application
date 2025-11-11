import { protos } from "@google-cloud/dlp";

import {
  MockDlpInspectContentResponse,
  MockDlpDeidentifyContentResponse,
  PersonNameFinding,
  EmailAddressFinding,
  StreetAddressFinding,
} from "./__mocks__/fixtures/dlp-api-response.fixture";
import { SamplePiiMatches } from "./__mocks__/fixtures/pii-match.fixture";
import { identifyPiiFromString, PiiCheckResponse } from "./dlp";

const TEST_PROJECT_ID = "test-project-id";
process.env.GCP_PROJECT_ID = TEST_PROJECT_ID;
const expectedParent = `projects/${TEST_PROJECT_ID}`;

// Mock for DlpServiceClient methods
const mockInspectContent = jest.fn();
const mockDeidentifyContent = jest.fn();

jest.mock("@google-cloud/dlp", () => {
  const actualDlp = jest.requireActual("@google-cloud/dlp");

  return {
    DlpServiceClient: jest.fn().mockImplementation(() => {
      return {
        inspectContent: (a: PiiCheckResponse) => mockInspectContent(a),
        deidentifyContent: (a: PiiCheckResponse) => mockDeidentifyContent(a),
      };
    }),
    protos: actualDlp.protos,
  };
});

// Expected infoTypes used by the function under test
const expectedInfoTypesForConfig = [
  { name: "PERSON_NAME" },
  { name: "EMAIL_ADDRESS" },
  { name: "PHONE_NUMBER" },
  { name: "STREET_ADDRESS" },
];

describe("identifyPiiFromString", () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockInspectContent.mockClear();
    mockDeidentifyContent.mockClear();
  });

  it("should identify PII and return matches and redacted text", async () => {
    const inputText =
      "Contact Mr. John Doe at john.doe@example.com or 123 Main St.";
    const expectedRedactedText =
      "Contact Mr. [REDACTED] at [REDACTED] or [REDACTED]";

    // Mock inspectContent response using fixtures
    mockInspectContent.mockResolvedValueOnce([
      MockDlpInspectContentResponse([
        PersonNameFinding(),
        EmailAddressFinding(),
        StreetAddressFinding(),
      ]),
    ]);

    // Mock deidentifyContent response using fixtures
    mockDeidentifyContent.mockResolvedValueOnce([
      MockDlpDeidentifyContentResponse(expectedRedactedText),
    ]);

    const result = await identifyPiiFromString(inputText);

    // Assertions for inspectContent call
    expect(mockInspectContent).toHaveBeenCalledTimes(1);
    expect(mockInspectContent).toHaveBeenCalledWith({
      parent: expectedParent,
      item: { value: inputText },
      inspectConfig: {
        infoTypes: expectedInfoTypesForConfig,
        includeQuote: true,
        minLikelihood: protos.google.privacy.dlp.v2.Likelihood.LIKELY,
        minLikelihoodPerInfoType: [
          {
            infoType: { name: "PHONE_NUMBER" },
            minLikelihood: protos.google.privacy.dlp.v2.Likelihood.POSSIBLE,
          },
          {
            infoType: { name: "STREET_ADDRESS" },
            minLikelihood: protos.google.privacy.dlp.v2.Likelihood.POSSIBLE,
          },
        ],
      },
    });

    // Assertions for deidentifyContent call
    expect(mockDeidentifyContent).toHaveBeenCalledTimes(1);
    expect(mockDeidentifyContent).toHaveBeenCalledWith({
      parent: expectedParent,
      item: { value: inputText },
      inspectConfig: {
        infoTypes: expectedInfoTypesForConfig,
        includeQuote: true,
        minLikelihood: protos.google.privacy.dlp.v2.Likelihood.LIKELY,
        minLikelihoodPerInfoType: [
          {
            infoType: { name: "PHONE_NUMBER" },
            minLikelihood: protos.google.privacy.dlp.v2.Likelihood.POSSIBLE,
          },
          {
            infoType: { name: "STREET_ADDRESS" },
            minLikelihood: protos.google.privacy.dlp.v2.Likelihood.POSSIBLE,
          },
        ],
      },
      deidentifyConfig: {
        infoTypeTransformations: {
          transformations: [
            {
              infoTypes: expectedInfoTypesForConfig,
              primitiveTransformation: {
                replaceConfig: {
                  newValue: { stringValue: "[REDACTED]" },
                },
              },
            },
          ],
        },
      },
    });

    // Assertions for the result using fixtures
    expect(result.matches).toEqual(SamplePiiMatches());
    expect(result.redactedText).toBe(expectedRedactedText);
  });

  it("should return empty matches and original text if no PII is found", async () => {
    const inputText = "This is a completely safe sentence.";

    // Mock inspectContent response with no findings
    mockInspectContent.mockResolvedValueOnce([
      MockDlpInspectContentResponse([]), // Empty findings array
    ]);

    // Mock deidentifyContent response
    mockDeidentifyContent.mockResolvedValueOnce([
      MockDlpDeidentifyContentResponse(inputText), // Original text returned
    ]);

    const result = await identifyPiiFromString(inputText);

    expect(mockInspectContent).toHaveBeenCalledTimes(1);
    expect(mockDeidentifyContent).toHaveBeenCalledTimes(1);
    expect(result.matches).toEqual([]);
    expect(result.redactedText).toBe(inputText);
  });

  it("should handle an empty input string", async () => {
    const inputText = "";
    const expectedRedactedText = "";

    mockInspectContent.mockResolvedValueOnce([
      MockDlpInspectContentResponse([]),
    ]);
    mockDeidentifyContent.mockResolvedValueOnce([
      MockDlpDeidentifyContentResponse(expectedRedactedText),
    ]);

    const result = await identifyPiiFromString(inputText);

    expect(mockInspectContent).toHaveBeenCalledTimes(0);
    expect(mockDeidentifyContent).toHaveBeenCalledTimes(0);
    expect(result.matches).toEqual([]);
    expect(result.redactedText).toBeUndefined();
  });
});
