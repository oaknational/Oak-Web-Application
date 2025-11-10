import DLP, { protos } from "@google-cloud/dlp";

import { PiiMatch } from "@/node-lib/pupil-api/types";

const projectId = process.env.PROJECT_ID;

if (!projectId) {
  throw new Error("PROJECT_ID is required");
}

const dlp = new DLP.DlpServiceClient({
  projectId,
});

const parent = `projects/${projectId}`;

export type PiiCheckResponse = {
  matches: PiiMatch[];
  redactedText?: string | undefined;
};

type DlpDeidentifyRequest =
  protos.google.privacy.dlp.v2.IDeidentifyContentRequest;
type DlpInspectRequest = protos.google.privacy.dlp.v2.IInspectConfig;

export const identifyPiiFromString = async (
  text: string,
): Promise<PiiCheckResponse> => {
  if (text.trim() === "") return { matches: [] };

  // Define which info types to look for (customize as needed)
  const infoTypes = [
    { name: "PERSON_NAME" },
    { name: "EMAIL_ADDRESS" },
    { name: "PHONE_NUMBER" },
    { name: "STREET_ADDRESS" },
  ];

  // Configure the inspection
  const inspectConfig: DlpInspectRequest = {
    infoTypes,
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
  };

  // Inspect text for PII
  const [inspectResponse] = await dlp.inspectContent({
    parent,
    item: { value: text },
    inspectConfig,
  });

  // Parse found PII matches in text
  const parseCodepoint = (
    c?: protos.google.privacy.dlp.v2.IRange["start"],
  ): number => (c ? parseInt(c.toString(), 10) + 1 : -1);
  const matches: PiiMatch[] = (inspectResponse.result?.findings ?? []).map(
    (f) => ({
      string: f.quote ?? "",
      infoType: (f.infoType?.name ?? "") as PiiMatch["infoType"],
      startIndex: parseCodepoint(f.location?.codepointRange?.start),
      endIndex: parseCodepoint(f.location?.codepointRange?.end),
    }),
  );

  // Configure redaction text
  const deidentifyConfig: DlpDeidentifyRequest["deidentifyConfig"] = {
    infoTypeTransformations: {
      transformations: [
        {
          infoTypes,
          primitiveTransformation: {
            replaceConfig: {
              newValue: {
                stringValue: "[REDACTED]",
              },
            },
          },
        },
      ],
    },
  };

  // Execute the redaction
  const [redactResponse] = await dlp.deidentifyContent({
    parent,
    item: { value: text },
    inspectConfig,
    deidentifyConfig,
  });
  const redactedText = redactResponse.item?.value ?? undefined;

  return {
    matches,
    redactedText,
  };
};
