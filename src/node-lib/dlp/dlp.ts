import DLP, { protos } from "@google-cloud/dlp";
import { GoogleAuth } from "google-auth-library";

import { getGcpOidc } from "@/node-lib/oidc/getGcpOidc";
import { PiiMatch, TeacherNote } from "@/node-lib/pupil-api/types";

const projectId = process.env.GCP_PROJECT_ID;

if (!projectId) {
  throw new Error("GCP_PROJECT_ID is required for DLP client initialization.");
}

const externalAccountJson = getGcpOidc([
  "https://www.googleapis.com/auth/cloud-platform",
]);

const auth = new GoogleAuth({
  projectId: process.env.GCP_PROJECT_ID!,
  credentials: externalAccountJson, // same object as above
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

if (!auth) {
  throw new Error("Failed to initialize authClient for DLP.");
}

const dlp = new DLP.DlpServiceClient({
  projectId,
  // no type conflict now: plain object is structurally OK
  credentials: externalAccountJson,
});

const parent = `projects/${projectId}`;

export type PiiCheckResponse = {
  matches: PiiMatch[];
  redactedText?: string;
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
  ): number => (c ? Number.parseInt(c.toString(), 10) + 1 : -1);
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

export async function redactTeacherNoteForPII(doc: TeacherNote) {
  const [textPii, htmlPii] = await Promise.all([
    identifyPiiFromString(doc.note_text),
    identifyPiiFromString(doc.note_html),
  ]);
  doc.checkedForPii = true;
  const foundPii = (check: PiiCheckResponse) =>
    check.matches.length > 0 && check.redactedText;
  const [textMatched, htmlMatched] = [foundPii(textPii), foundPii(htmlPii)];
  if (textMatched) doc.note_text = textPii.redactedText as string;
  if (htmlMatched) doc.note_html = htmlPii.redactedText as string;
  console.log(
    `Redacting teacher note ${doc.note_id}. ${textMatched ? "Redacted PII from text." : "No PII found in text."} ${htmlMatched ? "Redacted PII from HTML." : "No PII found in HTML."}`,
  );
  return doc;
}
